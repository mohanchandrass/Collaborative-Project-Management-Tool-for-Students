import React, { useContext, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { ProjectProvider } from './context/ProjectContext';
import { TaskProvider } from './context/TaskContext';
import MainLayout from './components/MainLayout';
import ProjectDashboard from './components/dashboard/ProjectDashboard';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
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

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  return !currentUser ? <Navigate to="/login" replace /> : children;
};

// ✅ Wrapper component to dynamically set a background class
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
                  <Route path="/" element={
                    <ProtectedRoute>
                      <MainLayout />
                    </ProtectedRoute>
                  }>
                    <Route index element={<ProjectDashboard />} />
                    <Route path="projects" element={<ProjectDashboard />} />
                    <Route path="projects/:projectId" element={<ProjectDashboard />} />
                  </Route>

                  {/* Fallback */}
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
