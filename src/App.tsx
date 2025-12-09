import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProductProvider } from './context/ProductContext';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { AppThemeProvider } from './theme/ThemeProvider';
import { Layout } from './components/layout/Layout';

import Home from './pages/Home';
import Browse from './pages/Browse';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import SalesDashboard from './pages/SalesDashboard';
import CategoryPage from './pages/CategoryPage';

function App() {
  return (
    <AppThemeProvider>
      <AuthProvider>
        <ProductProvider>
          <CartProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Home />} />

                  <Route path="browse" element={<Browse />} />
                  <Route path="men" element={<CategoryPage category="Men" />} />
                  <Route path="women" element={<CategoryPage category="Women" />} />
                  <Route path="product/:id" element={<ProductPage />} />
                  <Route path="cart" element={<CartPage />} />
                  <Route path="dashboard" element={<SalesDashboard />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </CartProvider>
        </ProductProvider>
      </AuthProvider>
    </AppThemeProvider>
  );
}

export default App;
