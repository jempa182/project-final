// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { UserProvider } from './context/UserContext';
import Layout from './components/Layout';
import ProductListPage from './pages/ProductListPage';
import ProductDetail from './pages/ProductDetail';
import LoginPage from './pages/LoginPage';
import CartPage from './pages/CartPage';
import ProfilePage from './pages/ProfilePage';
import OrdersPage from './pages/OrdersPage';

function App() {
  return (
    <UserProvider>
      <CartProvider>
        <Router>
          <Layout>
            <Routes>
            <Route path="/" element={<ProductListPage />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/orders" element={<OrdersPage />} />
            </Routes>
          </Layout>
        </Router>
      </CartProvider>
    </UserProvider>
  );
}

export default App;