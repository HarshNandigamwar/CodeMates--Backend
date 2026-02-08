import Message from "../models/Message.model.js";
import cloudinary from "../config/cloudinary.js";
import { io, getReceiverSocketId } from "../lib/socket.js";

// send message
export const sendMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let fileUrl = "";
    let mediaType = "text";

    if (req.file) {
      try {
        const fileBase64 = req.file.buffer.toString("base64");
        const fileUri = `data:${req.file.mimetype};base64,${fileBase64}`;

        const result = await cloudinary.uploader.upload(fileUri, {
          folder: "codemates/codemates_chats",
          resource_type: "auto",
          timeout: 60000,
        });

        fileUrl = result.secure_url;
        mediaType = result.resource_type === "video" ? "video" : "image";
      } catch (cloudinaryErr) {
        console.error("Cloudinary Upload Error:", cloudinaryErr);
        return res
          .status(500)
          .json({ message: "Media upload failed. Please try a smaller file." });
      }
    }

    const newMessage = new Message({
      sender: senderId,
      receiver: receiverId,
      text,
      fileUrl,
      mediaType: fileUrl ? mediaType : "text",
    });

    await newMessage.save();

    //Real-time Message Delivery via Socket.io
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Send Message Error:", error);
    res.status(500).json({ message: "Error sending message" });
  }
};

// get message
export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user._id;

    const messages = await Message.find({
      $or: [
        { sender: senderId, receiver: userToChatId },
        { sender: userToChatId, receiver: senderId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Error fetching messages" });
  }
};

