import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  Paper,
} from '@mui/material';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ProductCard } from '../components/product/ProductCard';

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, loading } = useProducts();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const product = products.find((p) => p.id === id);

  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // Clear form when switching products - this is intentional
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setSelectedSize('');
    setSelectedColor('');
  }, [id]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const handleAddToCart = () => {
    if (!product) return;
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }
    if (!selectedSize || !selectedColor) {
      alert('Please select both a size and a color!');
      return;
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      size: selectedSize,
      color: selectedColor,
      image:
        product.images?.[0] ||
        `https://placehold.co/100x100?text=${encodeURIComponent(product.name)}`,
    });

    setShowNotification(true);
  };

  if (loading) return <Typography sx={{ p: 4, textAlign: 'center' }}>Loading...</Typography>;
  if (!product)
    return <Typography sx={{ p: 4, textAlign: 'center' }}>Product not found</Typography>;

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Button onClick={() => navigate(-1)} sx={{ mb: 4, color: 'text.primary' }}>
        &larr; Back
      </Button>

      <Grid container spacing={6}>
        {/* Product Image */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={0} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <img
              src={
                product.images?.[0] ||
                `https://placehold.co/600x800?text=${encodeURIComponent(product.name)}`
              }
              alt={product.name}
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </Paper>
        </Grid>

        {/* Product Details */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box>
            <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 1 }}>
              {product.category}
            </Typography>
            <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
              {product.name}
            </Typography>
            <Typography variant="h4" color="secondary" gutterBottom sx={{ mb: 3 }}>
              ${product.price.toFixed(2)}
            </Typography>

            <Typography variant="body1" paragraph sx={{ mb: 4, lineHeight: 1.8 }}>
              {product.description}
            </Typography>

            {/* Selectors */}
            <Grid container spacing={2} sx={{ mb: 4 }}>
              <Grid size={{ xs: 6 }}>
                <FormControl fullWidth>
                  <InputLabel id="size-label">Size</InputLabel>
                  <Select
                    labelId="size-label"
                    value={selectedSize}
                    label="Size"
                    onChange={(e) => setSelectedSize(e.target.value)}
                  >
                    {product.sizes.map((size) => (
                      <MenuItem key={size} value={size}>
                        {size}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <FormControl fullWidth>
                  <InputLabel id="color-label">Color</InputLabel>
                  <Select
                    labelId="color-label"
                    value={selectedColor}
                    label="Color"
                    onChange={(e) => setSelectedColor(e.target.value)}
                  >
                    {product.colors.map((color) => (
                      <MenuItem key={color.name} value={color.name}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box
                            sx={{
                              width: 16,
                              height: 16,
                              borderRadius: '50%',
                              bgcolor: color.hex,
                              border: '1px solid #ddd',
                            }}
                          />
                          {color.name}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {/* Actions */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                fullWidth
                onClick={handleAddToCart}
                sx={{ py: 1.5 }}
              >
                Add to Cart
              </Button>
            </Box>

            <Box sx={{ mt: 4 }}>
              <Typography variant="subtitle2" gutterBottom>
                Material: {product.material}
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Snackbar
        open={showNotification}
        autoHideDuration={4000}
        onClose={() => setShowNotification(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setShowNotification(false)} severity="success" sx={{ width: '100%' }}>
          Added to cart!
        </Alert>
      </Snackbar>

      {/* Login required prompt */}
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

      {/* Related Products Section */}
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          You May Also Like
        </Typography>
        <Grid container spacing={4}>
          {products
            .filter((p) => p.category === product.category && p.id !== product.id)
            .slice(0, 4)
            .map((relatedProduct) => (
              <Grid key={relatedProduct.id} size={{ xs: 12, sm: 6, md: 3 }}>
                <ProductCard product={relatedProduct} />
              </Grid>
            ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default ProductPage;
