import { useState, useMemo } from 'react';
import type { Product } from '../context/ProductContext';

export const useProductFilters = (products: Product[]) => {
  const [sortBy, setSortBy] = useState<string>('default');
  const [filterSize, setFilterSize] = useState<string>('all');
  const [filterColor, setFilterColor] = useState<string>('all');

  const { sizes, colors } = useMemo(() => {
    const allSizes = new Set<string>();
    const allColors = new Set<string>();

    products.forEach((p) => {
      p.sizes?.forEach((s) => allSizes.add(s));
      p.colors?.forEach((c) => allColors.add(c.name));
    });

    return {
      sizes: Array.from(allSizes).sort(),
      colors: Array.from(allColors).sort(),
    };
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (filterSize !== 'all') {
      result = result.filter((p) => p.sizes?.includes(filterSize));
    }

    if (filterColor !== 'all') {
      result = result.filter((p) => p.colors?.some((c) => c.name === filterColor));
    }

    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    return result;
  }, [products, filterSize, filterColor, sortBy]);

  const clearFilters = () => {
    setSortBy('default');
    setFilterSize('all');
    setFilterColor('all');
  };

  return {
    sortBy,
    setSortBy,
    filterSize,
    setFilterSize,
    filterColor,
    setFilterColor,
    clearFilters,
    filteredProducts,
    sizes,
    colors,
  };
};
