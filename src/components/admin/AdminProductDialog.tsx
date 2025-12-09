import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  Paper,
  Box,
  Divider,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { type Product } from '../../context/ProductContext';

interface AdminProductDialogProps {
  open: boolean;
  onClose: () => void;
  product: Product;
}

export const AdminProductDialog = ({ open, onClose, product }: AdminProductDialogProps) => {
  // Calculate detailed metrics
  const domesticGross = product.domesticSales * product.price;
  const internationalGross = product.internationalSales * product.price;

  const domesticCost = product.domesticSales * product.cost;
  const internationalCost = product.internationalSales * product.cost;

  const domesticProfit = domesticGross - domesticCost;
  const internationalProfit = internationalGross - internationalCost;

  // Chart Data
  const chartData = [
    {
      name: 'Domestic',
      Gross: domesticGross,
      Cost: domesticCost,
      Profit: domesticProfit,
    },
    {
      name: 'International',
      Gross: internationalGross,
      Cost: internationalCost,
      Profit: internationalProfit,
    },
    {
      name: 'Total',
      Gross: product.totalGross,
      Cost: product.totalCost,
      Profit: product.totalProfit,
    },
  ];

  // format money values
  const formatCurrency = (val: number) => `$${val.toFixed(2)}`;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>
        Admin Product View: {product.name}
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        <Grid container spacing={3}>
          {/* Sales Metrics Table */}
          <Grid size={{ xs: 12 }}>
            <Typography variant="h6" gutterBottom>
              Sales Metrics
            </Typography>
            <Paper variant="outlined">
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, p: 2 }}>
                <Typography fontWeight="bold">Metric</Typography>
                <Typography fontWeight="bold" align="right">
                  Domestic
                </Typography>
                <Typography fontWeight="bold" align="right">
                  International
                </Typography>
                <Typography fontWeight="bold" align="right">
                  Total
                </Typography>

                <Divider sx={{ gridColumn: 'span 4' }} />

                <Typography>Sales Count</Typography>
                <Typography align="right">{product.domesticSales}</Typography>
                <Typography align="right">{product.internationalSales}</Typography>
                <Typography align="right">{product.totalSales}</Typography>

                <Typography>Gross Income</Typography>
                <Typography align="right">{formatCurrency(domesticGross)}</Typography>
                <Typography align="right">{formatCurrency(internationalGross)}</Typography>
                <Typography align="right">{formatCurrency(product.totalGross)}</Typography>

                <Typography>Cost of Goods</Typography>
                <Typography align="right">{formatCurrency(domesticCost)}</Typography>
                <Typography align="right">{formatCurrency(internationalCost)}</Typography>
                <Typography align="right">{formatCurrency(product.totalCost)}</Typography>

                <Divider sx={{ gridColumn: 'span 4' }} />

                <Typography fontWeight="bold" color="success.main">
                  Net Profit
                </Typography>
                <Typography fontWeight="bold" align="right" color="success.main">
                  {formatCurrency(domesticProfit)}
                </Typography>
                <Typography fontWeight="bold" align="right" color="success.main">
                  {formatCurrency(internationalProfit)}
                </Typography>
                <Typography fontWeight="bold" align="right" color="success.main">
                  {formatCurrency(product.totalProfit)}
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Chart */}
          <Grid size={{ xs: 12 }}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Profit Analysis
            </Typography>
            <Paper variant="outlined" sx={{ p: 2, height: 350 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Legend />
                  <Bar dataKey="Gross" fill="#8884d8" />
                  <Bar dataKey="Cost" fill="#ff8042" />
                  <Bar dataKey="Profit" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="secondary">
          Close Admin View
        </Button>
      </DialogActions>
    </Dialog>
  );
};
