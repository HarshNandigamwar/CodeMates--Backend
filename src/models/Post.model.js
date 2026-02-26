import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String },
    content: { type: String, required: true },
    url: { type: String, default: "https://res.cloudinary.com/darmatnf2/image/upload/v1772109026/user_pic_taeqah.png" },
    mediaType: {
      type: String,
      enum: ["image", "video", "text"],
      default: "text",
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [
      {
        profilePic: { type: String, default: "https://res.cloudinary.com/darmatnf2/image/upload/v1772109026/user_pic_taeqah.png" },
        name: { type: String, required: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);
export default Post;
