import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { CartProvider } from './context/CartContext';

import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Dashboard from './pages/Dashboard';

import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProductId, setSelectedProductId] = useState(null);

  const navigate = (page, productId = null) => {
    setCurrentPage(page);
    setSelectedProductId(productId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home navigate={navigate} />;
      case 'products':
        return <Products navigate={navigate} />;
      case 'detail':
        return <ProductDetail productId={selectedProductId} navigate={navigate} />;
      case 'cart':
        return <Cart navigate={navigate} />;
      case 'checkout':
        return <Checkout navigate={navigate} />;
      case 'dashboard':
        return <Dashboard />;
      default:
        return <Home navigate={navigate} />;
    }
  };

  return (
    <CartProvider>
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-600 antialiased">
        {/* Navigation Bar */}
        <Navbar navigate={navigate} currentPage={currentPage} />

        {/* Main Content Area */}
        <main className="flex-grow py-6">
          {renderPage()}
        </main>

        {/* Footer */}
        <Footer navigate={navigate} />
      </div>
    </CartProvider>
  );
}

export default App;
