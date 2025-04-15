import React, { useState, useEffect } from 'react';
import Sidebar from '../component/Sidebar';
import SelectedUser from '../component/SelectedUser';
import NoUser from '../component/NoUser';
import { useParams } from 'react-router-dom';

const ChatWithUser = () => {
  const { userId } = useParams();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="h-[calc(100vh-64px)] bg-black text-white relative">
      <div className="grid grid-cols-12 gap-2 p-2 h-full">
        {( !isMobile || (isMobile && !userId) ) && (
          <div className="col-span-12 md:col-span-3">
            <Sidebar />
          </div>
        )}
        {userId && (
          <div className="col-span-12 md:col-span-9">
            <SelectedUser />
          </div>
        )}
        {(!userId && !isMobile) && (
          <div className="col-span-9 hidden md:flex">
            <NoUser />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatWithUser;
