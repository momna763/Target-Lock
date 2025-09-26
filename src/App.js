import React, { useState, useEffect } from 'react';
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
import ExcelReport from './pages/ExcelReport';
import PDFReport from './pages/PDFReport';
import CSVReport from './pages/CSVReport';

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
                <Route path="/reports/excel" element={<PrivateRoute><ExcelReport /></PrivateRoute>} />
                <Route path="/reports/pdf" element={<PrivateRoute><PDFReport /></PrivateRoute>} />
                <Route path="/reports/csv" element={<PrivateRoute><CSVReport /></PrivateRoute>} />
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
  // Check system preference for theme
  const getSystemTheme = () => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  };

  const [mode, setMode] = useState(() => {
    // Check localStorage first, then system preference
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || getSystemTheme();
  });

  const theme = getTheme(mode);
  
  const toggleTheme = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    localStorage.setItem('theme', newMode);
  };

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      // Only update if user hasn't manually set a preference
      if (!localStorage.getItem('theme')) {
        setMode(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

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
