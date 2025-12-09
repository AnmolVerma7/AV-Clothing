import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Link,
} from '@mui/material';

interface AboutDialogProps {
  open: boolean;
  onClose: () => void;
}

export const AboutDialog = ({ open, onClose }: AboutDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>About AV Clothing</DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          AV Clothing
        </Typography>
        <Typography paragraph>
          A full-featured e-commerce application built with React, TypeScript, and Material UI.
          Designed to showcase modern web development best practices.
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle1" fontWeight="bold">
          Developer:
        </Typography>
        <List dense>
          <ListItem>
            <ListItemText primary="Anmol Verma" secondary="Full-Stack Developer" />
          </ListItem>
        </List>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle1" fontWeight="bold">
          Tech Stack:
        </Typography>
        <Typography variant="body2" component="div">
          <ul>
            <li>React 19 & TypeScript</li>
            <li>Vite (Build Tool)</li>
            <li>Material UI (Component Library)</li>
            <li>React Router DOM (Routing)</li>
            <li>Recharts (Data Visualization)</li>
          </ul>
        </Typography>

        <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2 }}>
          Credits & Sources:
        </Typography>
        <Typography variant="body2">
          <Link
            href="https://github.com/AnmolVerma7"
            target="_blank"
            rel="noopener"
            color="secondary"
          >
            GitHub Profile
          </Link>
          <br />
          <Link
            href="https://github.com/AnmolVerma7/AV-Clothing"
            target="_blank"
            rel="noopener"
            color="secondary"
          >
            Project Repository
          </Link>
          <br />
          Images provided by{' '}
          <Link href="https://placehold.co" target="_blank" color="secondary">
            placehold.co
          </Link>
          <br />
          Product data via GitHub Gist.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="secondary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
