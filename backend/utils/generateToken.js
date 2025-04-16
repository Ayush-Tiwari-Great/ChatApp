import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
const generateToken = (user, res)=>{
const cookies_option = {
    httpOnly: true,
    sameSite: "Strict",
    maxAge: 7*24*60*60*1000,
    secure: process.env.NODE_ENV === "production"  ? true : false 
}
const token = jwt.sign({userId:user._id},
    JWT_SECRET,
    {expiresIn: '1h'}
);
res.cookie('token',token, cookies_option);
}

export default generateToken;