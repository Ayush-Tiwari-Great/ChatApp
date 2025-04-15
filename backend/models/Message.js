import mongoose from "mongoose"
const messageSchema = new mongoose.Schema({
    text: {
        type:String,
        required: true
    },
    sender:{
        type:mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    receiver:{
        type:mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    }
},
{
    timestamps: true 
});


const Message = mongoose.model("Message", messageSchema);
export default Message;