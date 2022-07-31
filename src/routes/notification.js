const express = require("express");
const {
  createNotification,
  getNotifications,
  deleteNotification,
} = require("../controllers/notification");
const checkAccessToken = require("../middlewares/checkAccessToken");

const router = express.Router();

router.get("/", checkAccessToken, getNotifications);
router.post("/", checkAccessToken, createNotification);
router.delete("/:notificationId", checkAccessToken, deleteNotification);

module.exports = router;
