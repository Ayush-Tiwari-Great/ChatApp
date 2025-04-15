import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../utils/axios.js";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const [user, setUser] = useState({})
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await api.get('/user/profile', {
          withCredentials: true,
        });
        setUser(res.data.user);
      } catch (err) {
        console.error("Failed to fetch user profile", err);
        toast.error("Failed to fetch profile");
        navigate("/user/login");
      }
    };

    fetchUserProfile(); 
  }, [navigate]);
  if (!user) {
    return (
      <div className="text-center p-4">
        <div className="spinner-border" role="status"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white shadow-2xl rounded-md max-w-xl mx-auto h-[calc(100vh-90px)] overflow-hidden mt-3">
      <div className="flex flex-col items-center my-2">
        <h2 className="text-2xl font-semibold mb-4">Your Profile</h2>
        <img
          src={user.userDp || "/ChatApp-Dp.jpg"}
          alt="User Profile"
          className="w-32 h-32 rounded-full object-cover mb-4"
        />
        <h3 className="text-lg font-medium">{user.userName}</h3>
        <p className="text-sm text-gray-500">{user.email}</p>
      </div>
      <div className="flex justify-center items-center  mt-30">
  <button
    className="btn btn-primary"
    onClick={() => navigate(`/chat`)}
  >
    Back
  </button>
</div>
    </div>
  );
};

export default ProfilePage;
