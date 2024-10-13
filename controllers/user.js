import { compare } from "bcrypt";
import { User } from "../models/user.js";
import { cookieOptions, sendToken } from "../utils/features.js";
import { TryCatch } from "../middlewares/error.js";
import { ErrorHandler } from "../utils/utility.js";

const newUser = async (req, res) => {
  const { name, username, password, bio } = req.body;

  // console.log(req.body);

  const avatar = {
    public_id: "sdfsd",
    url: "fhhh",
  };
  const user = await User.create({
    name,
    bio,
    username,
    password,
    avatar,
  });
  console.log("sm hi");

  sendToken(res, user, 201, "user created");
  res.status(201).json({ message: "User created successfully " + user });
};

const login = TryCatch(async (req, res, next) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid username or password", 404));
  }

  const isMatch = await compare(password, user.password);

  if (!isMatch)
    return next(new ErrorHandler("Invalid password or password", 404));

  sendToken(res, user, 200, "user welcome back");
});
const getMyProfile = TryCatch(async (req, res) => {
  // return await User.findById();

  const user = await User.findById(req.user);
  res.status(200).json({
    success: true,
    // data:req.user
    user,
  });
});

const logout = TryCatch(async (req, res) => {
  return res
    .status(200)
    .cookie("chattu-token", "", { ...cookieOptions, maxAge: 0 })
    .json({
      success: true,
      message: "User logged out successfully",
    });
});
export { login, newUser, getMyProfile, logout };
