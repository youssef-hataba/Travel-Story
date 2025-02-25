const express = require("express");
const {
  addStory,
  getAllStories,
  editStory,
  deleteStory,
  filterStories,
} = require("../controllers/storyController");
const {verifyToken} = require("../middleware/authMiddleware");

const router = express.Router();
router.post("/add-travel-story", verifyToken, addStory);
router.get("/get-all-stories", verifyToken, getAllStories);
router.get("/filter", verifyToken, filterStories);
router.patch("/edit-story/:id", verifyToken, editStory);
router.delete("/delete-story/:id", verifyToken, deleteStory);

module.exports = router;
