const mongoose = require("mongoose");

const friendRequestSchema = mongoose.Schema({});

// var FriendRequestSchema = new Schema({
// requester: {
//     type: int,
//     required: true
// },
// recipient: {
//     type: int,
//     required: true
// },
// status:
//     type: int,
//     required: true });

module.exports = mongoose.model("FriendRequest", friendRequestSchema);
