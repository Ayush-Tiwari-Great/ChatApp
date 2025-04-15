import mongoose from "mongoose"
const userSchema = new mongoose.Schema({
    userName: {
        type:String,
        required: true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
        minlength:6
    },
    userDp:{
        type:String,
        default:""
    },

},
{ 
    timestamps: true 
});


const User = mongoose.model("User", userSchema);
export default User;