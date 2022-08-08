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
router.post(
  "/join/:conversationId",
  checkAccessToken,
  addUserToGroupConversation,
);
router.post("/group", checkAccessToken, createGroupConversation);
router.post("/", checkAccessToken, createConversation);

module.exports = router;
