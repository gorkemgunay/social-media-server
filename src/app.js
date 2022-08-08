require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const helmet = require("helmet");
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
const likeRoute = require("./routes/like");

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.URL,
    credentials: true,
  },
});

app.use(express.json());
app.use(helmet());

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
app.use("/like", likeRoute);

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
    if (data.receiversIds) {
      const ids = data.receiversIds.map((r) => r.socketId);
      io.to(socket.id).to(ids).emit("getNewMessage", data);
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

  socket.on("createConversation", async (data) => {
    const receiver = users.find((user) => user._id === data.receiver);
    if (receiver) {
      io.to(receiver.socketId).emit("getConversation", data);
    }
  });

  socket.on("createComment", async (data) => {
    io.emit("getNewComment", data);
  });

  socket.on("deleteComment", async (data) => {
    io.emit("getDeletedComment", data);
  });

  socket.on("createLike", async (data) => {
    io.emit("getNewLike", data);
  });

  socket.on("deleteLike", async (data) => {
    io.emit("getDeletedLike", data);
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

  socket.on("updateProfileSettings", async (data) => {
    users = users.map((user) => {
      if (user._id === data.profileId) {
        return { ...user, name: data.name, surname: data.surname };
      }
      return user;
    });
    io.emit("getNewProfileSettings", data);
    io.emit("getOnlineUsers", users);
  });

  socket.on("disconnect", () => {
    users = users.filter((user) => user.socketId !== socket.id);
    io.emit("getOnlineUsers", users);
  });
});

mongoose.connect(uri).then(() => console.log("DB connected."));
httpServer.listen(process.env.PORT, () => console.log("Server started."));
