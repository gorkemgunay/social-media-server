const express = require("express");
const { follow, unfollow } = require("../controllers/follow");
const checkAccessToken = require("../middlewares/checkAccessToken");

const router = express.Router();

router.get("/:userId", checkAccessToken, follow);
router.delete("/:userId", checkAccessToken, unfollow);

module.exports = router;
