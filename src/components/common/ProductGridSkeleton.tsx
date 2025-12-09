import { Container, Grid, Skeleton, Box } from '@mui/material';

export const ProductGridSkeleton = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {[...Array(8)].map((_, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
            <Box>
              <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 1 }} />
              <Skeleton variant="text" sx={{ mt: 1, fontSize: '1.5rem' }} />
              <Skeleton variant="text" sx={{ fontSize: '1rem' }} width="60%" />
            </Box>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};
