import jwt from "jsonwebtoken";
import { ErrorHandler } from "../utils/utility.js";
import { TryCatch } from "./error.js";


const isAuthenticated =TryCatch(async(req,res,next)=>{

    // console.log("cookies:"+req.cookies["chattu-token"]);
    
    
    
    const token=req.cookies["chattu-token"];
    if(!token) return next(new ErrorHandler("please login to acces this route",401))

    const decodedData=jwt.verify(token,process.env.JWT_SECRET);

    console.log("decoded data:",decodedData);
    req.user=decodedData._id;
    
    next();
})

export{
    isAuthenticated,
}