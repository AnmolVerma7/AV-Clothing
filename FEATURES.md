# AV Clothing - Features & Learning Guide

This document explains how the AV Clothing e-commerce app works, with beginner-friendly explanations of the key concepts and implementation patterns used.

---

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Core Features Explained](#core-features-explained)
- [React Concepts Used](#react-concepts-used)
- [Common Patterns](#common-patterns)

---

## Architecture Overview

### How the App is Organized

```
src/
├── components/      # Reusable UI pieces (buttons, cards, dialogs)
├── pages/          # Full page views (Home, Browse, Cart)
├── context/        # Global state (cart, auth, products)
├── hooks/          # Reusable logic (filtering, calculations)
└── theme/          # Color scheme and styling
```

**Why this structure?**

- **components**: Small, reusable pieces make it easier to maintain and test
- **pages**: Combines components to build full views
- **context**: Shares data across the app without "prop drilling" (passing props through many components)
- **hooks**: Extracts complex logic so components stay simple

---

## Core Features Explained

### 1. Product Browsing & Multi-Select Filtering

**What it does:** Lets users select multiple sizes and colors simultaneously, and sort by price or name.

**How it works:**

```tsx
// useProductFilters.ts
const filteredProducts = useMemo(() => {
  let result = [...products];

  // Filter by sizes (OR logic - product must have at least one selected size)
  if (filterSizes.length > 0) {
    result = result.filter((p) => p.sizes?.some((size) => filterSizes.includes(size)));
  }

  // Filter by colors (OR logic - product must have at least one selected color)
  if (filterColors.length > 0) {
    result = result.filter((p) => p.colors?.some((color) => filterColors.includes(color.name)));
  }

  // Sort the results
  switch (sortBy) {
    case 'price-asc':
      result.sort((a, b) => a.price - b.price); // Cheapest first
      break;
    case 'price-desc':
      result.sort((a, b) => b.price - a.price); // Most expensive first
      break;
  }

  return result;
}, [products, filterSizes, filterColors, sortBy]);
```

**UI Implementation:**

```tsx
// FilterBar.tsx - Multi-select dropdown with checkboxes
<Select
  multiple
  value={filterSizes}
  renderValue={(selected) => (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
      {selected.map((value) => (
        <Chip key={value} label={value} size="small" color="secondary" />
      ))}
    </Box>
  )}
>
  {sortedSizes.map((size) => (
    <MenuItem key={size} value={size}>
      <Checkbox checked={filterSizes.includes(size)} />
      <ListItemText primary={size} />
    </MenuItem>
  ))}
</Select>
```

**Why multi-select?**

- More flexible: Select "S" AND "M" to see all options at once
- Uses checkboxes as required by assignment spec
- Clean dropdown UI (no visual clutter)

**Why `useMemo`?**

Filtering and sorting can be slow if you have hundreds of products. `useMemo` caches the result so React doesn't re-filter on every render—only when `products`, `filterSizes`, `filterColors`, or `sortBy` actually change.

---

### 2. Breadcrumb Navigation

**What it does:** Shows the current page's location in the site hierarchy with clickable links.

**Implementation:**

```tsx
// ProductPage.tsx
<Typography component="nav" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
  <Link to="/">Home</Link>
  <span>›</span>
  <Link to={`/${product.gender === 'mens' ? 'men' : 'women'}`}>
    {product.gender === 'mens' ? 'Men' : 'Women'}
  </Link>
  <span>›</span>
  <span>{product.category}</span>
  <span>›</span>
  <span style={{ fontWeight: 600 }}>{product.name}</span>
</Typography>
```

**Example:**
`Home › Men › Shirts › Classic Oxford Shirt`

**Why it's useful:**

- Easy navigation back to parent pages
- Shows user where they are in the site
- Improves SEO and accessibility

---

### 3. Modern Loading States

**What it does:** Shows skeleton loaders and spinners instead of "Loading..." text.

**Skeleton Loaders (for product grids):**

```tsx
// ProductGridSkeleton.tsx
export const ProductGridSkeleton = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {[...Array(8)].map((_, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
            <Skeleton variant="rectangular" height={300} />
            <Skeleton variant="text" />
            <Skeleton variant="text" width="60%" />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};
```

**Circular Progress (for slower loads):**

```tsx
// ProductPage.tsx, SalesDashboard.tsx
if (loading)
  return (
    <Container sx={{ py: 10, textAlign: 'center' }}>
      <CircularProgress size={60} />
    </Container>
  );
```

**Why this matters:**

- More professional than "Loading..." text
- Skeleton shows layout structure while loading
- Reduces perceived wait time
- Modern UX pattern (used by Facebook, LinkedIn, etc.)

---

### 4. Shopping Cart with User-Specific Persistence

**What it does:** Each user has their own cart that persists across browser sessions.

**The Problem:**
If you log out and log back in, you want your cart items to still be there, right? But if someone else logs in on the same computer, they shouldn't see _your_ cart.

**The Solution:**

```tsx
// CartContext.tsx

// Create a unique storage key for each user
const getCartKey = (email: string | null) => (email ? `cart_${email}` : 'cart_guest');

// Example:
// 'cart_admin@avclothing.com'  <- admin's cart
// 'cart_john@example.com'      <- John's cart
// 'cart_guest'                  <- not logged in
```

**How it loads the cart:**

```tsx
// When the user changes (login/logout), load their cart
useEffect(() => {
  const savedCart = localStorage.getItem(getCartKey(userEmail));
  setCart(savedCart ? JSON.parse(savedCart) : []);
}, [userEmail]);
```

**How it saves the cart:**

```tsx
// Whenever the cart changes, save it to localStorage
useEffect(() => {
  localStorage.setItem(getCartKey(userEmail), JSON.stringify(cart));
}, [cart, userEmail]);
```

**What is `localStorage`?**
It's like a browser's "notebook" where you can save small amounts of data (like strings). The data persists even if you close the browser.

---

### 5. Checkout with Dynamic Pricing

**What it does:** Calculates shipping and tax based on destination and order total.

**The Logic:**

```tsx
const { cartSubtotal, shippingCost, tax, finalTotal } = useMemo(() => {
  // Step 1: Calculate merchandise subtotal
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Step 2: Calculate shipping
  let shipping = 0;
  if (subtotal > 0 && subtotal < 500) {
    // Free shipping if over $500!
    shipping = SHIPPING_RATES[destination][shippingMethod];
  }

  // Step 3: Add tax (only for Canada)
  const taxAmount = destination === 'Canada' ? subtotal * 0.05 : 0;

  // Step 4: Final total
  const total = subtotal + shipping + taxAmount;

  return {
    cartSubtotal: subtotal,
    shippingCost: shipping,
    tax: taxAmount,
    finalTotal: total,
  };
}, [cart, destination, shippingMethod]);
```

**Why is this in `useMemo`?**
Every time the component re-renders (even from unrelated state changes), this calculation would run. With `useMemo`, it only recalculates when `cart`, `destination`, or `shippingMethod` actually change.

**Shipping Rates Table:**

```tsx
const SHIPPING_RATES = {
  Canada: { Standard: 10, Express: 15, Priority: 20 },
  'United States': { Standard: 15, Express: 25, Priority: 30 },
  International: { Standard: 20, Express: 30, Priority: 50 },
};
```

---

### 6. Sales Dashboard (Admin Only)

**What it does:** Shows business analytics like top-selling products and profit charts.

**How it calculates metrics:**

```tsx
// useSalesData.ts
return useMemo(() => {
  // Top 10 by sales
  const sortedBySales = [...products]
    .sort((a, b) => b.totalSales - a.totalSales) // Descending order
    .slice(0, 10); // Only keep first 10

  // Top 10 by profit
  const sortedByProfit = [...products].sort((a, b) => b.totalProfit - a.totalProfit).slice(0, 10);

  // Group sales by category
  const categoryStats = products.reduce((acc, product) => {
    const category = product.category;
    acc[category] = (acc[category] || 0) + product.totalSales;
    return acc;
  }, {});

  return { sortedBySales, sortedByProfit, categoryStats };
}, [products]);
```

**What is `reduce`?**
Think of it like a "running total" calculator. It goes through each product and builds up a result (in this case, a total per category).

Example:

```js
// Start: {}
// After "Shirts": { Shirts: 150 }
// After another "Shirts": { Shirts: 300 }
// After "Jeans": { Shirts: 300, Jeans: 80 }
```

---

### 7. Authentication System

**What it does:** Tracks who is logged in and remembers them even after browser refresh.

**How it works:**

```tsx
// AuthContext.tsx

// On page load, check if user was logged in before
const [isAuthenticated, setIsAuthenticated] = useState(() => {
  return localStorage.getItem('isAuthenticated') === 'true';
});

const [user, setUser] = useState<User | null>(() => {
  const savedEmail = localStorage.getItem('userEmail');
  return savedEmail ? { email: savedEmail } : null;
});

// Whenever auth status or user changes, save to localStorage
useEffect(() => {
  localStorage.setItem('isAuthenticated', String(isAuthenticated));
  if (user?.email) {
    localStorage.setItem('userEmail', user.email);
  }
}, [isAuthenticated, user]);
```

**Login function:**

```tsx
const login = (email: string, password: string) => {
  setIsAuthenticated(true);
  setUser({ email });
  return true;
};
```

**Why store email separately?**
We need the email to:

1. Show "Welcome, admin@avclothing.com" in the UI
2. Load the correct user's cart
3. Check if they have admin privileges

---

## React Concepts Used

### 1. Context API (Global State)

**Problem:** You need cart data in many places (Header for count, Cart page for items, Checkout for total). Passing it through props would be a mess.

**Solution:** Context API lets you "broadcast" state to any component that needs it.

**Setup:**

```tsx
// CartContext.tsx
const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook for easy access
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
```

**Usage:**

```tsx
// Any component can now access cart
function Header() {
  const { cart } = useCart();
  return <Badge count={cart.length} />;
}
```

---

### 2. Custom Hooks (Reusable Logic)

**Problem:** You need the same filtering logic in multiple places, or it's making your component too long.

**Solution:** Extract it into a custom hook.

**Before (messy):**

```tsx
function Browse() {
  const [sortBy, setSortBy] = useState('default');
  const [filterSize, setFilterSize] = useState('all');
  const [filterColor, setFilterColor] = useState('all');

  const filteredProducts = useMemo(() => {
    // ... 50 lines of filtering logic
  }, [products, sortBy, filterSize, filterColor]);

  // Rest of component...
}
```

**After (clean):**

```tsx
function Browse() {
  const { filteredProducts, sortBy, setSortBy, filterSize, setFilterSize } =
    useProductFilters(products);

  // Component is now simple!
}
```

---

### 3. useMemo vs useEffect

**Confused about when to use which?**

**`useMemo`**: Caches the _result_ of a calculation

- Use when: Calculating something expensive (sorting, filtering, aggregating)
- Returns: A value

```tsx
const expensiveResult = useMemo(() => {
  return products.sort(...).filter(...);  // Returns sorted array
}, [products]);
```

**`useEffect`**: Runs side effects (talking to outside world)

- Use when: Saving to localStorage, fetching from API, updating DOM
- Returns: Nothing (or cleanup function)

```tsx
useEffect(() => {
  localStorage.setItem('cart', JSON.stringify(cart)); // Side effect!
}, [cart]);
```

---

### 4. TypeScript Interfaces

**Why use TypeScript?**
It catches bugs before you run the code. For example:

```tsx
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size?: string; // Optional
}

// TypeScript will yell at you if you forget a required field
const item: CartItem = {
  id: '123',
  name: 'Shirt',
  // ERROR: Missing 'price' and 'quantity'!
};
```

---

## Common Patterns

### Pattern 1: Conditional Rendering

**Show different UI based on state:**

```tsx
// Simple if/else
{
  isAuthenticated ? <LogoutButton /> : <LoginButton />;
}

// Show only if true
{
  isAuthenticated && <DashboardLink />;
}

// Show only for admin
{
  user?.email === 'admin@avclothing.com' && <AdminPanel />;
}
```

---

### Pattern 2: Controlled Components

**Form inputs that React controls:**

```tsx
const [email, setEmail] = useState('');

<input
  value={email} // React controls the value
  onChange={(e) => setEmail(e.target.value)} // Update on every keystroke
/>;
```

**Why?**

- React always knows the current value
- Easy to validate or transform input
- Can reset easily: `setEmail('')`

---

### Pattern 3: Data Enhancement

**Problem:** API gives you raw data, but you need calculated fields everywhere.

**Solution:** Pre-calculate once when data loads.

```tsx
// ProductContext.tsx
const enhancedData = rawData.map((product) => {
  const totalSales = product.sales.domestic + product.sales.international;
  const totalGross = totalSales * product.price;
  const totalCost = totalSales * product.cost;
  const totalProfit = totalGross - totalCost;

  return {
    ...product,
    totalSales, // Now every component can use these
    totalGross, // without recalculating!
    totalCost,
    totalProfit,
  };
});
```

**Benefit:** Dashboard doesn't need to recalculate profit for every product. It's already there!

---

### Pattern 4: Responsive Design

**Show different UI on mobile vs desktop:**

```tsx
// Check if screen is small
const isMobile = useMediaQuery(theme.breakpoints.down('md'));

// Desktop: Show full nav
{
  !isMobile && <FullNavBar />;
}

// Mobile: Show hamburger menu
{
  isMobile && <HamburgerMenu />;
}
```

---

## Key Takeaways

### 1. State Management

- **Local state** (`useState`): For component-specific data (form inputs, toggles)
- **Context**: For data many components need (user, cart, products)
- **localStorage**: For data that should survive browser refresh

### 2. Performance

- Use `useMemo` for expensive calculations
- Use `useCallback` for functions passed to child components
- Don't optimize prematurely—only when you notice slowness

### 3. Code Organization

- **One responsibility per component**: `<ProductCard>` shows a product, doesn't handle filtering
- **Extract logic into hooks**: Keeps components readable
- **Separate concerns**: Business logic in hooks/contexts, UI in components

### 4. Common Mistakes to Avoid

- ❌ Calling `setState` directly in render
- ❌ Forgetting dependency arrays in `useEffect`/`useMemo`
- ❌ Prop drilling (passing props through 5 levels)
- ✅ Use Context for deeply nested data
- ✅ Extract repeated logic into hooks
- ✅ Type everything with TypeScript

---

## Testing the App

### Login Credentials

- **Admin:** admin@avclothing.com / password123
- **Regular User:** Any other email / any password

### Features to Try

1. **Browse & Filter**
   - Go to Browse page
   - Try different size/color filters
   - Sort by price

2. **Cart Persistence**
   - Log in as admin@avclothing.com
   - Add items to cart
   - Log out → cart is empty
   - Log back in as admin → cart items are back!

3. **Admin View**
   - Log in as admin@avclothing.com
   - Go to any product page
   - Click "Admin View" button (only visible to admin)
   - See sales metrics and profit chart

4. **Checkout**
   - Add items to cart
   - Go to Cart page
   - Change destination (Canada/US/International)
   - Watch shipping and tax update
   - Complete checkout
   - See order in Dashboard

---

## Technologies Reference

### React 19

- Component-based UI framework
- Hooks for state and side effects

### TypeScript

- JavaScript with types
- Catches errors before runtime

### Material-UI (MUI)

- Pre-built components (buttons, inputs, dialogs)
- Theming system (dark/light mode)

### React Router

- Client-side routing (no page refresh)
- `<Link>` for navigation, `useNavigate()` for programmatic routing

### Recharts

- React chart library
- Used for dashboard Bar and Pie charts

### localStorage

- Browser storage API
- Stores strings (use `JSON.stringify`/`JSON.parse` for objects)

---

## Next Steps for Learning

1. **Experiment with the code:**
   - Try adding a new filter (by price range)
   - Add a "Favorites" feature
   - Change the color scheme in `ThemeProvider.tsx`

2. **Understand the flow:**
   - Start at `main.tsx` and trace how providers wrap the app
   - Follow a cart item from "Add to Cart" button to localStorage
   - See how a product loads from API → Context → Component

3. **Read the docs:**
   - [React Hooks](https://react.dev/reference/react)
   - [TypeScript Handbook](https://www.typescriptlang.org/docs/)
   - [MUI Components](https://mui.com/material-ui/getting-started/)

---

_Built for COMP 4513 - Assignment 2_
