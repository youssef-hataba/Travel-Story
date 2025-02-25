const User = require("../models/userModel");

exports.getUser = async (req, res) => {
  const user = await User.findById(req.user.userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json({ user, message: "User retrieved successfully" });
};
