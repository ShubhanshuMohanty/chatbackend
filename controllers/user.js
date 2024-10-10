import { compare } from "bcrypt";
import { User } from "../models/user.js";
import { sendToken } from "../utils/features.js";

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

const login = async (req, res) => {
  // res.send('Welcome to the API!');
  const { username, password } = req.body;
  const user = await User.findOne({ username }).select("+password");

  if (!user) {
    return res.status(404).json({ message: "invalid username credentials" });
  }

  const isMatch = await compare(password, user.password);

  if (!isMatch) {
    return res.status(404).json({ message: "invalid credentials" });
  }

  sendToken(res, user, 200, "user welcome back");
};

export { login, newUser };
