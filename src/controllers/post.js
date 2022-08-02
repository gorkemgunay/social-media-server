const Post = require("../models/post");
const User = require("../models/user");
const Comment = require("../models/comment");
const { postSchema, updatePostSchema } = require("../validations/schemas");

const getAllPosts = async (req, res) => {
  const posts = await Post.find({}).populate("user");
  return res.send(posts);
};

const getPostById = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId)
      .populate("user")
      .populate("comments");
    return res.send(post);
  } catch (error) {
    return res.send(error);
  }
};

const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const posts = await Post.find({ user: userId })
      .populate("user")
      .populate("comments");
    return res.send(posts);
  } catch (error) {
    return res.send(error);
  }
};

const createPost = async (req, res) => {
  try {
    const { userId } = req.payload;
    const validatePostSchema = await postSchema.validate(req.body, {
      abortEarly: false,
    });
    const newPost = await Post.create({
      ...validatePostSchema,
      user: userId,
    });
    const user = await User.findById(userId);
    user.posts.push(newPost._id);
    await user.save();
    return res.send(newPost);
  } catch (error) {
    return res.send(error);
  }
};

const updatePost = async (req, res) => {
  try {
    const { userId } = req.payload;
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (post.user.toString() !== userId) {
      return res.send("Unauthorized");
    }
    const validateUpdatePostSchema = await updatePostSchema.validate(req.body);
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      validateUpdatePostSchema,
      { new: true },
    );
    return res.send(updatedPost);
  } catch (error) {
    return res.send(error);
  }
};

const deletePost = async (req, res) => {
  try {
    const { userId } = req.payload;
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (post.user.toString() !== userId) {
      return res.send("unauthorized");
    }

    const deletedPost = await Post.findByIdAndDelete(postId);
    await Comment.deleteMany({ post: postId });
    await User.findByIdAndUpdate(userId, {
      $pull: { posts: postId },
    });
    return res.send(deletedPost);
  } catch (error) {
    return res.send(error);
  }
};

module.exports = {
  getAllPosts,
  getUserPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
};
