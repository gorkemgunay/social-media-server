const express = require("express");
const {
  getConversation,
  createConversation,
} = require("../controllers/conversation");
const checkAccessToken = require("../middlewares/checkAccessToken");

const router = express.Router();

router.get("/:conversationId", checkAccessToken, getConversation);
router.post("/", checkAccessToken, createConversation);

module.exports = router;
