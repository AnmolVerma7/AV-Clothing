import { Box, Container, Typography, Link } from '@mui/material';

export const Footer = () => {
  return (
    <Box component="footer" sx={{ bgcolor: 'background.paper', py: 6, mt: 'auto' }}>
      <Container maxWidth="lg">
        <Typography variant="h6" align="center" gutterBottom>
          AV Clothing
        </Typography>
        <Typography variant="subtitle1" align="center" color="text.secondary" component="p">
          Built with React, Vite, and MUI
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          {'Copyright © '}
          <Link color="inherit" href="/">
            AV Clothing
          </Link>{' '}
          {new Date().getFullYear()}
          {'.'}
        </Typography>
      </Container>
    </Box>
  );
};
