import React, { useEffect, useState, useContext } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import '../styles/MainLayout.css';
import { AuthContext } from '../context/AuthContext'; // Import AuthContext

const MainLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const { currentUser } = useContext(AuthContext); // Use currentUser from context

    useEffect(() => {
        // Redirect logic:
        if (location.pathname === '/' || location.pathname === '/Home') {
            if (currentUser) {
                navigate('/Dashboard', { replace: true });
            } else {
                navigate('/login', { replace: true });
            }
        } else if (location.pathname === '/login') {
             if(currentUser){
                 navigate('/Dashboard', {replace: true})
             }
        }
    }, [location, navigate, currentUser]); // Depend on currentUser

    // Render login page if not logged in and not already on login page
    if (!currentUser && location.pathname !== '/login') {
        return (
            <div className="login-page">
                <h1>Login Page</h1>
                {/* Remove the handleLogin here.  The Login component will handle login and navigation */}
            </div>
        );
    }

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
