import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Layouts and Auth
import MainLayout from './components/MainLayout';
import AuthLayout from './components/AuthLayout';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';

// Page Imports
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ProductSearch from './pages/ProductSearch';
import TrendingProducts from './pages/TrendingProducts';
import ProductDetails from './pages/ProductDetails';
import Recommendations from './pages/Recommendations';
import Reports from './pages/Reports';
import Analytics from './pages/Analytics';
import Chatbot from './pages/Chatbot';
import AdminPanel from './pages/AdminPanel';
import UserProfile from './pages/UserProfile';

const getTheme = (mode) => {
  const isDark = mode === 'dark';
  return createTheme({
    palette: {
      mode,
      primary: { main: '#4f46e5' },
      secondary: { main: '#10b981' },
      background: {
        default: isDark ? '#0f172a' : '#f8fafc',
        paper: isDark ? '#1e293b' : '#ffffff',
      },
      text: {
        primary: isDark ? '#f1f5f9' : '#0f172a',
        secondary: isDark ? '#94a3b8' : '#64748b',
      },
    },
    shape: { borderRadius: 12 },
    typography: { fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif' },
  });
};

const AppRoutes = ({ mode, toggleTheme }) => {
  const { currentUser } = useAuth();

  return (
    <Routes>
      {!currentUser ? (
        <>
          <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />
          <Route path="/signup" element={<AuthLayout><Signup /></AuthLayout>} />
          <Route path="*" element={<Navigate to="/login" />} />
        </>
      ) : (
        <Route
          path="*"
          element={
            <MainLayout mode={mode} toggleTheme={toggleTheme}>
              <Routes>
                <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/search" element={<PrivateRoute><ProductSearch /></PrivateRoute>} />
                <Route path="/trending" element={<PrivateRoute><TrendingProducts /></PrivateRoute>} />
                <Route path="/product/:id" element={<PrivateRoute><ProductDetails /></PrivateRoute>} />
                <Route path="/recommendations" element={<PrivateRoute><Recommendations /></PrivateRoute>} />
                <Route path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
                <Route path="/analytics" element={<PrivateRoute><Analytics /></PrivateRoute>} />
                <Route path="/chatbot" element={<PrivateRoute><Chatbot /></PrivateRoute>} />
                <Route path="/admin" element={<PrivateRoute><AdminPanel /></PrivateRoute>} />
                <Route path="/profile" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </MainLayout>
          }
        />
      )}
    </Routes>
  );
};

const App = () => {
  const [mode, setMode] = useState('light');
  const theme = getTheme(mode);
  const toggleTheme = () => setMode((prev) => (prev === 'light' ? 'dark' : 'light'));

  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <AppRoutes mode={mode} toggleTheme={toggleTheme} />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
