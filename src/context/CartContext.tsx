import { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  image?: string;
}

export type ShippingMethod = 'Standard' | 'Express' | 'Priority';
export type Destination = 'Canada' | 'United States' | 'International';

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  date: string;
}

interface CartContextValue {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string, size?: string, color?: string) => void;
  updateQuantity: (
    itemId: string,
    size: string | undefined,
    color: string | undefined,
    quantity: number
  ) => void;
  getCartCount: () => number;
  clearCart: () => void;
  checkout: () => Order;
  orders: Order[];
  cartSubtotal: number;
  shippingCost: number;
  tax: number;
  finalTotal: number;
  shippingMethod: ShippingMethod;
  setShippingMethod: (method: ShippingMethod) => void;
  destination: Destination;
  setDestination: (dest: Destination) => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const SHIPPING_RATES = {
  Canada: { Standard: 10, Express: 15, Priority: 20 },
  'United States': { Standard: 15, Express: 25, Priority: 30 },
  International: { Standard: 20, Express: 30, Priority: 50 },
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('shoppingCart');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('completedOrders');
    return saved ? JSON.parse(saved) : [];
  });

  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>('Standard');
  const [destination, setDestination] = useState<Destination>('Canada');

  useEffect(() => {
    localStorage.setItem('shoppingCart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('completedOrders', JSON.stringify(orders));
  }, [orders]);

  const addToCart = (newItem: CartItem) => {
    setCart((prev) => {
      const existingItemIndex = prev.findIndex(
        (item) =>
          item.id === newItem.id && item.size === newItem.size && item.color === newItem.color
      );
      if (existingItemIndex >= 0) {
        const newCart = [...prev];
        newCart[existingItemIndex].quantity += newItem.quantity;
        return newCart;
      }
      return [...prev, newItem];
    });
  };

  const removeFromCart = (itemId: string, size?: string, color?: string) => {
    setCart((prev) =>
      prev.filter((item) => !(item.id === itemId && item.size === size && item.color === color))
    );
  };

  const updateQuantity = (
    itemId: string,
    size: string | undefined,
    color: string | undefined,
    quantity: number
  ) => {
    if (quantity < 1) {
      removeFromCart(itemId, size, color);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.id === itemId && item.size === size && item.color === color
          ? { ...item, quantity }
          : item
      )
    );
  };

  const getCartCount = () => cart.reduce((sum, i) => sum + i.quantity, 0);

  const clearCart = () => setCart([]);

  const { cartSubtotal, shippingCost, tax, finalTotal } = useMemo(() => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    let shipping = 0;
    if (subtotal > 0 && subtotal < 500) {
      shipping = SHIPPING_RATES[destination][shippingMethod];
    }
    const taxAmount = destination === 'Canada' ? subtotal * 0.05 : 0;
    const total = subtotal + shipping + taxAmount;
    return { cartSubtotal: subtotal, shippingCost: shipping, tax: taxAmount, finalTotal: total };
  }, [cart, destination, shippingMethod]);

  const checkout = (): Order => {
    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      items: [...cart],
      total: finalTotal,
      date: new Date().toISOString(),
    };
    setOrders((prev) => [...prev, newOrder]);
    clearCart();
    return newOrder;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        getCartCount,
        clearCart,
        checkout,
        orders,
        cartSubtotal,
        shippingCost,
        tax,
        finalTotal,
        shippingMethod,
        setShippingMethod,
        destination,
        setDestination,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
