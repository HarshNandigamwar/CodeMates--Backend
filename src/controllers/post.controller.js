import Post from "../models/Post.model.js";
import cloudinary from "../config/cloudinary.js";

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
      });

      mediaUrl = result.secure_url;
      // result.resource_type will return "image" or "video" from Cloudinary
      mediaType = result.resource_type;
    }

    const newPost = new Post({
      user: req.user._id,
      content,
      image: mediaUrl,
      mediaType: mediaType, // Now it will save "video" or "image" instead of "text"
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

// 🏠 Get Feed (All Posts)
export const getFeed = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "username profilePic") // Joins user data
      .populate("comments.user", "username profilePic")
      .sort({ createdAt: -1 }); // Newest first
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts" });
  }
};
