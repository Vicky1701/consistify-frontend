import React, { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import './ProfileMenu.css';

const ProfileMenu = ({ onLogout, onChangePassword }) => {
  const [open, setOpen] = useState(false);

  const handleMenuToggle = () => {
    setOpen(!open);
  };

  return (
    <div className="profile-menu-container">
      <FaUserCircle
        className="profile-icon"
        size={32}
        onClick={handleMenuToggle}
        title="Profile"
      />
      {open && (
        <div className="profile-dropdown">
          <button onClick={onChangePassword} className="profile-dropdown-item">Change Password</button>
          <button onClick={onLogout} className="profile-dropdown-item">Logout</button>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
