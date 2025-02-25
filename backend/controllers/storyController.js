const TravelStory = require("../models/travelStoryModel");
const asyncHandler = require("express-async-handler");

// Add a new travel story
exports.addStory = asyncHandler(async (req, res) => {
  const requiredFields = ["title", "story", "visitedLocation", "imageUrl", "visitedDate"];

  const missingFields = requiredFields.filter((field) => !req.body[field]);
  if (missingFields.length) {
    res.status(400);
    throw new Error(`Missing fields: ${missingFields.join(", ")}`);
  }

  const newStory = await TravelStory.create({ ...req.body, userId: req.user.userId });

  res.status(201).json({
    message: "Story added successfully",
    travelStory: newStory,
  });
});

// Get all stories for the logged-in user
exports.getAllStories = asyncHandler(async (req, res) => {
  const stories = await TravelStory.find({ userId: req.user.userId }).sort({ isFavorite: -1 });
  res.status(200).json({ stories });
});

// Edit a story
exports.editStory = asyncHandler(async (req, res) => {
  const story = await TravelStory.findById(req.params.id);

  if (!story) {
    res.status(404);
    throw new Error("Story not found");
  }

  if (story.userId.toString() !== req.user.userId) {
    res.status(403);
    throw new Error("Unauthorized: You can't edit this story");
  }

  const updatedStory = await TravelStory.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ message: "Story updated successfully", story: updatedStory });
});

exports.filterStories = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  const { userId } = req.user;

  if (!startDate || !endDate) {
    res.status(400);
    throw new Error("Start date and end date are required");
  }

  const start = new Date(parseInt(startDate));
  const end = new Date(parseInt(endDate));

  if (isNaN(start) || isNaN(end)) {
    res.status(400);
    throw new Error("Invalid date format");
  }

  const filteredStories = await TravelStory.find({
    userId,
    visitedDate: { $gte: start, $lte: end },
  }).sort({ isFavorite: -1 });

  res.status(200).json({ message: "Filtered stories", stories: filteredStories });
});

// Delete a story
exports.deleteStory = asyncHandler(async (req, res) => {
  const story = await TravelStory.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });

  if (!story) {
    res.status(404);
    throw new Error("Story not found");
  }

  res.status(200).json({ message: "Story deleted successfully" });
});
