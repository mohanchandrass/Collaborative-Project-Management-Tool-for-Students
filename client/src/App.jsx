import React, { useContext, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { ProjectProvider } from './context/ProjectContext';
import { TaskProvider } from './context/TaskContext';
import MainLayout from './components/MainLayout';
import ProjectDashboard from './components/dashboard/ProjectDashboard';
import Home from './components/dashboard/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import UserProfile from './components/UserProfile';
import UserSection from './components/UserSection';
import GroupPage from './components/GroupPage';
import Chat from './components/Chat';
import TaskChart from './components/dashboard/TaskChart';
import TaskStatus from './components/dashboard/TaskStatus';
import UserDashboard from './components/dashboard/UserDashboard';
import ChartGenerator from './components/dashboard/ChartGenerator';
import Calculator from './components/dashboard/Calculator';
import Dictionary from './components/dashboard/Dictionary';
import './App.css';
import ReportGenerator from './components/dashboard/ReportGenerator'; // Ensure it's imported

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
  const { currentUser, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return currentUser ? children : <Navigate to="/login" replace />;
};

const PageWrapper = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    document.body.className = '';
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
                  <Route path="/" element={<Home />} /> 
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  

                  <Route
                    path="/"
                    element={
                      <ProtectedRoute>
                        <MainLayout />
                      </ProtectedRoute>
                    }
                  >
                    
                    <Route path="projects" element={<ProjectDashboard />} />
                    <Route path="projects/:projectId" element={<ProjectDashboard />} />
                    <Route path="userprofile" element={<UserProfile />} />
                    <Route path="usersection" element={<UserSection />} />
                    <Route path="/chat" element={<Chat />} />
                    <Route path="group/:groupId" element={<GroupPage />} />
                    <Route path="/TaskStatus/:groupId" element={<TaskStatus />} />
                    <Route path="/TaskStatus/:groupId/chart" element={<TaskChart />} />

                    <Route path="/chart/:groupId" element={<TaskChart />} />
                    <Route path="/dashboard" element={<UserDashboard />} />
                    <Route path="/chart-generator" element={<ChartGenerator />} />
                    <Route path="/Calculator" element={<Calculator />} />
                    <Route path="/Dictionary" element={<Dictionary />} />
                    <Route path="/report-generator" element={<ReportGenerator />} />
                   
                  </Route>
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
