import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';
import '../styles/MainLayout.css'; // make sure this exists

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="layout-wrapper">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className={`main-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-collapsed'}`}>
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
