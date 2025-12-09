import { Container, Typography, Grid, Paper, Button } from '@mui/material';
import { useProducts } from '../context/ProductContext';
import { ProductCard } from '../components/product/ProductCard';
import { useProductFilters } from '../hooks/useProductFilters';
import { FilterBar } from '../components/browse/FilterBar';
import { ProductGridSkeleton } from '../components/common/ProductGridSkeleton';

const Browse = () => {
  const { products, loading, error } = useProducts();

  // Use custom hook for filter logic
  const {
    sortBy,
    setSortBy,
    filterSizes,
    toggleSize,
    filterColors,
    toggleColor,
    clearFilters,
    filteredProducts,
    sizes,
    colors,
  } = useProductFilters(products);

  if (loading) return <ProductGridSkeleton />;
  if (error)
    return (
      <Typography color="error" sx={{ p: 4, textAlign: 'center' }}>
        {error}
      </Typography>
    );

  return (
    <Container maxWidth="lg">
      <Typography variant="h3" component="h1" sx={{ py: 4, textAlign: 'center' }}>
        All Products
      </Typography>

      <FilterBar
        sortBy={sortBy}
        setSortBy={setSortBy}
        filterSizes={filterSizes}
        toggleSize={toggleSize}
        filterColors={filterColors}
        toggleColor={toggleColor}
        clearFilters={clearFilters}
        sizes={sizes}
        colors={colors}
      />

      <Typography variant="subtitle2" sx={{ mb: 2 }}>
        Showing {filteredProducts.length} results
      </Typography>

      {filteredProducts.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6">No products match your filters.</Typography>
          <Button sx={{ mt: 2 }} onClick={clearFilters}>
            Clear All Filters
          </Button>
        </Paper>
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

export default Browse;
