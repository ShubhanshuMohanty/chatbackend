import express from "express";
import { connectDB } from "./utils/features.js";
import dotenv from "dotenv";
import { errorMiddleware } from "./middlewares/error.js";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import { createServer } from "http";

import UserRoute from "./routes/user.js";
import ChatRoute from "./routes/chat.js";
import AdminRoute from "./routes/admin.js";
import {
  createGroupChats,
  createMessagesInAChat,
  createSingleChats,
} from "./seeders/chat.js";
// import { createUser } from "./seeders/user.js";

dotenv.config({
  path: "./.env",
});
const mongoURI = process.env.MONGO_URI;
const adminSecretKey = process.env.ADMIN_SECRET_KEY || "adsasdsdfsdfsdfd";
const envMode = process.env.NODE_ENV.trim() || "PRODUCTION";
connectDB(mongoURI);
// createUser(10);
// createSingleChats(20);
// createGroupChats(20);
// createMessagesInAChat("670f77f83585588d22746d02",50);

const PORT = process.env.PORT || 3000;
const app = express();
const server = createServer(app);
const io=new Server(server,{});
//using middleware

app.use(express.json());
app.use(cookieParser());
// app.use(express.urlencoded({ extended: true }));

app.use("/user", UserRoute);
app.use("/chat", ChatRoute);
app.use("/admin", AdminRoute);

io.on("connection",(socket)=>{

  console.log("user connected",socket.id);
  

  socket.on("disconnect",()=>{
    console.log("User disconnected");
  })
})

app.use(errorMiddleware);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

server.listen(PORT, () => {
  console.log("Server is running on port 3000");
});

export { adminSecretKey,envMode };
