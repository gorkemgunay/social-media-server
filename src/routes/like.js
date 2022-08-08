const express = require("express");
const { getLikes, createLike, deleteLike } = require("../controllers/like");
const checkAccessToken = require("../middlewares/checkAccessToken");

const router = express.Router();

router.get("/:postId", checkAccessToken, getLikes);
router.post("/:postId", checkAccessToken, createLike);
router.delete("/:postId", checkAccessToken, deleteLike);

module.exports = router;
