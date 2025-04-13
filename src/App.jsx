import React, { useContext, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { ProjectProvider } from './context/ProjectContext';
import { TaskProvider } from './context/TaskContext';
import MainLayout from './components/MainLayout';
import ProjectDashboard from './components/dashboard/ProjectDashboard';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import UserProfile from './components/UserProfile'; // Import the UserProfile component
import UserSection from './components/UserSection'; // Import the UserSection component
import GroupPage from './components/GroupPage'; // Import the GroupPage component
import './App.css';

class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h2>Something went wrong</h2>
          <button onClick={() => window.location.reload()}>Refresh Page</button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ✅ Updated ProtectedRoute with loading check
const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="loading">Loading...</div>; // or replace with a spinner
  }

  return currentUser ? children : <Navigate to="/login" replace />;
};

// ✅ Wrapper to dynamically set background class
const PageWrapper = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    document.body.className = ''; // Reset all classes
    if (location.pathname === '/login') {
      document.body.classList.add('login-page');
    } else if (location.pathname === '/register') {
      document.body.classList.add('register-page');
    }
  }, [location.pathname]);

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <AuthProvider>
          <ProjectProvider>
            <TaskProvider>
              <PageWrapper>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  {/* Protected Routes */}
                  <Route
                    path="/"
                    element={
                      <ProtectedRoute>
                        <MainLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<ProjectDashboard />} />
                    <Route path="projects" element={<ProjectDashboard />} />
                    <Route path="projects/:projectId" element={<ProjectDashboard />} />

                    {/* User-specific Routes */}
                    <Route path="userprofile" element={<UserProfile />} />
                    <Route path="usersection" element={<UserSection />} />

                    {/* Add the GroupPage route */}
                    <Route path="group/:groupId" element={<GroupPage />} />
                  </Route>

                  {/* Fallback Route */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </PageWrapper>
            </TaskProvider>
          </ProjectProvider>
        </AuthProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
