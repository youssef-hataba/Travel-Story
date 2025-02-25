const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
  const {fullName, email, password} = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({message: "All fields are required"});
  }

  const existingUser = await User.findOne({email});
  if (existingUser) {
    return res.status(400).json({message: "User already exists"});
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({fullName, email, password: hashedPassword});

  const accessToken = jwt.sign({userId: newUser._id}, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "30d",
  });

  res.status(201).json({user: {fullName, email}, accessToken, message: "Registration Successful"});
};

exports.login = async (req, res) => {
  const {email, password} = req.body;

  const user = await User.findOne({email});
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({message: "Invalid credentials"});
  }

  const accessToken = jwt.sign({userId: user._id}, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "30d",
  });

  res.json({
    user: {fullName: user.fullName, email: user.email},
    accessToken,
    message: "Login Successful",
  });
};
