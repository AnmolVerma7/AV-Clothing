import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Badge,
  IconButton,
  Button,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme as useMuiTheme,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import MenuIcon from '@mui/icons-material/Menu';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../theme/ThemeProvider';
import { AboutDialog } from '../common/AboutDialog';
import { LoginDialog } from '../common/LoginDialog';

export const Header = () => {
  const { getCartCount, clearCart } = useCart();
  const { isAuthenticated, login, logout } = useAuth();
  const { mode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));

  const handleAuth = () => {
    if (isAuthenticated) {
      logout();
      clearCart();
      navigate('/');
    } else {
      setIsLoginOpen(true);
    }
    setDrawerOpen(false);
  };

  const handleLogin = (email: string, password: string) => {
    login(email, password);
    navigate('/');
  };

  const handleNavClick = (path: string) => {
    navigate(path);
    setDrawerOpen(false);
  };

  const navItems = [
    { label: 'Browse All', path: '/browse' },
    { label: 'Men', path: '/men' },
    { label: 'Women', path: '/women' },
  ];

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ mr: 2 }}>
            <Link to="/" style={{ color: 'inherit', textDecoration: 'none', fontWeight: 'bold' }}>
              AV Clothing
            </Link>
          </Typography>

          {/* Desktop Nav */}
          {!isMobile && (
            <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
              {navItems.map((item) => (
                <Button key={item.path} color="inherit" component={Link} to={item.path}>
                  {item.label}
                </Button>
              ))}
              <Button color="inherit" onClick={() => setIsAboutOpen(true)}>
                About
              </Button>
            </Box>
          )}

          {/* Spacer for mobile */}
          {isMobile && <Box sx={{ flexGrow: 1 }} />}

          {/* Right side icons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton color="inherit" onClick={toggleTheme} title="Toggle theme">
              {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>

            {!isMobile && (
              <>
                <Button color="inherit" onClick={handleAuth}>
                  {isAuthenticated ? 'Logout' : 'Login'}
                </Button>
                {isAuthenticated && (
                  <Button color="inherit" component={Link} to="/dashboard">
                    Dashboard
                  </Button>
                )}
              </>
            )}

            <IconButton component={Link} to="/cart" color="inherit">
              <Badge badgeContent={getCartCount()} color="secondary">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>

            {/* Hamburger menu for mobile */}
            {isMobile && (
              <IconButton color="inherit" onClick={() => setDrawerOpen(true)}>
                <MenuIcon />
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 250 }} role="presentation">
          <List>
            {navItems.map((item) => (
              <ListItem key={item.path} disablePadding>
                <ListItemButton onClick={() => handleNavClick(item.path)}>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  setIsAboutOpen(true);
                  setDrawerOpen(false);
                }}
              >
                <ListItemText primary="About" />
              </ListItemButton>
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={handleAuth}>
                <ListItemText primary={isAuthenticated ? 'Logout' : 'Login'} />
              </ListItemButton>
            </ListItem>
            {isAuthenticated && (
              <ListItem disablePadding>
                <ListItemButton onClick={() => handleNavClick('/dashboard')}>
                  <ListItemText primary="Dashboard" />
                </ListItemButton>
              </ListItem>
            )}
          </List>
        </Box>
      </Drawer>

      <AboutDialog open={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
      <LoginDialog open={isLoginOpen} onClose={() => setIsLoginOpen(false)} onLogin={handleLogin} />
    </>
  );
};
