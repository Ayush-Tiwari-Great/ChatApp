import React from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../store/userAuthStore';

const AuthMenu = () => {
  const { user, logout } = useAuthStore();

  return (
    <div className="flex items-center gap-4">
        <>
          <Link to="/user/signin" className="btn btn-sm btn-info">Sign In</Link>
          <Link to="/user/login" className="btn btn-sm btn-info">Login</Link>
        </>
    </div>
  );
};

export default AuthMenu;
