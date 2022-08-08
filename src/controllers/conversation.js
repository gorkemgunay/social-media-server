const Conversation = require("../models/conversation");
const User = require("../models/user");

const getConversation = async (req, res) => {
  const { conversationId } = req.params;
  const conversation = await Conversation.findById(conversationId)
    .populate("users")
    .populate({ path: "messages", populate: { path: "user" } });

  return res.send(conversation);
};

const getUserConversations = async (req, res) => {
  const { userId } = req.payload;
  const conversations = await Conversation.find({
    users: { $in: [userId] },
    group: false,
  }).populate("users");

  return res.send(conversations);
};

const getUserGroupConversations = async (req, res) => {
  const { userId } = req.payload;
  const conversations = await Conversation.find({
    users: { $in: [userId] },
    group: true,
  }).populate("users");

  return res.send(conversations);
};

const createConversation = async (req, res) => {
  const { userId } = req.payload;
  const { receiverId } = req.body;
  const findConversation = await Conversation.findOne({
    users: { $all: [userId, receiverId] },
    group: false,
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

const createGroupConversation = async (req, res) => {
  const { userId } = req.payload;
  const { receiversIds } = req.body;

  const findGroupConversation = await Conversation.findOne({
    users: { $all: [userId, ...receiversIds] },
    group: true,
  });

  if (findGroupConversation) {
    return res.send(findGroupConversation);
  }

  const groupConversation = await Conversation.create({});
  groupConversation.group = true;
  groupConversation.users.push(userId);
  receiversIds.map((receiver) => {
    const checkUser = groupConversation.users.some(
      (u) => u.toString() === receiver,
    );
    if (!checkUser) {
      groupConversation.users.push(receiver);
    }
    return false;
  });
  await groupConversation.save();
  const user = await User.findById(userId);
  user.conversations.push(groupConversation._id);
  await user.save();
  receiversIds.map(async (receiver) => {
    const u = await User.findById(receiver);
    u.conversations.push(groupConversation._id);
    await u.save();
  });

  return res.send(groupConversation);
};

const addUserToGroupConversation = async (req, res) => {
  const { userId } = req.payload;
  const { conversationId } = req.params;
  const { receiversIds } = req.body;

  const findGroupConversation = await Conversation.findOne({
    _id: conversationId,
    users: { $in: [userId] },
    group: true,
  });

  if (!findGroupConversation) {
    return res.send("Unauthorized.");
  }

  if (receiversIds) {
    receiversIds.map(async (r) => {
      const checkIfUserExist = findGroupConversation.users.some(
        (u) => u.toString() === r,
      );
      if (!checkIfUserExist) {
        findGroupConversation.users.push(r);
        const user = await User.findById(r);
        user.conversations.push(conversationId);
        await findGroupConversation.save();
        await user.save();
      }
    });

    return res.send(findGroupConversation);
  }

  return res.send("Error");
};

module.exports = {
  getConversation,
  getUserConversations,
  getUserGroupConversations,
  createConversation,
  createGroupConversation,
  addUserToGroupConversation,
};
