const express = require("express");
const {
  getConversation,
  createConversation,
  getUserConversations,
} = require("../controllers/conversation");
const checkAccessToken = require("../middlewares/checkAccessToken");

const router = express.Router();

router.get("/user", checkAccessToken, getUserConversations);
router.get("/:conversationId", checkAccessToken, getConversation);
router.post("/", checkAccessToken, createConversation);

module.exports = router;
