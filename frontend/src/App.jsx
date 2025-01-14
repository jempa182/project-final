// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProductListPage from './pages/ProductListPage';
import ProductDetail from './pages/ProductDetail';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<ProductListPage />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;