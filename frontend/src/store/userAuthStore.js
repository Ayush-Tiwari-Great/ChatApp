import { create } from 'zustand';
import api from "../utils/axios.js";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'
import socket from '../socket.js';

const useAuthStore = create((set) => ({
  isBackendWaking: false,
  pingBackend : async () => {
    set({ isBackendWaking: true });
  
    let maxAttempts = 10;
    let delay = 2000;
    let success = false;
  
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        console.log(`Attempt ${attempt}...`);
        await api.get("/ison", {
          withCredentials: true,
          timeout: 5000
        });
        success = true;
        break;
      } catch (err) {
        console.log(`Attempt ${attempt} failed. Waiting ${delay / 1000}s...`);
        await new Promise((res) => setTimeout(res, delay));
      }
    }
  
    if (!success) {
      console.error("Backend wake-up failed after all attempts.");
      toast.error("Backend not responding. Please try again later.");
    }
  
    set({ isBackendWaking: false });
  },
  user: null,
  isLogging: false,
  setUser: (user) => set({ user }),
  

  login: async (userData) =>{
    try{
        const res = await api.post('/user/login',userData,{
            withCredentials: true
          });
        set({user:res.data});
        toast.success("User logged In  successfully!");
        return true;

    } catch(err){
        toast.error(`${err.response?.data?.message}`);
        return false;
    }
  },
  signin: async (formData)=>{
    try{
        const res = await api.post('/user/signin',formData,{
            withCredentials: true,
          });
        toast.success("User created successfully!");
        set({user:res.data});
        return true;

    } catch(err){
        toast.error(`${err.response?.data?.message}`);
        return false;
    }
    
  },
  logout: async () => {
    try {
      const res = await api.get('/user/logout', {
        withCredentials: true, // Important to include cookies!
      });
      socket.disconnect();
      toast.success(res.data.message || "Logged out successfully");
      // Clear the user state if needed
      set({ user: null });
    } catch (err) {
      toast.error("Logout failed");
      console.error(err);
    }
  },
}));

export default useAuthStore;
