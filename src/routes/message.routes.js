import express from "express";
import upload from "../middleware/multer.middleware.js";
import { protect } from "../middleware/auth.middleware.js";
import { sendMessage, getMessages } from "../controllers/message.controller.js";

const router = express.Router();

router.post("/send/:id", protect, upload.single("file"), sendMessage);
router.get("/:id", protect, getMessages);

export default router;
