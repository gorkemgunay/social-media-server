const express = require("express");
const {
  getConversation,
  createConversation,
  getUserConversations,
  addUserToGroupConversation,
  createGroupConversation,
  getUserGroupConversations,
} = require("../controllers/conversation");
const checkAccessToken = require("../middlewares/checkAccessToken");

const router = express.Router();

router.get("/user", checkAccessToken, getUserConversations);
router.get("/group", checkAccessToken, getUserGroupConversations);
router.get("/:conversationId", checkAccessToken, getConversation);
router.post("/", checkAccessToken, createConversation);
router.post("/group", checkAccessToken, createGroupConversation);
router.post(
  "/join/:conversationId",
  checkAccessToken,
  addUserToGroupConversation,
);

module.exports = router;
