import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext'; // <-- adjust path if needed

const Main = () => {
  useEffect(() => {
    // Check if the user is at the root route and redirect them to /home
    if (window.location.pathname === '/') {
      window.location.replace('/home');
    }
  }, []);

  return <App />;
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <Main />
    </AuthProvider>
  </React.StrictMode>
);
