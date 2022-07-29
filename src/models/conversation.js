const mongoose = require("mongoose");

const conversationSchema = mongoose.Schema(
  {
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamp: true },
);

module.exports = mongoose.model("Conversation", conversationSchema);
