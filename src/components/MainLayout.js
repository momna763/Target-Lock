import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Box, Drawer, AppBar, Toolbar, Typography, List, ListItem, ListItemIcon, ListItemText, IconButton, Avatar, Chip } from '@mui/material';
import { LogOut, Zap, Target } from 'lucide-react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SearchIcon from '@mui/icons-material/Search';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import BarChartIcon from '@mui/icons-material/BarChart';
import ReportIcon from '@mui/icons-material/Description';
import ChatIcon from '@mui/icons-material/Chat';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const drawerWidth = 240;

const navItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'Product Search', icon: <SearchIcon />, path: '/search' },
  { text: 'Trending', icon: <TrendingUpIcon />, path: '/trending' },
  { text: 'Favourites', icon: <FavoriteIcon />, path: '/favourites' },
  { text: 'Reports', icon: <ReportIcon />, path: '/reports' },
  { text: 'Analytics', icon: <BarChartIcon />, path: '/analytics' },
  { text: 'Chatbot', icon: <ChatIcon />, path: '/chatbot' },
  { text: 'Profile', icon: <AccountCircleIcon />, path: '/profile' },
];

const MainLayout = ({ children, mode, toggleTheme }) => {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }}
      >
        <Toolbar sx={{ minHeight: '70px !important' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Target className="w-8 h-8 mr-3 text-white" />
            <Typography 
              variant="h5" 
              noWrap 
              component="div" 
              sx={{ 
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #ffffff, #f0f0f0)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              Target Lock
            </Typography>
            <Chip 
              icon={<Zap className="w-4 h-4" />}
              label="AI Powered" 
              size="small"
              sx={{ 
                ml: 2, 
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.3)'
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton 
              sx={{ 
                ml: 1,
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                '&:hover': { background: 'rgba(255,255,255,0.2)' }
              }} 
              onClick={toggleTheme} 
              color="inherit"
            >
              {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
            <Avatar 
              src={currentUser?.photoURL}
              sx={{ 
                width: 40, 
                height: 40, 
                border: '2px solid rgba(255,255,255,0.3)',
                cursor: 'pointer'
              }}
              component={Link}
              to="/profile"
            />
            <IconButton 
              color="inherit" 
              onClick={handleLogout}
              sx={{
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                '&:hover': { background: 'rgba(255,255,255,0.2)' }
              }}
            >
              <LogOut />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { 
            width: drawerWidth, 
            boxSizing: 'border-box',
            background: mode === 'dark' 
              ? 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)'
              : 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)',
            borderRight: mode === 'dark' 
              ? '1px solid rgba(255,255,255,0.1)'
              : '1px solid rgba(0,0,0,0.1)',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', p: 1 }}>
          <List sx={{ pt: 2 }}>
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <ListItem 
                  button 
                  key={item.text} 
                  component={Link} 
                  to={item.path}
                  sx={{
                    mb: 1,
                    borderRadius: '12px',
                    background: isActive 
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      : 'transparent',
                    color: isActive ? 'white' : 'inherit',
                    boxShadow: isActive ? '0 4px 15px rgba(102, 126, 234, 0.4)' : 'none',
                    transform: isActive ? 'translateY(-1px)' : 'none',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: isActive 
                        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                        : mode === 'dark' 
                          ? 'rgba(255,255,255,0.05)'
                          : 'rgba(0,0,0,0.05)',
                      transform: 'translateY(-2px)',
                      boxShadow: isActive 
                        ? '0 6px 20px rgba(102, 126, 234, 0.5)'
                        : '0 2px 8px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  <ListItemIcon sx={{ color: isActive ? 'white' : 'inherit', minWidth: '40px' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text} 
                    sx={{ 
                      '& .MuiTypography-root': { 
                        fontWeight: isActive ? 600 : 400,
                        fontSize: '0.95rem'
                      }
                    }}
                  />
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Drawer>
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          bgcolor: 'background.default', 
          minHeight: '100vh',
          background: mode === 'dark' 
            ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
            : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        }}
      >
        <Toolbar />
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
