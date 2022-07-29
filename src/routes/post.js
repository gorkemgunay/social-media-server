const express = require("express");
const {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getUserPosts,
} = require("../controllers/post");
const checkAccessToken = require("../middlewares/checkAccessToken");

const router = express.Router();

router.get("/user/:userId", checkAccessToken, getUserPosts);
router.get("/:postId", checkAccessToken, getPostById);
router.get("/", checkAccessToken, getAllPosts);
router.post("/", checkAccessToken, createPost);
router.patch("/:postId", checkAccessToken, updatePost);
router.delete("/:postId", checkAccessToken, deletePost);

module.exports = router;
