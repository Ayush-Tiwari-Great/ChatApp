import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from "../utils/axios.js";
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/userAuthStore';
import socket from "../socket.js"

const Sidebar = () => {
  const fallbackUrl = "/ChatApp-Dp.jpg";
  const { user } = useAuthStore();
  let currUser;
  if(user){
    currUser = user;
  }
  const [users, setUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const navigate = useNavigate();
  const getUsers = async () => {
    try {
      const res = await api.get('/message/chat', {
        withCredentials: true,
      });
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      toast.error(`Something went wrong: ${err}`);
    }
  };

  useEffect(() => {
    getUsers();
    socket.on("user-status", (data) => {
      setOnlineUsers((prev) => {
        const updated = new Set(prev);
        if (data.status === "online") {
          updated.add(data.userId);
        } else if (data.status === "offline") {
          updated.delete(data.userId);
        }
        return updated;
      });
    });
  
    socket.on("online-users", (userIds) => {
      setOnlineUsers(new Set(userIds));
    });
  
    if (user?._id) {
      socket.emit('add-user', user._id);
    }
    return () => {
      socket.off("user-status");
    };

  }, []);

  const handleUserClick = (userId) => {
    navigate(`/chat/${userId}`)
  };

  return (
    <div className=" h-[calc(100vh-80px)] col-span-12 md:col-span-3 bg-gradient-to-t overflow-y-auto from-sky-500 to-indigo-500 border-2 border-indigo-600 mt-1 ms-1 rounded-md p-4 space-y-4">
      {users.map((user) => (
        <button
          key={user._id}
          onClick={() => handleUserClick(user._id)}
          className="w-full flex items-center gap-3 bg-transparent hover:bg-indigo-600 active:scale-[.98] focus:outline-none focus:ring-2 focus:ring-white p-2 rounded-md transition duration-200"
        >
          <div className="w-10 rounded-full overflow-hidden">
            <img
              alt={user.userName}
              src={user.userDp || fallbackUrl}
              className="w-full h-full object-cover"
            />
          </div>
        <span className="text-white font-medium">{user.userName} {user._id === currUser?._id && <>(me)</>}</span>
        {onlineUsers.has(user?._id) && (
        <span className="h-2 w-2 rounded-full bg-green-400" />
        )}
        </button>
      ))}
    </div>
  );
};

export default Sidebar;
