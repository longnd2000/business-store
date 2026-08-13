import React from 'react';
import { Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom';
import Home from '../pages/Home';
import Products from '../pages/Products';
import ProductDetail from '../pages/ProductDetail';
import Cart from '../pages/Cart';
import Checkout from '../pages/Checkout';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import MainLayout from '../layouts/MainLayout';

// Wrapper helper to inject standard storefront page navigate logic
const RouteWithNavigate: React.FC<{ component: React.ComponentType<any> }> = ({ component: Component }) => {
  const navigate = useNavigate();
  const appNavigate = (page: string, productId: number | null = null) => {
    if (page === 'home') navigate('/');
    else if (page === 'products') navigate('/products');
    else if (page === 'detail' && productId) navigate(`/products/${productId}`);
    else if (page === 'cart') navigate('/cart');
    else if (page === 'checkout') navigate('/checkout');
    else if (page === 'dashboard') navigate('/admin/overview');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  return <Component navigate={appNavigate} />;
};

// Wrapper specifically for ProductDetail to grab dynamic URL parameters
const ProductDetailWrapper: React.FC<{ navigate: any }> = ({ navigate }) => {
  const { id } = useParams<{ id: string }>();
  const productId = id ? parseInt(id, 10) : null;
  return <ProductDetail productId={productId} navigate={navigate} />;
};

export const AppRoutes: React.FC = () => {
  const token = localStorage.getItem('admin_token');

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    window.location.href = '/admin/login';
  };

  return (
    <Routes>
      {/* Public Storefront Routes wrapped in MainLayout */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<RouteWithNavigate component={Home} />} />
        <Route path="products" element={<RouteWithNavigate component={Products} />} />
        <Route path="products/:id" element={<RouteWithNavigate component={ProductDetailWrapper} />} />
        <Route path="cart" element={<RouteWithNavigate component={Cart} />} />
        <Route path="checkout" element={<RouteWithNavigate component={Checkout} />} />
      </Route>

      {/* Admin Panel Routes */}
      <Route 
        path="/admin/login" 
        element={token ? <Navigate to="/admin/overview" replace /> : <Login />} 
      />
      <Route 
        path="/admin/*" 
        element={token ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/admin/login" replace />} 
      />

      {/* Fallback redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
