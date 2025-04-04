import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import '../App.css';

const UserProfile = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="user-profile">
      <div className="user-avatar">
        <img src={user?.avatar || 'https://i.pravatar.cc/150?img=3'} alt="User Avatar" />
      </div>
      <div className="user-info">
        <span className="username">{user?.username || 'Guest'}</span>
        <span className="user-status">Online</span>
      </div>
      <button onClick={logout} className="logout-button">
        Logout
      </button>
    </div>
  );
};

export default UserProfile;