import jwt from "jsonwebtoken";
import User from "../models/User.model.js";


export const protect = async (req, res, next) => {
  try {
    let token = req.cookies.jwt_token;

    if (!token) {
      return res.status(401).json({ message: "Not authorized, please login" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    next();
  } catch (error) {
    res.status(401).json({ message: "Token failed or expired" });
  }
};
