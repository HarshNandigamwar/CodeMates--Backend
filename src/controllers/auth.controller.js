import User from "../models/User.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../config/cloudinary.js";

// Helper function to create a JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

//  Register new user
//  POST /api/auth/signup
export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 1. Check if user already exists
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    // 2. Hash the password (Make it unreadable)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create user in database
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // 4. Send response with token
    res.status(201).json({
      _id: user._id,
      username: user.username,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
//  Authenticate user & get token
// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user by email
    const user = await User.findOne({ email });

    // 2. Compare entered password with hashed password in DB
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        username: user.username,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

//  Update Profile Picture
//  PUT /api/auth/update-profile-pic
export const updateProfilePic = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload an image" });
    }

    // Convert the buffer from Multer to a base64 string for Cloudinary
    const fileBase64 = req.file.buffer.toString("base64");
    const fileUri = `data:${req.file.mimetype};base64,${fileBase64}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(fileUri, {
      folder: "codemates/codemates_profiles",
    });

    // Save the Cloudinary URL to the user in MongoDB
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { profilePic: result.secure_url },
      { new: true }
    ).select("-password");

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Upload failed" });
  }
};
