const Notification = require("../models/notification");
const User = require("../models/user");

const getNotifications = async (req, res) => {
  const { userId } = req.payload;
  const notifications = await Notification.find({ receiver: userId }).populate(
    "sender",
  );
  return res.send(notifications);
};

const createNotification = async (req, res) => {
  const { userId } = req.payload;

  const checkNotification = await Notification.findOne({
    type: req.body.type,
    receiver: req.body.receiverId,
    sender: userId,
  });

  if (!checkNotification) {
    const notification = await Notification.create({
      type: req.body.type,
      receiver: req.body.receiverId,
      sender: userId,
    });

    const user = await User.findById(req.body.receiverId);
    user.notifications.push(notification._id);
    await user.save();

    return res.send(notification);
  }

  return res.send(false);
};

const deleteNotification = async (req, res) => {
  const { notificationId } = req.params;
  const { userId } = req.payload;

  const notification = await Notification.findByIdAndDelete(notificationId);

  await User.findByIdAndUpdate(userId, {
    $pull: { notifications: notificationId },
  });

  return res.send(notification);
};

module.exports = { getNotifications, createNotification, deleteNotification };
