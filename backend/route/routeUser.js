import express from "express"
import mongoose from "mongoose";
import bcrypt from "bcrypt"
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js"
import protectedRoute from "../middleware/auth.js";
import jwt from "jsonwebtoken";
import { upload } from "../cloudConfig.js";


const router = express.Router();

router.post("/login", async(req,res)=>{
    let {password, email} = req.body;
    if(!password || !email) return res.status(400).json({massage:"invalid credentials"});
    const user =  await User.findOne({email});
    if(!user){
        return res.status(401).json({message: "User Not Found"})
    }
    let isMatch = await bcrypt.compare( password, user.password);
    if(isMatch){
        generateToken(user, res);
        return res.status(201).json({userName:user.userName,userDp:user.userDp, email:user.email})
    }
    return res.status(401).json({message: "incorrect password"})
});

router.get("/logout",protectedRoute, (req,res)=>{
    res.clearCookie("token", {
        httpOnly: true,
        sameSite: "Strict",
        maxAge: 7*24*60*60*1000,
    })
    res.status(201).json({message: "logout successful"})
});
router.post("/signin",upload.single("dp"), async (req,res)=>{
    let {userName, password, email} = req.body;
    if(!password || !email || !userName) return res.status(400).json({massage:"invalid credentials"});
    const userCheck =  await User.findOne({email});
    if(userCheck){
        return res.status(401).json({message: "Email alreay Occupied"})
    }
    const hashedPassword = await bcrypt.hash(password,10);
    let userDp=null;
    if(req.file?.path){
    userDp = req.file.path;}
    let user = {userName, password:hashedPassword, email, userDp}
    const newUser = new User(user);
    await newUser.save();
    generateToken(newUser, res);
    res.status(201).json({userName, email, userDp});
});

router.get("/check", async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "No token, user not authenticated" });
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select("-password");
      res.status(200).json({ user: req.user });
    } catch (err) {
      res.status(401).json({ message: "Invalid or expired token" });
    }
  });

  router.get("/profile", protectedRoute, async (req, res) => {
    const token = req.cookies.token;
      if (!token) {
        return res.status(401).json({ message: "No token, user not authenticated" });
      }
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.userId).select("-password");
        res.status(200).json({ user: req.user });
      } catch (err) {
        res.status(401).json({ message: "something went wrong"});
      }
  });

router.get("/:userId",protectedRoute,async (req, res)=>{
  if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
    return res.status(400).json({ message: "Invalid user ID format" });
  }
     try{
      const receiver = await User.findById(req.params.userId);
      if(!receiver){
        return res.status(404).json({message:"user not found"});
      }
      return res.status(200).json(receiver);
     }catch(err){
       return res.status(500).json({message:"Something Occur"});
     }
});

router.get('/search/:userName', async (req, res) => {
  const userName= req.params.userName;
  if (!userName) {
    return res.status(400).json({ message: "userName is required" });
  }
  try {
    const users = await User.find({
      userName: { $regex: userName, $options: 'i' },
    }).limit(10);

    res.json(users);
  } catch (err) {
    res.status(500).send('Error fetching users');
  }
});



export default router;