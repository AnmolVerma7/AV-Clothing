import { useMemo } from 'react';
import type { Product } from '../context/ProductContext';

export interface DashboardMetrics {
  sortedBySales: Product[];
  sortedByProfit: Product[];
  categoryData: { name: string; value: number }[];
  genderData: { name: string; value: number }[];
}

// Aggregates product data into sales metrics for the dashboard
export const useSalesData = (products: Product[]): DashboardMetrics => {
  // Optimization: useMemo cache avoids expensive sorting/reducing on every render.
  // This is crucial for the dashboard where we process the entire product list.
  return useMemo(() => {
    const sortedBySales = [...products]
      .sort((a, b) => (b.totalSales || 0) - (a.totalSales || 0))
      .slice(0, 10);

    const sortedByProfit = [...products]
      .sort((a, b) => (b.totalProfit || 0) - (a.totalProfit || 0))
      .slice(0, 10);

    const categoryStats = products.reduce((acc: { [key: string]: number }, product) => {
      const sales = product.totalSales || 0;
      acc[product.category] = (acc[product.category] || 0) + sales;
      return acc;
    }, {});

    const categoryData = Object.keys(categoryStats).map((cat) => ({
      name: cat,
      value: categoryStats[cat],
    }));

    const genderStats = products.reduce((acc: { [key: string]: number }, product) => {
      const sales = product.totalSales || 0;
      acc[product.gender] = (acc[product.gender] || 0) + sales;
      return acc;
    }, {});

    const genderData = Object.keys(genderStats).map((gender) => ({
      name: gender === 'mens' ? 'Men' : gender === 'womens' ? 'Women' : gender,
      value: genderStats[gender],
    }));

    return { sortedBySales, sortedByProfit, categoryData, genderData };
  }, [products]);
};
