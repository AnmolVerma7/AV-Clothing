import { Container, Typography, Button, Box, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { ProductCard } from '../components/product/ProductCard';

const Home = () => {
  const { products, loading, error } = useProducts();

  const featuredProducts = products.slice(0, 4);

  if (loading) return <Typography sx={{ p: 4, textAlign: 'center' }}>Loading...</Typography>;
  if (error)
    return (
      <Typography color="error" sx={{ p: 4, textAlign: 'center' }}>
        {error}
      </Typography>
    );

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          py: 8,
          mb: 6,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
            AV Clothing
          </Typography>
          <Typography variant="h5" paragraph sx={{ mb: 4, opacity: 0.9 }}>
            Premium fashion for every occasion
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            component={Link}
            to="/browse"
            sx={{ px: 4, py: 1.5, fontSize: '1.1rem' }}
          >
            Shop Now
          </Button>
        </Container>
      </Box>

      {/* Featured Products */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 4, textAlign: 'center' }}>
          Featured Products
        </Typography>

        <Grid container spacing={4}>
          {featuredProducts.map((product) => (
            <Grid key={product.id} size={{ xs: 12, sm: 6, md: 3 }}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Button variant="outlined" color="secondary" size="large" component={Link} to="/browse">
            View All Products
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;
