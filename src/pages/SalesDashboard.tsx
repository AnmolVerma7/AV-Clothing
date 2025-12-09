import { useNavigate } from 'react-router-dom';
import { Container, Typography, Button, CircularProgress } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useSalesData } from '../hooks/useSalesData';
import { SalesCharts } from '../components/dashboard/SalesCharts';
import { SalesTables } from '../components/dashboard/SalesTables';
import { OrdersTable } from '../components/dashboard/OrdersTable';

const SalesDashboard = () => {
  const { isAuthenticated } = useAuth();
  const { products, loading } = useProducts();
  const { orders } = useCart();
  const navigate = useNavigate();

  const { sortedBySales, sortedByProfit, categoryData, genderData } = useSalesData(products);

  if (!isAuthenticated) {
    return (
      <Container maxWidth="sm" sx={{ py: 10, textAlign: 'center' }}>
        <Typography variant="h4" color="error" gutterBottom>
          Access Denied
        </Typography>
        <Typography paragraph>You must be logged in to view the Sales Dashboard.</Typography>
        <Button variant="contained" onClick={() => navigate('/')}>
          Go Home
        </Button>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container sx={{ py: 10, textAlign: 'center' }}>
        <CircularProgress size={60} />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom sx={{ mb: 4 }}>
        Sales Dashboard
      </Typography>

      <OrdersTable orders={orders} />

      <SalesCharts categoryData={categoryData} genderData={genderData} />

      <SalesTables sortedBySales={sortedBySales} sortedByProfit={sortedByProfit} />
    </Container>
  );
};

export default SalesDashboard;
