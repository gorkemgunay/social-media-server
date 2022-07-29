const Message = require("../models/message");
const Converastion = require("../models/conversation");

const createMessage = async (req, res) => {
  const { userId } = req.payload;
  const message = await Message.create({
    text: req.body.text,
    user: userId,
    conversation: req.body.conversationId,
  });
  const conversation = await Converastion.findById(req.body.conversationId);
  conversation.messages.push(message._id);
  await conversation.save();
  return res.send(message);
};

module.exports = { createMessage };
