import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

// Raw API response shape
interface RawProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  cost: number;
  currency?: string;
  gender: string;
  category: string;
  sizes: string[];
  color: { name: string; hex: string }[];
  images?: string[];
  sales: {
    domestic: number;
    international: number;
    total: number;
  };
  material?: string;
}

export interface Product extends Omit<RawProduct, 'color' | 'sales'> {
  colors: { name: string; hex: string }[];
  domesticSales: number;
  internationalSales: number;
  totalSales: number;
  totalGross: number;
  totalCost: number;
  totalProfit: number;
}

interface ProductContextValue {
  products: Product[];
  loading: boolean;
  error: string | null;
}

const ProductContext = createContext<ProductContextValue | undefined>(undefined);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        'https://gist.githubusercontent.com/rconnolly/d37a491b50203d66d043c26f33dbd798/raw/37b5b68c527ddbe824eaed12073d266d5455432a/clothing-compact.json'
      );
      if (!response.ok) throw new Error('Failed to fetch data');
      const data: RawProduct[] = await response.json();

      // Educational Note: We "enhance" the raw data immediately upon fetching.
      // This Adapter pattern lets us pre-calculate derived values (gross, cost, profit)
      // once, so the rest of the application can just read properties without doing math.
      const enhancedData: Product[] = data.map((product) => {
        const domesticSales = product.sales?.domestic || 0;
        const internationalSales = product.sales?.international || 0;
        const totalSales = domesticSales + internationalSales;
        const totalGross = totalSales * product.price;
        const totalCost = totalSales * product.cost;
        const totalProfit = totalGross - totalCost;

        return {
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          cost: product.cost,
          gender: product.gender,
          category: product.category,
          sizes: product.sizes,
          colors: product.color || [],
          material: product.material,
          domesticSales,
          internationalSales,
          totalSales,
          totalGross,
          totalCost,
          totalProfit,
        };
      });

      setProducts(enhancedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProductContext.Provider value={{ products, loading, error }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within ProductProvider');
  }
  return context;
};
