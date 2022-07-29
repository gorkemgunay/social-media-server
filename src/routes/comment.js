const express = require("express");
const {
  createComment,
  getPostComments,
  deleteComment,
} = require("../controllers/comment");
const checkAccessToken = require("../middlewares/checkAccessToken");

const router = express.Router();

router.get("/:postId", checkAccessToken, getPostComments);
router.post("/", checkAccessToken, createComment);
router.delete("/:commentId", checkAccessToken, deleteComment);

module.exports = router;
