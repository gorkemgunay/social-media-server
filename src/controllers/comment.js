const Comment = require("../models/comment");
const Post = require("../models/post");
const User = require("../models/user");

const getPostComments = async (req, res) => {
  const { postId } = req.params;
  const comments = await Comment.find({ post: postId }).populate("user");
  return res.send(comments);
};

const createComment = async (req, res) => {
  const { userId } = req.payload;
  const comment = await Comment.create({
    text: req.body.text,
    user: userId,
    post: req.body.postId,
  });
  const post = await Post.findById(req.body.postId);
  post.comments.push(comment._id);
  await post.save();
  return res.send(comment);
};

const deleteComment = async (req, res) => {
  const { userId } = req.payload;
  const { commentId } = req.params;
  const comment = await Comment.findById(commentId);

  if (comment) {
    if (comment.user.toString() !== userId) {
      return res.send("Unauthorized");
    }

    const deletedComment = await Comment.findByIdAndDelete(commentId);
    await User.findByIdAndUpdate(userId, {
      $pull: { comments: commentId },
    });
    return res.send(deletedComment);
  }

  return res.send(false);
};

module.exports = { createComment, getPostComments, deleteComment };
