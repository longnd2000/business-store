import React from 'react';
import { useCart } from '../context/CartContext';

interface NavbarProps {
  navigate: (page: string, productId?: number | null) => void;
  currentPage: string;
}

export default function Navbar({ navigate, currentPage }: NavbarProps) {
  const { cartCount } = useCart();

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => navigate('home')}>
            <span className="text-2xl font-extrabold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">
              NovaStore
            </span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
            <button
              onClick={() => navigate('home')}
              className={`text-sm font-medium transition-colors cursor-pointer ${
                currentPage === 'home'
                  ? 'text-violet-600 border-b-2 border-violet-600 py-1'
                  : 'text-slate-600 hover:text-slate-900 py-1'
              }`}
            >
              Trang Chủ
            </button>
            <button
              onClick={() => navigate('products')}
              className={`text-sm font-medium transition-colors cursor-pointer ${
                currentPage === 'products' || currentPage === 'detail'
                  ? 'text-violet-600 border-b-2 border-violet-600 py-1'
                  : 'text-slate-600 hover:text-slate-900 py-1'
              }`}
            >
              Sản Phẩm
            </button>
            <button
              onClick={() => navigate('dashboard')}
              className={`text-sm font-medium transition-colors cursor-pointer ${
                currentPage === 'dashboard'
                  ? 'text-violet-600 border-b-2 border-violet-600 py-1'
                  : 'text-slate-600 hover:text-slate-900 py-1'
              }`}
            >
              Quản Trị (Admin)
            </button>
          </div>

          {/* Cart Icon */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('cart')}
              className="relative p-2 text-slate-600 hover:text-violet-600 transition-colors duration-200 cursor-pointer"
              aria-label="Giỏ hàng"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                />
              </svg>

              {cartCount > 0 && (
                <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-violet-600 text-[10px] font-bold text-white ring-2 ring-white animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
