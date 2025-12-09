import { useState } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  Snackbar,
  Alert,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { type Product } from '../../context/ProductContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
    });
    setShowSuccess(true);
  };

  return (
    <>
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardMedia
          component="img"
          height="300"
          image={
            product.images?.[0]
              ? product.images[0]
              : `https://placehold.co/300x400?text=${encodeURIComponent(product.name)}`
          }
          alt={product.name}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="h6" component="div">
            <Link
              to={`/product/${product.id}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              {product.name}
            </Link>
          </Typography>
          <Typography variant="h6" color="secondary">
            ${product.price.toFixed(2)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {product.category}
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            size="small"
            onClick={handleAddToCart}
            variant="contained"
            color="secondary"
            fullWidth
          >
            Add to Cart
          </Button>
        </CardActions>
      </Card>

      <Snackbar
        open={showLoginPrompt}
        autoHideDuration={3000}
        onClose={() => setShowLoginPrompt(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="warning" onClose={() => setShowLoginPrompt(false)}>
          Please log in to add items to your cart
        </Alert>
      </Snackbar>

      <Snackbar
        open={showSuccess}
        autoHideDuration={2000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity="success" onClose={() => setShowSuccess(false)}>
          Added to cart!
        </Alert>
      </Snackbar>
    </>
  );
};
