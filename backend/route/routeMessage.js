import protectedRoute from "../middleware/auth.js";
import Message from "../models/Message.js";
import express from "express"
import User from "../models/User.js";
import mongoose from "mongoose";

const router = express.Router();

router.get("/chat",protectedRoute,  async (req, res)=>{
    try {
        const users = await User.find({}).select("-password");
        res.status(200).json(users);
      } catch (err) {
        res.status(500).json({ message: "Server error while fetching users." });
      }
})

router.post("/:userId", protectedRoute, async(req, res)=>{
    if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
        return res.status(400).json({ message: "Invalid user ID format" });
      }
    let {text} = req.body;
    const receiver = await User.findById(req.params.userId);
    if(!receiver){
        return res.status(404).json({message: "reciever is is incorrect"});
    }
    const message = new Message({
        text,
        sender:req.user._id,
        receiver: receiver._id
    });
    const newMessage = await message.save();
    res.status(201).json(message);
});


router.get("/:userId", protectedRoute, async (req, res)=>{
    if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
        return res.status(400).json({ message: "Invalid user ID format" });
      }
    const receiver = await User.findById(req.params.userId);
    if(!receiver){
        return res.status(404).json({message: "reciever is is incorrect"});
    }
    const allMessages = await Message.find({
        $or: [{ sender: receiver._id, receiver: req.user._id }, { sender: req.user._id, receiver: receiver._id  }]
      });
      res.status(201).json(allMessages)
})



export default router;