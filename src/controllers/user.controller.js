import User from "../models/User.model.js";
import Post from "../models/Post.model.js";

// Get user profile data by username
// GET /api/auth/profile/:username
export const getUserProfile = async (req, res) => {
  try {
    const { username } = req.params;

    // 1. Find user by username
    const user = await User.findOne({ username })
      .select("-password")
      .populate("followers", "username profilePic")
      .populate("following", "username profilePic");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. Find all posts created by this user
    const posts = await Post.find({ user: user._id })
      .sort({ createdAt: -1 }) // Newest posts first
      .populate("user", "username profilePic");

    // 3. Construct the response
    res.status(200).json({
      user: {
        ...user._doc,
        followersCount: user.followers.length,
        followingCount: user.following.length,
        postsCount: posts.length,
      },
      posts,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching profile", error: error.message });
  }
};
