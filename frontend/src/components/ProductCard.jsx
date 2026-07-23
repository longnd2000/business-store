import React from 'react';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product, navigate }) {
  const { addToCart } = useCart();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="group flex flex-col bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {/* Product Image */}
      <div 
        className="relative overflow-hidden bg-slate-50 cursor-pointer aspect-square"
        onClick={() => navigate('detail', product.id)}
      >
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {product.stock <= 0 ? (
          <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center backdrop-blur-[2px]">
            <span className="bg-rose-600 text-white font-bold text-xs uppercase px-3 py-1.5 rounded-full tracking-wide">
              Hết hàng
            </span>
          </div>
        ) : product.stock <= 5 ? (
          <div className="absolute top-3 left-3 bg-amber-500 text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded-full">
            Chỉ còn {product.stock}
          </div>
        ) : null}
      </div>

      {/* Product Details */}
      <div className="flex flex-col flex-1 p-5">
        <div className="mb-2">
          <span className="text-[10px] font-bold tracking-wider text-violet-600 uppercase bg-violet-50 px-2.5 py-1 rounded-md">
            {product.category?.name || 'Sản phẩm'}
          </span>
        </div>

        <h3 
          className="text-base font-semibold text-slate-800 hover:text-violet-600 transition-colors line-clamp-1 cursor-pointer mb-1"
          onClick={() => navigate('detail', product.id)}
        >
          {product.name}
        </h3>

        <p className="text-xs text-slate-500 line-clamp-2 mb-4 flex-1">
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-slate-900">
              {formatPrice(product.price)}
            </span>
          </div>

          <button
            onClick={() => addToCart(product, 1)}
            disabled={product.stock <= 0}
            className={`flex items-center justify-center p-2.5 rounded-xl cursor-pointer transition-all duration-200 ${
              product.stock <= 0
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-violet-600 hover:bg-violet-700 text-white shadow-md shadow-violet-100 hover:shadow-violet-200'
            }`}
            title="Thêm vào giỏ"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
