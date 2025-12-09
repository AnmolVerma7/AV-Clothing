import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Paper,
  Typography,
  Divider,
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  useCart,
  type ShippingMethod,
  type Destination,
  type Order,
} from '../../context/CartContext';

export const CartSummary = () => {
  const navigate = useNavigate();
  const {
    cart,
    cartSubtotal,
    shippingCost,
    tax,
    finalTotal,
    shippingMethod,
    setShippingMethod,
    destination,
    setDestination,
    checkout,
  } = useCart();

  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // shared row style
  const summaryRowStyle = { display: 'flex', justifyContent: 'space-between' };

  const handleCheckout = () => {
    const order = checkout();
    setCompletedOrder(order);
  };

  const handleCloseModal = () => {
    setCompletedOrder(null);
    navigate('/dashboard');
  };

  return (
    <>
      <Paper variant="outlined" sx={{ p: 3, bgcolor: 'background.paper' }}>
        <Typography variant="h6" gutterBottom>
          Order Summary
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <FormControl fullWidth size="small" sx={{ mb: 3 }}>
          <InputLabel>Destination</InputLabel>
          <Select
            value={destination}
            label="Destination"
            onChange={(e) => setDestination(e.target.value as Destination)}
          >
            <MenuItem value="Canada">Canada</MenuItem>
            <MenuItem value="United States">United States</MenuItem>
            <MenuItem value="International">International</MenuItem>
          </Select>
        </FormControl>

        <Typography variant="subtitle2" gutterBottom>
          Shipping Method
        </Typography>
        <RadioGroup
          value={shippingMethod}
          onChange={(e) => setShippingMethod(e.target.value as ShippingMethod)}
          sx={{ mb: 3 }}
        >
          <FormControlLabel value="Standard" control={<Radio size="small" />} label="Standard" />
          <FormControlLabel value="Express" control={<Radio size="small" />} label="Express" />
          <FormControlLabel value="Priority" control={<Radio size="small" />} label="Priority" />
        </RadioGroup>

        <Box sx={{ ...summaryRowStyle, mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Subtotal
          </Typography>
          <Typography variant="body2">${cartSubtotal.toFixed(2)}</Typography>
        </Box>

        <Box sx={{ ...summaryRowStyle, mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Shipping
          </Typography>
          <Typography variant="body2">
            {shippingCost === 0 ? (
              <span style={{ color: '#4caf50', fontWeight: 'bold' }}>FREE</span>
            ) : (
              `$${shippingCost.toFixed(2)}`
            )}
          </Typography>
        </Box>
        {shippingCost === 0 && (
          <Typography
            variant="caption"
            color="success.main"
            display="block"
            sx={{ mb: 1, mt: -0.5 }}
          >
            (Free shipping over $500!)
          </Typography>
        )}

        <Box sx={{ ...summaryRowStyle, mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Tax {destination === 'Canada' ? '(5% GST)' : '(0%)'}
          </Typography>
          <Typography variant="body2">${tax.toFixed(2)}</Typography>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Box sx={{ ...summaryRowStyle, mb: 3 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            Total
          </Typography>
          <Typography variant="h6">${finalTotal.toFixed(2)}</Typography>
        </Box>

        <Button
          variant="contained"
          color="secondary"
          size="large"
          fullWidth
          onClick={handleCheckout}
          disabled={cart.length === 0}
        >
          Checkout
        </Button>
      </Paper>

      <Dialog open={!!completedOrder} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: 'success.main', color: 'white' }}>
          Order Confirmed! 🎉
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {completedOrder && (
            <>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Order ID: {completedOrder.id}
              </Typography>
              <Typography variant="h6" gutterBottom>
                Items:
              </Typography>
              <List dense>
                {completedOrder.items.map((item, idx) => (
                  <ListItem key={idx}>
                    <ListItemText
                      primary={item.name}
                      secondary={`Qty: ${item.quantity} × $${item.price.toFixed(2)}`}
                    />
                    <Typography>${(item.price * item.quantity).toFixed(2)}</Typography>
                  </ListItem>
                ))}
              </List>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6" color="secondary">
                  ${completedOrder.total.toFixed(2)}
                </Typography>
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button variant="contained" color="secondary" onClick={handleCloseModal} fullWidth>
            View Dashboard
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
