import React from 'react';
import { Link } from 'react-router-dom';

const UserSection = () => {
  return (
    <div className="user-section">
      <h1>Welcome to Your Profile Section</h1>
      <p>This is the user section where you can manage your profile and settings.</p>
      <Link to="/user-profile">Go to User Profile</Link>
    </div>
  );
};

export default UserSection;
