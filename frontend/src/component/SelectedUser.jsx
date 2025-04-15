import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';
import React, { useEffect, useState, useRef } from 'react';
import api from "../utils/axios.js";
import MessageSender from './MessageSender';
import socket from '../socket';
import ChatHeader from './ChatHeader';

const SelectedUser = () => {
    const [allMessages, setMessages] = useState([]);
    const { userId } = useParams();
    const bottomRef = useRef(null);

    const navigate = useNavigate();
    



  const getUsers = async () => {
    try {
      const res = await api.get(`/message/${userId}`, {
        withCredentials: true,
      });
      
      setMessages(res.data)
    } catch (err) {
      toast.error(`Something went wrong:`);
    }
  };

  useEffect(() => {
    const handleReceiveMessage = (msg) => {
      if ([msg.sender, msg.receiver].includes(userId)) {
        setMessages((prev) => [...prev, msg]);
      }
    };
  
    socket.on("receive-message", handleReceiveMessage);
  
    return () => socket.off("receive-message", handleReceiveMessage);
  }, [userId]);

  useEffect(() => {
    getUsers();
  }, [userId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [allMessages]);


  return (
    <div className="col-span-9 bg-white mt-1 ms-1 rounded-md flex flex-col h-[calc(100vh-80px)]">
      
      <ChatHeader/>
    <div className="flex-grow overflow-y-auto px-4 pt-4 space-y-3">
      {allMessages.map((message, index) => (
        <div className={`chat ${userId === message.sender ? "chat-start" : "chat-end"}`} key={index}>
          <div className="chat-bubble chat-bubble-primary">{message.text}</div>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
    <MessageSender onMessageSent={(msg) => setMessages((prev) => [...prev, msg])} />
  </div>
  
  )
}

export default SelectedUser
