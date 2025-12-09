import { Container, Typography, Button, Grid } from '@mui/material';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { CartTable } from '../components/cart/CartTable';
import { CartSummary } from '../components/cart/CartSummary';

const CartPage = () => {
  const { cart } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Your cart is empty
        </Typography>
        <Typography color="text.secondary" paragraph>
          Looks like you haven't added anything yet.
        </Typography>
        <Button variant="contained" onClick={() => navigate('/browse')} sx={{ mt: 2 }}>
          Start Shopping
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom sx={{ mb: 4 }}>
        Shopping Cart
      </Typography>

      <Grid container spacing={4}>
        {/* LEFT COLUMN: Cart Items */}
        <Grid size={{ xs: 12, md: 8 }}>
          <CartTable />
        </Grid>

        {/* RIGHT COLUMN: Summary & Checkout */}
        <Grid size={{ xs: 12, md: 4 }}>
          <CartSummary />
        </Grid>
      </Grid>
    </Container>
  );
};

export default CartPage;
