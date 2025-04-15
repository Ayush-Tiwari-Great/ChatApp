import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors  from 'cors';
import { Server } from "socket.io";
import http from 'http'
import path from "path";
dotenv.config();

const __dirname = path.resolve();

const app = express();
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
  }));
const server = http.createServer(app);
const io = new Server(server, {
    cors:({
        origin: 'http://localhost:5173',
        credentials: true
    })
    
});
let onlineuser = new Map();

const DbConnect = async ()=>{
    await mongoose.connect(process.env.MONGO_URL)
}

DbConnect().then((res)=>{
    console.log("connected")
}).catch((err)=>{
    console.log("error occur", err)
})

app.use(express.urlencoded({extended:true}));
app.use(express.json());
import cookieParser from "cookie-parser";
app.use(cookieParser());

import routUser from "./route/routeUser.js"
import routeMessage from "./route/routeMessage.js"

io.on("connection", (socket)=>{
    socket.on("add-user", (userId)=>{
        onlineuser.set(userId, socket.id);
        console.log("user connected", socket.id)
        socket.broadcast.emit("user-status", { userId, status: "online" });
        const onlineUserIds = [...onlineuser.keys()].filter((id) => id !== userId);
        socket.emit("online-users", onlineUserIds);
    });
    socket.on("send-message", (data)=>{
        const receiverSocketId = onlineuser.get(data.receiver);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("receive-message", data);
            console.log(receiverSocketId);
        }
    });
    socket.on("disconnect", ()=>{
        for(let [key, value] of onlineuser.entries()){
            if(value===socket.id){
                onlineuser.delete(key);
                io.emit("user-status", { userId: key, status: "offline" });
                break;
            }
        }
    });

});

app.get("/", (req, res)=>{
    res.send("working");
});
    app.get("/ison", (req, res) => {
        res.status(200).json({ message: "Backend is running 🚀" });
      });


app.use("/user", routUser);
app.use("/message", routeMessage)

app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
  });
  

if(process.env.NODE_ENV == "production"){
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
    app.get("*", (req, res)=>{
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"))
    })
}
  
server.listen(2000, ()=>{
    console.log("lestning");
});