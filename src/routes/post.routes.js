import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import upload from "../middleware/multer.middleware.js";
import {
  createPost,
  getFollowedPosts,
  likePost,
  commentPost,
  editPost,
  deletePost,
} from "../controllers/post.controller.js";

const router = express.Router();

router.post("/create", protect, upload.single("url"), createPost);
router.get("/feed", protect, getFollowedPosts);
router.put("/like/:id", protect, likePost);
router.post("/comment/:id", protect, commentPost);
router.put("/edit/:id", protect, upload.single("url"), editPost);
router.delete("/:id", protect, deletePost);

export default router;
