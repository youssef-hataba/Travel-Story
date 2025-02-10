require("dotenv").config();
const config = require("./config.json");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const {verifyToken} = require("./utilities");

const User = require("./models/userModel");
const TravelStory = require("./models/travelStoryModel");

mongoose.connect(config.connectionString);

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
      user: userId,
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



app.listen(3000);
module.exports = app;
