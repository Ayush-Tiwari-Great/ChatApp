import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../utils/axios.js";

const ChatHeader = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);

  const handleBack = () => {
    navigate('/chat');
  };


  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await api.get(`/user/${userId}`, {
          withCredentials: true,
        });
        setUserInfo(res.data);
      } catch (err) {
        console.error("Failed to fetch user info");
      }
    };
    getUser();
  }, [userId]);

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-sky-500 text-white rounded-t-md shadow-md">
      <div className="flex items-center gap-3">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-white hover:text-gray-100 p-2 rounded-full transition"
        >
          <i className="fa-solid fa-arrow-left"></i>
        </button>
  
        {userInfo && (
          <div className="flex items-center gap-2">
            <img
              src={userInfo.userDp || "/ChatApp-Dp.jpg"}
              alt={userInfo.userName}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="text-lg font-semibold">{userInfo.userName}</div>
          </div>
        )}
      </div>
  
    </div>
  );
  
};

export default ChatHeader;
