import express from "express";
import {
  checkAuth,
  signup,
  login,
  updateProfilePic,
  searchUsers,
  followUnfollowUser,
  updateProfile,
  logout,
} from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import upload from "../middleware/multer.middleware.js";
import { getUserProfile } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

router.get("/check", protect, checkAuth);

router.put(
  "/update-profile-pic",
  protect,
  upload.single("profilePic"),
  updateProfilePic
);
router.get("/search/:query", protect, searchUsers);
router.post("/follow/:id", protect, followUnfollowUser);
router.get("/profile/:username", protect, getUserProfile);
router.put(
  "/update-profile",
  protect,
  upload.single("profilePic"),
  updateProfile
);
router.post("/logout", logout);

export default router;
