import { useEffect, useState } from 'react'
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import Login from "./pages/Login.jsx";
import SignIn from "./pages/SignIn.jsx";
import Chat from "./pages/Chat.jsx";
import ChatWithUser from "./pages/ChatWithUser.jsx";
import Navbar from "./pages/Navbar.jsx";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from "./utils/axios.js";
import useAuthStore from './store/userAuthStore.js';
import socket from './socket.js'; 
import ProfilePage from './pages/ProfilePage.jsx';


function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser, isBackendWaking, pingBackend } = useAuthStore();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        pingBackend();
        const res = await api.get('/user/check', {
          withCredentials: true,
        });
        setUser(res.data.user);

        // Redirect logic
        if (["/user/login", "/user/signin",].includes(location.pathname)) {
          navigate("/chat");
        }
      } catch (err) {
        if (!["/user/login", "/user/signin", "/"].includes(location.pathname)) {
          navigate("/user/login");
        }
      }
    };
    fetchUser();
  }, []);

  useEffect(()=>{
    pingBackend();
  },[])

  useEffect(() => {
    if (!user?._id) return;
  
    const handleConnect = () => {
      console.log("Socket connected:", socket.id);
      socket.emit("add-user", user._id);
    };
  
    socket.on("connect", handleConnect);
  
 
    if (socket.connected) {
      socket.emit("add-user", user._id);
    }
  
    return () => {
      socket.off("connect", handleConnect);
    };
  }, [user?._id]);

  

  if (isBackendWaking) {
    return (
      <div className="h-screen flex flex-col justify-center items-center bg-base-100">
        <span className="loading loading-spinner loading-lg text-primary mb-4"></span>
        <p className="text-lg text-gray-700">Waking up the server, please wait...</p>
      </div>
    );
  }

  return (
    
    < div data-theme="light" className="pt-16">
    <ToastContainer position="top-right" autoClose={3000} />

<Navbar/>
    <Routes>

        <Route path="/" element={<HomePage/>} />
        <Route path="/user/login" element={<Login />} />
        <Route path="/user/signin" element={<SignIn />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/chat/:userId" element={<ChatWithUser />} />
        <Route path="/profile" element={<ProfilePage />} />
    </Routes>
      
    </div>
  )
}

export default App
