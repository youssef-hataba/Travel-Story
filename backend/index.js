require("dotenv").config();
const config = require("./config.json");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const upload = require("./multer");
const fs = require("fs");
const path = require("path");

const {verifyToken} = require("./utilities");

const User = require("./models/userModel");
const TravelStory = require("./models/travelStoryModel");

mongoose
  .connect(config.connectionString)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.error("🛑 MongoDB connection error:", err));

const app = express();
app.use(express.json());
app.use(cors({origin: "*"}));

// Create Account
app.post("/signup", async (req, res) => {
  const {fullName, email, password} = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({message: "All fields are required"});
  }

  const isUser = await User.findOne({email});

  if (isUser) {
    return res.status(400).json({
      error: true,
      message: "User Already Exists",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    fullName,
    email,
    password: hashedPassword,
  });
  await user.save();

  const accessToken = jwt.sign({userId: user._id}, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "30d",
  });

  return res.status(201).json({
    error: false,
    user: {fullName: user.fullName, email: user.email},
    accessToken,
    message: "Registration Successful",
  });
});

app.post("/login", async (req, res) => {
  const {email, password} = req.body;

  if (!email || !password) {
    return res.status(400).json({message: "All fields are required"});
  }

  const user = await User.findOne({email});

  if (!user) {
    return res.status(400).json({message: "User not found"});
  }

  const isMatchedPasswrod = await bcrypt.compare(password, user.password);
  if (!isMatchedPasswrod) {
    return res.status(401).json({message: "Incorrect password"});
  }

  const accessToken = jwt.sign({userId: user._id}, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "30d",
  });

  return res.json({
    error: false,
    user: {fullName: user.fullName, email: user.email},
    accessToken,
    message: "Login Successful",
  });
});

app.get("/get-user", verifyToken, async (req, res) => {
  const {userId} = req.user;

  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({message: "User not found"});
  }

  return res.json({
    error: false,
    user,
    message: "User retrieved successfully",
  });
});

app.post("/add-travel-story", verifyToken, async (req, res) => {
  const requiredFields = ["title", "story", "visitedLocation", "imageUrl", "visitedDate"];

  const missingFields = requiredFields.filter((field) => !req.body[field]);
  if (missingFields.length) {
    return res.status(400).json({
      status: "fail",
      message: `Missing fields: ${missingFields.join(", ")}`,
    });
  }

  try {
    const userId = req.user.userId;

    const newStory = await TravelStory.create({
      ...req.body,
      userId,
    });

    res.status(201).json({
      status: "success",
      data: {travelStory: newStory},
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({status: "fail", message: err.message});
    }

    res.status(500).json({
      status: "fail",
      message: "Error creating travel story",
      error: err.message,
    });
  }
});

app.patch("/edit-story/:id", verifyToken, async (req, res) => {
  try {
    const story = await TravelStory.findById(req.params.id);

    if (!story) {
      return res.status(404).json({
        status: "fail",
        message: "No travel story found with this ID",
      });
    }

    if (story.userId.toString() !== req.user.userId) {
      return res.status(403).json({
        status: "fail",
        message: "You are not authorized to edit this story",
      });
    }

    // Exclude userId from being updated
    const {userId, ...updateData} = req.body;

    const updatedStory = await TravelStory.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      data: {
        story: updatedStory,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Error updating story",
      error: err.message,
    });
  }
});

app.get("/get-all-stories", verifyToken, async (req, res) => {
  const {userId} = req.user;

  try {
    const travelStories = await TravelStory.find({userId}).sort({isFavorite: -1});
    res.status(200).json({
      status: "success",
      length: travelStories.length,
      data: {travelStories},
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: "Error retrieving travel stories",
      error: err.message,
    });
  }
});

app.delete("/delete-story/:id", verifyToken, async (req, res) => {
  try {
    const story = await TravelStory.findByIdAndDelete(req.params.id, {returnDocument: "before"});

    // Check if the story exists
    if (!story) {
      return res.status(404).json({
        status: "fail",
        message: "No travel story found with this ID",
      });
    }

    // Ensure the logged-in user is the owner of the story
    if (story.userId.toString() !== req.user.userId) {
      return res.status(403).json({
        status: "fail",
        message: "You are not authorized to delete this story",
      });
    }

    // Delete the image file associated with the story
    if (story.imageUrl) {
      const filename = path.basename(story.imageUrl);
      const filePath = path.join(__dirname, "uploads", filename);

      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Error deleting image file:", err);
        }
      });
    }

    res.status(200).json({
      status: "success",
      message: "Travel Story deleted successfully",
    });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({
      status: "fail",
      message: "Error deleting travel story",
      error: err.message,
    });
  }
});

app.post("/image-upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({message: "No image uploaded"});
    }

    const imageUrl = `http://localhost:${process.env.PORT}/uploads/${req.file.filename}`;

    res.status(201).json({message: "Image uploaded successfully", imageUrl});
  } catch (err) {
    return res.status(500).json({message: "Error uploading image", error: err.message});
  }
});

app.delete("/delete-image", async (req, res) => {
  const {imageUrl} = req.query;

  if (!imageUrl) {
    return res.status(400).json({message: "No image URL provided"});
  }

  try {
    const filename = path.basename(imageUrl);
    const filePath = path.join(__dirname, "uploads", filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.status(200).json({message: "Image deleted successfully"});
    } else {
      return res.status(404).json({message: "Image not found"});
    }
  } catch {
    return res.status(500).json({message: "Error deleting image", error: err.message});
  }
});

app.patch("/update-is-favorite/:id", verifyToken, async (req, res) => {
  try {
    const {id} = req.params;
    const {isFavorite} = req.body;
    const {userId} = req.user; // Extract userId from the authenticated user

    const story = await TravelStory.findOneAndUpdate(
      {_id: id, userId: userId}, // Ensure only the owner can update
      {isFavorite}, // Update the field
      {new: true} // Return the updated document
    );

    if (!story) {
      return res
        .status(404)
        .json({message: "No story found with this ID or you don't have permission to update it."});
    }

    res.status(200).json({message: "Story favorite status updated successfully", story});
  } catch (err) {
    res.status(500).json({message: "Internal server error", error: err.message});
  }
});

app.get("/search", verifyToken, async (req, res) => {
  const {query} = req.query;
  const {userId} = req.user;

  if (!query) {
    return res.status(400).json({message: "No search query provided"});
  }

  try {
    const searchResults = await TravelStory.find({
      userId: userId,
      $or: [
        {title: {$regex: query, $options: "i"}},
        {story: {$regex: query, $options: "i"}},
        {visitedLocation: {$regex: query, $options: "i"}},
      ],
    }).sort({isFavourite: -1});

    res.status(200).json({message: "Stories found", stories: searchResults});
  } catch (err) {
    return res.status(500).json({message: "Error searching for stories", error: err.message});
  }
});

app.get("/travel-stories/filter", verifyToken, async (req, res) => {
  const {startDate, endDate} = req.query;
  const {userId} = req.user;

  try {
    // convert startDate and endDate from millisdeconds to Date objects
    const start = new Date(parseInt(startDate));
    const end = new Date(parseInt(endDate));

    // find travel stores that belong to the auth user and fall within the date range
    const filteredStories = await TravelStory.find({
      userId: userId,
      visitedDate: {$gte: start, $lte: end},
    }).sort({isFavourite: -1});

    res.status(200).json({message: "Filtered stories", stories: filteredStories});
  } catch (err) {
    return res.status(500).json({message: "Error filtering stories", error: err.message});
  }
});

// serve static files from the uploads and assets directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// app.use('/assets',express.static(path.join(__dirname,'assets'))); placeholder

app.listen(process.env.PORT || 8000);
module.exports = app;
