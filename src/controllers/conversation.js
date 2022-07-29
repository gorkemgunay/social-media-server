const Conversation = require("../models/conversation");
const User = require("../models/user");

const getConversation = async (req, res) => {
  const { conversationId } = req.params;
  const conversation = await Conversation.findById(conversationId)
    .populate("users")
    .populate("messages");
  return res.send(conversation);
};

const createConversation = async (req, res) => {
  const { userId } = req.payload;
  const { receiverId } = req.body;
  const findConversation = await Conversation.findOne({
    users: { $all: [userId, receiverId] },
  });
  if (findConversation) {
    return res.send(findConversation);
  }
  const conversation = await Conversation.create({});
  conversation.users.push(userId);
  conversation.users.push(receiverId);
  await conversation.save();
  const sender = await User.findById(userId);
  const receiver = await User.findById(receiverId);
  sender.conversations.push(conversation._id);
  receiver.conversations.push(conversation._id);
  await sender.save();
  await receiver.save();
  return res.send(conversation);
};

module.exports = { getConversation, createConversation };
