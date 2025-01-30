// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { UserProvider } from './context/UserContext';
import Layout from './components/Layout';
import ProductListPage from './pages/ProductListPage';
import ProductDetail from './pages/ProductDetail';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import CartPage from './pages/CartPage';
import ProfilePage from './pages/ProfilePage';
import OrdersPage from './pages/OrdersPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import FavoritesPage from './pages/FavoritesPage';

function App() {
  return (
    <UserProvider>
      <CartProvider>
        <Router>
          <Layout>
            <Routes>
            <Route path="/" element={<ProductListPage />} />
            <Route path="/category/:category" element={<ProductListPage />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
            </Routes>
          </Layout>
        </Router>
      </CartProvider>
    </UserProvider>
  );
}

export default App;