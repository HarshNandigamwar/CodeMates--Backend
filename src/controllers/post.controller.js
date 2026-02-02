import Post from "../models/Post.model.js";
import cloudinary from "../config/cloudinary.js";
import User from "../models/User.model.js";

// 📝 Create a Post (Supports Image & Video)
export const createPost = async (req, res) => {
  try {
    const { content } = req.body;
    let mediaUrl = "";
    let mediaType = "text"; // Default if no file is uploaded

    if (req.file) {
      const fileBase64 = req.file.buffer.toString("base64");
      const fileUri = `data:${req.file.mimetype};base64,${fileBase64}`;

      const result = await cloudinary.uploader.upload(fileUri, {
        folder: "codemates/codemates_posts",
        resource_type: "auto",
        timeout: 60000,
      });

      mediaUrl = result.secure_url;
      mediaType = result.resource_type;
    }

    const newPost = new Post({
      user: req.user._id,
      content,
      url: mediaUrl,
      mediaType: mediaType, // it will save "video" or "image" instead of "text"
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Error creating post" });
  }
};

// 👍 Like / Unlike Post
export const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.likes.includes(req.user._id)) {
      // Already liked? Unlike it
      post.likes = post.likes.filter(
        (id) => id.toString() !== req.user._id.toString()
      );
    } else {
      // Not liked? Add like
      post.likes.push(req.user._id);
    }

    await post.save();
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// 💬 Comment on Post
export const commentPost = async (req, res) => {
  try {
    const { text } = req.body;
    const post = await Post.findById(req.params.id);

    const newComment = { user: req.user._id, text };
    post.comments.push(newComment);

    await post.save();
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "Error adding comment" });
  }
};

// 🏠 Get Feed from followed user
export const getFollowedPosts = async (req, res) => {
  try {
    // Check if User model is imported correctly
    if (typeof User === "undefined") {
      return res.status(500).json({
        message:
          "Backend Error: User model import missing at top of file post.controller.js",
      });
    }

    const currentUser = await User.findById(req.user._id);

    if (!currentUser) {
      return res.status(404).json({ message: "Login user not found" });
    }

    // 2. Fetch posts
    const posts = await Post.find({
      user: { $in: [...currentUser.following, req.user._id] },
    })
      .sort({ createdAt: -1 })
      .populate("user", "username profilePic");

    res.status(200).json(posts);
  } catch (error) {
    console.error("DEBUG FEED ERROR:", error);
    res
      .status(500)
      .json({ message: "Error fetching feed", error: error.message });
  }
};

// Edit Post
export const editPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    let post = await Post.findById(id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    // Check ownership
    if (post.user.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ message: "Unauthorized to edit this post" });
    }

    // Media update logic (if a new file is uploaded)
    if (req.file) {
      // Purani file Cloudinary se delete karein.
      if (post.url) {
        // URL se file name aur extension alag karein
        const parts = post.url.split("/");
        const filenameWithExtension = parts.pop();
        const filename = filenameWithExtension.split(".")[0];
        // Cloudinary folder path ke saath Public ID banayein
        const publicId = `codemates/codemates_posts/${filename}`;
        await cloudinary.uploader.destroy(publicId, {
          resource_type: post.mediaType === "text" ? "image" : post.mediaType,
        });
      }

      // Nayi file upload karein
      const fileBase64 = req.file.buffer.toString("base64");
      const fileUri = `data:${req.file.mimetype};base64,${fileBase64}`;
      const result = await cloudinary.uploader.upload(fileUri, {
        folder: "codemates/codemates_posts",
        resource_type: "auto",
        timeout: 60000,
      });

      post.url = result.secure_url;
      post.mediaType = result.resource_type;
    }

    // Text update karein
    if (content) post.content = content;

    await post.save();
    res.status(200).json(post);
  } catch (error) {
    console.error("Edit Error:", error);
    res
      .status(500)
      .json({ message: "Error updating post", error: error.message });
  }
};

// Delete Post
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    // Check if the person deleting is the owner
    if (post.user.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ message: "Unauthorized to delete this post" });
    }

    // If there is an image/video, delete it from Cloudinary
    if (post.url) {
      // We extract the "Public ID" from the URL
      const publicId = post.url.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(
        `codemates/codemates_posts/${publicId}`
      );
    }

    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting post" });
  }
};
