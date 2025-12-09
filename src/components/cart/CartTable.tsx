import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  Button,
} from '@mui/material';
import { useCart } from '../../context/CartContext';

export const CartTable = () => {
  const { cart, removeFromCart, updateQuantity } = useCart();

  // Shared styles for table header cells
  const headerCellStyle = { color: 'white' };

  return (
    <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
      <Table>
        <TableHead sx={{ bgcolor: 'primary.main' }}>
          <TableRow>
            <TableCell sx={headerCellStyle}>Product</TableCell>
            <TableCell sx={headerCellStyle}>Details</TableCell>
            <TableCell sx={headerCellStyle} align="center">
              Quantity
            </TableCell>
            <TableCell sx={headerCellStyle} align="right">
              Price
            </TableCell>
            <TableCell sx={headerCellStyle} align="right">
              Total
            </TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cart.map((item) => (
            <TableRow key={`${item.id}-${item.size}-${item.color}`}>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    component="img"
                    src={
                      item.image ||
                      `https://placehold.co/100x100?text=${encodeURIComponent(item.name)}`
                    }
                    alt={item.name}
                    sx={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 1 }}
                  />
                  <Typography variant="subtitle2" fontWeight="bold">
                    {item.name}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Typography variant="caption" display="block" color="text.secondary">
                  Size: {item.size}
                </Typography>
                <Typography variant="caption" display="block" color="text.secondary">
                  Color: {item.color}
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Box
                  sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}
                >
                  <Button
                    size="small"
                    variant="outlined"
                    sx={{ minWidth: 24, p: 0, height: 24 }}
                    onClick={() =>
                      updateQuantity(item.id, item.size, item.color, item.quantity - 1)
                    }
                  >
                    -
                  </Button>
                  <Typography variant="body2">{item.quantity}</Typography>
                  <Button
                    size="small"
                    variant="outlined"
                    sx={{ minWidth: 24, p: 0, height: 24 }}
                    onClick={() =>
                      updateQuantity(item.id, item.size, item.color, item.quantity + 1)
                    }
                  >
                    +
                  </Button>
                </Box>
              </TableCell>
              <TableCell align="right">${item.price.toFixed(2)}</TableCell>
              <TableCell align="right">${(item.price * item.quantity).toFixed(2)}</TableCell>
              <TableCell align="right">
                <Button
                  color="error"
                  size="small"
                  onClick={() => removeFromCart(item.id, item.size, item.color)}
                >
                  x
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
