import express from "express";
import { connectDB } from "./utils/features.js";
import dotenv from "dotenv";
import { errorMiddleware } from "./middlewares/error.js";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import { createServer } from "http";
import { v4 as uuid } from "uuid";

import UserRoute from "./routes/user.js";
import ChatRoute from "./routes/chat.js";
import AdminRoute from "./routes/admin.js";
import {
  createGroupChats,
  createMessagesInAChat,
  createSingleChats,
} from "./seeders/chat.js";
import { NEW_MESSAGE, NEW_MESSAGE_ALERT, ONLINE_USERS } from "./constants/events.js";
import { Message } from "./models/message.js";
import { getSockets } from "./lib/helper.js";
// import { createUser } from "./seeders/user.js";

dotenv.config({
  path: "./.env",
});
const mongoURI = process.env.MONGO_URI;
const port = process.env.PORT || 3000;
const envMode = process.env.NODE_ENV.trim() || "PRODUCTION";
const adminSecretKey = process.env.ADMIN_SECRET_KEY || "adsasdsdfsdfsdfd";
const userSocketIDs = new Map();
const onlineUsers = new Set();
connectDB(mongoURI);
// createUser(10);
// createSingleChats(20);
// createGroupChats(20);
// createMessagesInAChat("670f77f83585588d22746d02",50);

const PORT = process.env.PORT || 3000;
const app = express();
const server = createServer(app);
const io = new Server(server, {});
//using middleware

app.use(express.json());
app.use(cookieParser());
// app.use(express.urlencoded({ extended: true }));

app.use("/user", UserRoute);
app.use("/chat", ChatRoute);
app.use("/admin", AdminRoute);

io.on("connection", (socket) => {
  const user = {
    _id: "assdf",
    name: "aam admi",
  };
  userSocketIDs.set(user._id.toString(), socket.id);
  console.log("user connected", userSocketIDs);

  socket.on(NEW_MESSAGE, async ({ chatId, members, message }) => {
    const messageForRealTime = {
      content: message,
      _id: uuid(),
      sender: {
        _id: user._id,
        name: user.name,
      },
      chat: chatId,
      createdAt: new Date().toISOString(),
    };

    const messageForDB = {
      content: message,
      sender: user._id,
      chat: chatId,
    };

    const membersSocket = getSockets(members);
    io.to(membersSocket).emit(NEW_MESSAGE, {
      chatId,
      message: messageForRealTime,
    });
    io.to(membersSocket).emit(NEW_MESSAGE_ALERT, { chatId });

    /*try {
      await Message.create(messageForDB);
    } catch (error) {
      throw new Error(error);
    }*/
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
    userSocketIDs.delete(user._id.toString());
    onlineUsers.delete(user._id.toString());
    socket.broadcast.emit(ONLINE_USERS, Array.from(onlineUsers));
  });
});

app.use(errorMiddleware);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

server.listen(PORT, () => {
  console.log("Server is running on port 3000");
});

export { adminSecretKey, envMode, userSocketIDs };
