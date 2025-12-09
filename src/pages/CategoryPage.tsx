import { Container, Typography, Grid, Box } from '@mui/material';
import { useProducts } from '../context/ProductContext';
import { ProductCard } from '../components/product/ProductCard';
import { ProductGridSkeleton } from '../components/common/ProductGridSkeleton';

interface CategoryPageProps {
  category: 'Men' | 'Women';
}

const CategoryPage = ({ category }: CategoryPageProps) => {
  const { products, loading, error } = useProducts();

  // The API uses 'mens' and 'womens', so we need to handle that.
  const filteredProducts = products.filter((product) => {
    const gender = product.gender.toLowerCase();
    const targetCategory = category.toLowerCase();

    return (
      gender === targetCategory || // matches 'men' or 'women'
      gender === `${targetCategory}s` || // matches 'mens' or 'womens'
      gender === 'unisex'
    );
  });

  if (loading) return <ProductGridSkeleton />;
  if (error)
    return (
      <Typography color="error" sx={{ p: 4, textAlign: 'center' }}>
        {error}
      </Typography>
    );

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          {category}'s Collection
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          Explore our latest styles for {category.toLowerCase()}.
        </Typography>
      </Box>

      {filteredProducts.length === 0 ? (
        <Typography variant="h6" textAlign="center" sx={{ mt: 4 }}>
          No products found in this category.
        </Typography>
      ) : (
        <Grid container spacing={4}>
          {filteredProducts.map((product) => (
            <Grid key={product.id} size={{ xs: 12, sm: 6, md: 3 }}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default CategoryPage;
