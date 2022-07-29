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

let users = [];

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

  socket.on("createComment", async (data) => {
    // io.to(socket.id).emit("getUserNewComment", data);
    io.emit("getNewComment", data);
  });

  socket.on("deleteComment", async (data) => {
    // io.to(socket.id).emit("getUserNewComment", data);
    io.emit("getDeletedComment", data);
  });

  socket.on("registeredUser", async (data) => {
    io.emit("getRegisteredUser", data);
  });

  socket.on("disconnect", () => {
    users = users.filter((user) => user.socketId !== socket.id);
    io.emit("getOnlineUsers", users);
  });
});

mongoose.connect(uri).then(() => console.log("DB connected."));
httpServer.listen(process.env.PORT, () => console.log("Server started."));
