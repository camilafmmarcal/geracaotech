
import { Routes, Route } from 'react-router-dom';

import { WishlistProvider } from './context/WishlistContext';

import Layout from './pages/Layout';

import HomePage from './pages/HomePage';
import ProductListingPage from './pages/ProductListingPage';
import ProductViewPage from './pages/ProductViewPage';
import CategoriesPage from './pages/CategoriesPage';

import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import WishlistPage from './pages/WishlistPage';
import CouponsPage from './pages/CouponsPage';

import OrdersPage from './pages/OrdersPage';
import OrderDetailsPage from './pages/OrderDetailsPage';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

import AboutPage from './pages/AboutPage';
import SecurityPage from './pages/SecurityPage';
import BlogPage from './pages/BlogPage';
import CareersPage from './pages/CareersPage';
import ContactPage from './pages/ContactPage';

import NotFoundPage from './pages/NotFoundPage';
import './styles/institutional.css';

function App() {
  return (
    <WishlistProvider>
      <Layout>
        <Routes>
          <Route
            path="/"
            element={<HomePage />}
          />

          <Route
            path="/products"
            element={<ProductListingPage />}
          />

          <Route
            path="/products/:id"
            element={<ProductViewPage />}
          />

          <Route
            path="/categories"
            element={<CategoriesPage />}
          />

          <Route
            path="/cart"
            element={<CartPage />}
          />

          <Route
            path="/checkout"
            element={<CheckoutPage />}
          />

          <Route
            path="/wishlist"
            element={<WishlistPage />}
          />

          <Route
            path="/coupons"
            element={<CouponsPage />}
          />

          <Route
            path="/orders"
            element={<OrdersPage />}
          />

          <Route
            path="/orders/:orderNumber"
            element={<OrderDetailsPage />}
          />

          <Route
            path="/login"
            element={<LoginPage />}
          />

          <Route
            path="/register"
            element={<RegisterPage />}
          />

          <Route
            path="/about"
            element={<AboutPage />}
          />

          <Route
            path="/security"
            element={<SecurityPage />}
          />

          <Route
            path="/blog"
            element={<BlogPage />}
          />

          <Route
            path="/careers"
            element={<CareersPage />}
          />

          <Route
            path="/contact"
            element={<ContactPage />}
          />

          <Route
            path="*"
            element={<NotFoundPage />}
          />
        </Routes>
      </Layout>
    </WishlistProvider>
  );
}

export default App;
