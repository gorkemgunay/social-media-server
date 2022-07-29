const express = require("express");
const { createMessage } = require("../controllers/message");
const checkAccessToken = require("../middlewares/checkAccessToken");

const router = express.Router();

router.post("/", checkAccessToken, createMessage);

module.exports = router;
