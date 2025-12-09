import { Paper, Typography, Grid } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

interface SalesChartsProps {
  categoryData: { name: string; value: number }[];
  genderData: { name: string; value: number }[];
}

export const SalesCharts = ({ categoryData, genderData }: SalesChartsProps) => {
  return (
    <Grid container spacing={4} sx={{ mb: 6 }}>
      {/* Sales by Category (Bar Chart) */}
      <Grid size={{ xs: 12, md: 8 }}>
        <Paper sx={{ p: 3, height: 400 }}>
          <Typography variant="h6" gutterBottom>
            Sales by Category
          </Typography>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" name="Units Sold" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>

      {/* Sales by Gender (Pie Chart) */}
      <Grid size={{ xs: 12, md: 4 }}>
        <Paper sx={{ p: 3, height: 400 }}>
          <Typography variant="h6" gutterBottom>
            Sales by Gender
          </Typography>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={genderData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(props) => {
                  const name = props.name ?? '';
                  const percent = props.percent ?? 0;
                  return `${name} ${(percent * 100).toFixed(0)}%`;
                }}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {genderData.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
    </Grid>
  );
};
