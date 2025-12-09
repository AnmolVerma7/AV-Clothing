import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Badge, IconButton, Button, Box } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../theme/ThemeProvider';
import { AboutDialog } from '../common/AboutDialog';
import { LoginDialog } from '../common/LoginDialog';

export const Header = () => {
  const { getCartCount } = useCart();
  const { isAuthenticated, login, logout } = useAuth();
  const { mode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const handleAuth = () => {
    if (isAuthenticated) {
      logout();
      navigate('/');
    } else {
      setIsLoginOpen(true);
    }
  };

  const handleLogin = (email: string, password: string) => {
    login(email, password);
    navigate('/');
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ mr: 4 }}>
            <Link to="/" style={{ color: 'inherit', textDecoration: 'none', fontWeight: 'bold' }}>
              AV Clothing
            </Link>
          </Typography>

          <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
            <Button color="inherit" component={Link} to="/browse">
              Browse All
            </Button>
            <Button color="inherit" component={Link} to="/men">
              Men
            </Button>
            <Button color="inherit" component={Link} to="/women">
              Women
            </Button>
            <Button color="inherit" onClick={() => setIsAboutOpen(true)}>
              About
            </Button>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton color="inherit" onClick={toggleTheme} title="Toggle theme">
              {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>

            <Button color="inherit" onClick={handleAuth}>
              {isAuthenticated ? 'Logout' : 'Login'}
            </Button>

            {isAuthenticated && (
              <Button color="inherit" component={Link} to="/dashboard">
                Dashboard
              </Button>
            )}

            <IconButton component={Link} to="/cart" color="inherit">
              <Badge badgeContent={getCartCount()} color="secondary">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <AboutDialog open={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
      <LoginDialog open={isLoginOpen} onClose={() => setIsLoginOpen(false)} onLogin={handleLogin} />
    </>
  );
};
