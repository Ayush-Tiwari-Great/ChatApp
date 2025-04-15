import React from 'react'
import Sidebar from '../component/Sidebar.jsx'
import NoUser from '../component/NoUser.jsx'
import useAuthStore from '../store/userAuthStore'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import api from "../utils/axios.js";
import { toast } from 'react-toastify'

const Chat = () => {
  const { user, setUser } = useAuthStore();
  const navigate = useNavigate();
  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const res = await api.get('/user/check', {
          withCredentials: true,
        });

        if (!res.data.user) {
          navigate('/user/login');
        } else {
          setUser(res.data.user);
        }
      } catch (err) {
        navigate('/user/login');
      }
    };

    checkUserStatus();
  }, [navigate, setUser]);
  return (
    
    <div className='h-[calc(100vh-64px)] grid grid-cols-12 gap-2 bg-black p-2 text-white'>
    <Sidebar />
        <NoUser />
    </div>
  )
}

export default Chat
