const path = require("path");
const fs = require("fs");
const upload = require("../utilities/multer");

// Upload Image
const uploadImage = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const imageUrl = `http://localhost:${process.env.PORT}/uploads/${req.file.filename}`;
    res.status(201).json({ message: "Image uploaded successfully", imageUrl });
  } catch (err) {
    res.status(500).json({ message: "Error uploading image", error: err.message });
  }
};

// Delete Image
const deleteImage = (req, res) => {
  const { imageUrl } = req.query;

  if (!imageUrl) {
    return res.status(400).json({ message: "No image URL provided" });
  }

  try {
    const filename = path.basename(imageUrl);
    const filePath = path.join(__dirname, "../uploads", filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.status(200).json({ message: "Image deleted successfully" });
    } else {
      return res.status(404).json({ message: "Image not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error deleting image", error: err.message });
  }
};

module.exports = { uploadImage, deleteImage };
