require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const uri = require("./config/db");
const postRoute = require("./routes/post");
const userRoute = require("./routes/user");
const messageRoute = require("./routes/message");
const conversationRoute = require("./routes/conversation");
const commentRoute = require("./routes/comment");
const followRoute = require("./routes/follow");
const notificationRoute = require("./routes/notification");

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.URL,
    credentials: true,
  },
});

app.use(express.json());

app.use(
  cors({
    origin: process.env.URL,
    credentials: true,
  }),
);

app.use("/posts", postRoute);
app.use("/user", userRoute);
app.use("/message", messageRoute);
app.use("/conversation", conversationRoute);
app.use("/comment", commentRoute);
app.use("/follow", followRoute);
app.use("/notification", notificationRoute);

let users = [];
// let activeConversations = [];

io.on("connection", (socket) => {
  socket.on("userConnect", (data) => {
    const check = users.some((user) => user.socketId === socket.id);
    if (!check) {
      users.push({ ...data, socketId: socket.id });
    }
    io.emit("getOnlineUsers", users);
  });

  socket.on("createNewPost", async (data) => {
    io.emit("getNewPost", data);
    io.to(socket.id).emit("getUserNewPost", data);
  });

  socket.on("updatePost", async (data) => {
    io.emit("getUpdatedPost", data);
    io.to(socket.id).emit("getUserUpdatedPost", data);
  });

  socket.on("deletePost", async (data) => {
    io.emit("getDeletedPost", data);
    io.to(socket.id).emit("getDeletedUserPost", data);
  });

  socket.on("createMessage", async (data) => {
    const receiver = users.find((user) => user._id === data.receiverId);
    if (receiver) {
      io.to(socket.id).to(receiver.socketId).emit("getNewMessage", data);
    } else {
      io.to(socket.id).emit("getNewMessage", data);
    }
  });

  socket.on("createMessageNotification", async (data) => {
    const receiver = users.find((user) => user._id === data.receiver);
    if (receiver && data) {
      io.to(receiver.socketId).emit("getNewMessageNotification", data);
    }
  });

  socket.on("deleteMessageNotification", async (data) => {
    const receiver = users.find((user) => user._id === data.receiver);
    if (receiver && data) {
      io.to(receiver.socketId).emit("getDeletedMessageNotification", data);
    }
  });

  // socket.on("createConversation", async (data) => {
  //   const receiver = users.find((user) => user._id === data.receiverId);
  //   const checkConversation = activeConversations.find(
  //     (conversation) => conversation.conversationId === data.conversationId,
  //   );
  //   if (checkConversation) {
  //     const activeUsersFilter = checkConversation.activeUsers.some(
  //       (user) => user._id === data.user._id,
  //     );
  //     if (!activeUsersFilter) {
  //       checkConversation.activeUsers.push({
  //         ...data.user,
  //         socketId: socket.id,
  //       });
  //       if (receiver) {
  //         io.to(socket.id)
  //           .to(receiver.socketId)
  //           .emit("getCurrentConversation", checkConversation.activeUsers);
  //       } else {
  //         io.to(socket.id).emit(
  //           "getCurrentConversation",
  //           checkConversation.activeUsers,
  //         );
  //       }
  //     } else {
  //       if (receiver) {
  //         io.to(socket.id)
  //           .to(receiver.socketId)
  //           .emit("getCurrentConversation", checkConversation.activeUsers);
  //       }
  //       io.to(socket.id).emit(
  //         "getCurrentConversation",
  //         checkConversation.activeUsers,
  //       );
  //     }
  //   } else {
  //     activeConversations.push({
  //       conversationId: data.conversationId,
  //       activeUsers: [data.user],
  //       socketId: socket.id,
  //     });
  //     const getConversation = activeConversations.filter(
  //       (conversation) => conversation.conversationId === data.conversationId,
  //     );
  //     if (receiver) {
  //       io.to(socket.id)
  //         .to(receiver.socketId)
  //         .emit("getCurrentConversation", getConversation.activeUsers);
  //     } else {
  //       io.to(socket.id).emit(
  //         "getCurrentConversation",
  //         getConversation.activeUsers,
  //       );
  //     }
  //   }
  // });
  //
  // socket.on("closeConversation", async (data) => {
  //   const receiver = users.find((user) => user._id === data.receiverId);
  //   let getConversation = activeConversations.find(
  //     (conversation) => conversation.conversationId === data.conversationId,
  //   );
  //
  //   if (getConversation.activeUsers.length !== 0 && receiver) {
  //     getConversation = getConversation.activeUsers.filter(
  //       (user) => user._id !== data.user._id,
  //     );
  //
  //     io.to(receiver.socketId).emit("getCurrentConversation", getConversation);
  //   } else {
  //     activeConversations = activeConversations.filter(
  //       (conversation) => conversation.conversationId !== data.conversationId,
  //     );
  //   }
  // });
  //
  // socket.on("createMessageNotification", async (data) => {
  //   const receiver = users.find((user) => user._id === data.receiverId);
  //   const checkConversation = activeConversations.find(
  //     (conversation) => conversation.conversationId === data.conversationId,
  //   );
  //
  //   const activeUsersFilter = checkConversation.activeUsers.some(
  //     (user) => user._id === data.receiverId,
  //   );
  //
  //   if (receiver && !activeUsersFilter) {
  //     io.to(receiver.socketId).emit("getCreateMessageNotification", data);
  //   }
  // });

  socket.on("createComment", async (data) => {
    io.emit("getNewComment", data);
  });

  socket.on("deleteComment", async (data) => {
    io.emit("getDeletedComment", data);
  });

  socket.on("registeredUser", async (data) => {
    io.emit("getRegisteredUser", data);
  });

  socket.on("followUser", async (data) => {
    io.emit("getFollower", data);
  });

  socket.on("unfollowUser", async (data) => {
    io.emit("getUnfollower", data);
  });

  socket.on("disconnect", () => {
    users = users.filter((user) => user.socketId !== socket.id);
    io.emit("getOnlineUsers", users);
  });
});

mongoose.connect(uri).then(() => console.log("DB connected."));
httpServer.listen(process.env.PORT, () => console.log("Server started."));
