import React, { useState } from 'react';
import useAuthStore from '../store/userAuthStore';
import { useNavigate } from 'react-router-dom';
import socket from '../socket';
import AuthMenu from '../component/AuthMenu';
import { Link } from 'react-router-dom';
import api from '../utils/axios';

const Navbar = () => {
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const logoutHandler = async () => {
    await logout();
    navigate('/user/login');
  };

  const handleSearch = async () => {
    if (searchTerm.trim() === '') return;

    try {
      const response = await api.get(`/user/search/${searchTerm}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  React.useEffect(() => {
    if (user?._id) {
      socket.emit("add-user", user._id);
    }
  }, [user]);

  return (
    <div className="navbar fixed top-0 left-0 w-full z-50 bg-sky-950 shadow-sm">
      <div className="flex-1 text-base-100">
        <span className="btn btn-ghost text-xl hover:none">
          <i className="fa-regular fa-message pt-2"></i>Talky
        </span>
      </div>

       {user && <input
          type="text"
          placeholder="Search chats or users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className="input mx-4 w-64"
        />
       }

{searchTerm && searchResults.length > 0 && (
          <div className="absolute top-full left-0 w-full mt-2 bg-white shadow-lg rounded-md">
            <ul>
              {searchResults.map((user) => (
                <li key={user._id} className="p-2 hover:bg-gray-100 cursor-pointer" onClick={() => {
                  setSearchTerm('');
                  setSearchResults([]);
                  navigate(`/chat/${user._id}`); 
                }}>
                  <Link to={`/chat/${user._id}`} className="text-black">
                    {user.userName}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

      <div className="flex-none">
        {user ? (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img
                  alt="User avatar"
                  src={user.userDp?user.userDp:"/ChatApp-Dp.jpg"}
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
              <li><Link to="/profile" className="text-black">Profile</Link></li>
              <li><a onClick={logoutHandler}>Logout</a></li>
            </ul>
          </div>
        ) : (
          <AuthMenu />
        )}
      </div>
    </div>
  );
};

export default Navbar;
