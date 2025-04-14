import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import '../styles/MainLayout.css';

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Redirect to /dashboard/user if user lands on /dashboard or root
    if (location.pathname === '/' || location.pathname === '/dashboard') {
      navigate('/dashboard/user', { replace: true });
    }
  }, [location, navigate]);

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
