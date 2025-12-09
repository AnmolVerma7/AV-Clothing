import { useState, useMemo } from 'react';
import type { Product } from '../context/ProductContext';

export const useProductFilters = (products: Product[]) => {
  const [sortBy, setSortBy] = useState<string>('default');
  const [filterSizes, setFilterSizes] = useState<string[]>([]);
  const [filterColors, setFilterColors] = useState<string[]>([]);

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

    // filter by sizes (OR logic - product must have at least one selected size)
    if (filterSizes.length > 0) {
      result = result.filter((p) => p.sizes?.some((size) => filterSizes.includes(size)));
    }

    // filter by colors (OR logic - product must have at least one selected color)
    if (filterColors.length > 0) {
      result = result.filter((p) => p.colors?.some((color) => filterColors.includes(color.name)));
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
  }, [products, filterSizes, filterColors, sortBy]);

  const toggleSize = (size: string) => {
    setFilterSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const toggleColor = (color: string) => {
    setFilterColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const clearFilters = () => {
    setSortBy('default');
    setFilterSizes([]);
    setFilterColors([]);
  };

  return {
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
  };
};
