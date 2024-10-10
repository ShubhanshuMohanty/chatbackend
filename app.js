import express from "express";
import UserRoute from "./routes/user.js"
import { connectDB } from "./utils/features.js";
import dotenv from "dotenv";

dotenv.config({
    path: './.env',
})
const mongoURI= process.env.MONGO_URI;
connectDB(mongoURI);

const PORT = process.env.PORT || 3000;
const app = express();

//using middleware

app.use(express.json());
// app.use(express.urlencoded({ extended: true }));


app.use("/user",UserRoute)

app.get("/",(req,res)=>{
    res.send("Hello World!");
})

app.listen(PORT,()=>{
    console.log("Server is running on port 3000");
})