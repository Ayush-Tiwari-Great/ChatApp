import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to sign-in page after the component mounts
    navigate("/user/signin");
  }, [navigate]);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <p className="text-xl font-semibold text-gray-700">Redirecting to Sign In...</p>
    </div>
  );
};

export default HomePage;
