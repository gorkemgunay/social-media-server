const Message = require("../models/message");
const Conversation = require("../models/conversation");
const User = require("../models/user");

const createMessage = async (req, res) => {
  const { userId } = req.payload;
  const message = await Message.create({
    text: req.body.text,
    user: userId,
    conversation: req.body.conversationId,
  });
  const conversation = await Conversation.findById(req.body.conversationId);
  const user = await User.findById(userId);
  conversation.messages.push(message._id);
  user.messages.push(message._id);
  await conversation.save();
  await user.save();
  return res.send(message);
};

module.exports = { createMessage };
