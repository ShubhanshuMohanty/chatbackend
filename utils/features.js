import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const cookieOptions = {
  maxAge: 15 * 24 * 60 * 60 * 1000,
  sameSite: "none",
  httpOnly: true,
  secure: true,
};

const connectDB = (uri) => {
  mongoose
    .connect(uri, { dbName: "Chattu" })
    .then((data) => console.log(`MongoDB Connected...:${data.connection.host}`))
    .catch((err) => {
      throw err;
    });
};
const sendToken = (res, user, code, message) => {
  console.log("hi2");

  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

  console.log("hi3");

  return res.status(code).cookie("chattu-token", token, cookieOptions).json({
    success: true,
    message,
  });
};
export { connectDB, sendToken ,cookieOptions};
