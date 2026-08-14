import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Layout } from 'antd';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine active section for Navbar highlight
  let currentPage = 'home';
  if (location.pathname.startsWith('/products/')) {
    currentPage = 'detail';
  } else if (location.pathname === '/products') {
    currentPage = 'products';
  } else if (location.pathname === '/cart') {
    currentPage = 'cart';
  } else if (location.pathname === '/checkout') {
    currentPage = 'checkout';
  } else if (location.pathname.startsWith('/admin')) {
    currentPage = 'dashboard';
  } else if (location.pathname.startsWith('/news/')) {
    currentPage = 'news-detail';
  } else if (location.pathname === '/news') {
    currentPage = 'news';
  }

  const appNavigate = (page: string, productId: number | null = null) => {
    if (page === 'home') navigate('/');
    else if (page === 'products') navigate('/products');
    else if (page === 'detail' && productId) navigate(`/products/${productId}`);
    else if (page === 'cart') navigate('/cart');
    else if (page === 'checkout') navigate('/checkout');
    else if (page === 'dashboard') navigate('/admin/overview');
    else if (page === 'news') navigate('/news');
    else if (page === 'news-detail' && productId) navigate(`/news/${productId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Layout className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-600 antialiased">
      {/* Navigation Bar */}
      <Navbar navigate={appNavigate} currentPage={currentPage} />

      {/* Main Content Area */}
      <Layout.Content className="flex-grow py-6 w-full">
        <Outlet />
      </Layout.Content>

      {/* Footer */}
      <Footer navigate={appNavigate} />
    </Layout>
  );
};

export default MainLayout;
