const express = require("express");
const router = express.Router();
const upload = require("../utilities/multer");
const path = require("path");
const { uploadImage, deleteImage } = require("../controllers/imageController");

router.post("/upload", upload.single("image"), uploadImage);
router.delete("/delete", deleteImage);


module.exports = router;
