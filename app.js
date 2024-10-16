import express from "express";
import { connectDB } from "./utils/features.js";
import dotenv from "dotenv";
import { errorMiddleware } from "./middlewares/error.js";
import cookieParser from "cookie-parser";

import UserRoute from "./routes/user.js";
import ChatRoute from "./routes/chat.js";
// import { createUser } from "./seeders/user.js";

dotenv.config({
    path: './.env',
})
const mongoURI= process.env.MONGO_URI;
connectDB(mongoURI);
// createUser(10);

const PORT = process.env.PORT || 3000;
const app = express();

//using middleware

app.use(express.json());
app.use(cookieParser())
// app.use(express.urlencoded({ extended: true }));



app.use("/user",UserRoute)
app.use("/chat",ChatRoute);

app.use(errorMiddleware)

app.get("/",(req,res)=>{
    res.send("Hello World!");
})

app.listen(PORT,()=>{
    console.log("Server is running on port 3000");
})