import jwt from "jsonwebtoken";
import { ErrorHandler } from "../utils/utility.js";
import { TryCatch } from "./error.js";
import { adminSecretKey } from "../app.js";

const isAuthenticated = TryCatch(async (req, res, next) => {
  // console.log("cookies:"+req.cookies["chattu-token"]);

  const token = req.cookies["chattu-token"];
  if (!token)
    return next(new ErrorHandler("please login to acces this route", 401));

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);

  console.log("decoded data:", decodedData);
  req.user = decodedData._id;

  next();
});

const adminOnly = (req, res, next) => {
  const token = req.cookies["chattu-admin-token"];

  if (!token)
    return next(new ErrorHandler("Only Admin can access this route", 401));

  const secretKey = jwt.verify(token, process.env.JWT_SECRET);

  const isMatched = secretKey === adminSecretKey;

  if (!isMatched)
    return next(new ErrorHandler("Only Admin can access this route", 401));

  next();
};

export { isAuthenticated ,adminOnly};
