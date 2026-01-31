import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import upload from "../middleware/multer.middleware.js";
import {
  createPost,
  getFeed,
  likePost,
  commentPost,
} from "../controllers/post.controller.js";

const router = express.Router();

router.post("/create", protect, upload.single("image"), createPost);
router.get("/feed", getFeed);
router.put("/like/:id", protect, likePost);
router.post("/comment/:id", protect, commentPost);

export default router;
