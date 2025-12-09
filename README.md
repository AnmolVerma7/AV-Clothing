# AV Clothing - E-Commerce React Application

A modern e-commerce clothing store built with React, TypeScript, and Material-UI.

## Project Overview

This is a full-featured clothing e-commerce application developed for COMP 4513 - Assignment 2. It includes product browsing, filtering, shopping cart functionality, and a sales dashboard.

## Technologies Used

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Material-UI (MUI)** - Component library
- **React Router** - Client-side routing
- **Recharts** - Data visualization for sales dashboard
- **LocalStorage** - Cart and order persistence

## Project Structure

```
src/
├── components/
│   ├── browse/      # FilterBar component
│   ├── cart/        # CartTable, CartSummary
│   ├── common/      # AboutDialog, LoginDialog
│   ├── dashboard/   # SalesCharts, SalesTables, OrdersTable
│   ├── layout/      # Header, Footer, Layout
│   └── product/     # ProductCard
├── context/
│   ├── AuthContext.tsx    # Authentication state
│   ├── CartContext.tsx    # Shopping cart state
│   └── ProductContext.tsx # Product data fetching
├── hooks/
│   ├── useProductFilters.ts # Filtering/sorting logic
│   └── useSalesData.ts      # Dashboard data processing
├── pages/
│   ├── Home.tsx
│   ├── Browse.tsx
│   ├── CategoryPage.tsx
│   ├── ProductPage.tsx
│   ├── CartPage.tsx
│   └── SalesDashboard.tsx
├── theme/
│   └── ThemeProvider.tsx  # Dark/Light mode support
└── utils/
    └── constants.ts
```

## Features

- **Product Browsing** - Grid view with sorting and filtering
- **Category Navigation** - Men's and Women's sections
- **Product Details** - Full product information with size/color selection
- **Shopping Cart** - Add, remove, update quantities with persistence
- **Checkout Flow** - Order confirmation with dashboard redirect
- **Sales Dashboard** - Charts and tables for sales analytics (login required)
- **Dark Mode** - Full dark/light theme support
- **Responsive Design** - Mobile-friendly layout

## Setup Instructions

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/AnmolVerma7/AV-Clothing.git
cd AV-Clothing

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Team Members

- Anmol Verma

## Login Credentials

For testing the dashboard and admin features:

- **Email:** admin@avclothing.com
- **Password:** password123

_(This is a simulated login - any credentials will be accepted)_

## Links

- **Live Demo:** [https://av-clothing.vercel.app](https://av-clothing.vercel.app)
- **GitHub Repository:** [https://github.com/AnmolVerma7/AV-Clothing](https://github.com/AnmolVerma7/AV-Clothing)

## Image Credits

- Product images: [placehold.co](https://placehold.co)
- Product data: GitHub Gist API

## License

This project was created for educational purposes as part of COMP 4513.
