import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useAuthStore from '../store/userAuthStore.js';
import api from "../utils/axios.js";
import socket from '../socket.js';

const MessageSender = ({ onMessageSent }) => {
    const [message, setMessages] = useState("");
    const { userId } = useParams();
    let {user} = useAuthStore();

    

    let changeHandler = (e)=>{
        setMessages(e.target.value)
    }
    let submitHander = async (e)=>{
        e.preventDefault();
        if(message === ''){
            toast.warn("Please enter a message!");
            return;
        }else {
             try {
                  const res = await api.post(`/message/${userId}`, {
                    text:message,
                    sender: user._id,
                    receiver: userId,
                  },{
                    withCredentials: true,
                  })
                  socket.emit("send-message", res.data)
                  onMessageSent(res.data);
                  setMessages("");

                }catch(err){
                  toast.error(`something occur ${err}`)
                }
        
    }
}
  return (
    <div className="text-black p-2 border-t border-gray-200">
      <form className="flex items-center gap-2" onSubmit={submitHander}>
        <input
          type="text"
          placeholder="Type your message..."
          className="input input-bordered w-full"
          value={message}
          onChange={changeHandler}
        />
        <button className="btn btn-primary rounded-full" type='submit'>
          <i className="fa-solid fa-paper-plane"></i>
        </button>
      </form>
    </div>
  )
}

export default MessageSender
