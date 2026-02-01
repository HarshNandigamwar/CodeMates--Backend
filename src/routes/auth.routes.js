import express from "express";
import {
  signup,
  login,
  updateProfilePic,
  searchUsers,
  followUnfollowUser,
} from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import upload from "../middleware/multer.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

router.put(
  "/update-profile-pic",
  protect,
  upload.single("profilePic"),
  updateProfilePic
);
router.get("/search/:query", protect, searchUsers);
router.post("/follow/:id", protect, followUnfollowUser);

export default router;
