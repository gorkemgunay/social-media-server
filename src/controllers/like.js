const Post = require("../models/post");
const User = require("../models/user");
const Like = require("../models/like");

const getLikes = async (req, res) => {
  const { postId } = req.params;
  const likes = await Like.find({ post: postId }).populate("user");
  return res.send(likes);
};

const createLike = async (req, res) => {
  const { userId } = req.payload;
  const { postId } = req.params;

  const post = await Post.findById(postId).populate("likes");
  const user = await User.findById(userId).populate("likes");
  const checkIfExist = await Like.findOne({ user: userId, post: postId });

  if (checkIfExist) {
    return res.send(false);
  }

  if (post && user && !checkIfExist) {
    const checkPost = post.likes.some(
      (postLike) => postLike.user.toString() === userId,
    );
    const checkUser = user.likes.some(
      (userLike) => userLike.post.toString() === postId,
    );
    if (!checkPost && !checkUser) {
      const like = await Like.create({ post: post._id, user: user._id });
      post.likes.push(like._id);
      user.likes.push(like._id);
      await post.save();
      await user.save();
      return res.send(like);
    }
    return res.send(false);
  }

  return res.send(false);
};

const deleteLike = async (req, res) => {
  const { userId } = req.payload;
  const { postId } = req.params;

  const deletedLike = await Like.findOneAndDelete({
    user: userId,
    post: postId,
  });

  if (deletedLike) {
    await User.findByIdAndUpdate(
      userId,
      {
        $pull: { likes: deletedLike._id },
      },
      { new: true },
    );
    await Post.findByIdAndUpdate(
      postId,
      {
        $pull: { likes: deletedLike._id },
      },
      { new: true },
    );
    return res.send(deletedLike);
  }

  return res.send(false);
};

module.exports = { getLikes, createLike, deleteLike };
