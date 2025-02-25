const express = require("express");
const { getUser } = require("../controllers/userController");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();
router.get("/get-user", verifyToken, getUser);

module.exports = router;
