import React from 'react';
import { useCart } from '../context/CartContext';

export default function Cart({ navigate }) {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-20 px-4">
        <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 shadow-sm space-y-6">
          <div className="w-16 h-16 bg-violet-50 text-violet-600 rounded-full flex items-center justify-center mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-800">Giỏ hàng của bạn đang trống</h2>
            <p className="text-slate-500 text-sm">Hãy quay lại cửa hàng và chọn các sản phẩm ưng ý nhất nhé!</p>
          </div>
          <button
            onClick={() => navigate('products')}
            className="px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-2xl shadow-lg shadow-violet-100 transition-all cursor-pointer text-sm"
          >
            Khám phá sản phẩm
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight my-0">Giỏ Hàng Của Bạn</h1>
        <p className="text-slate-500 text-sm mt-1">Kiểm tra lại danh sách các sản phẩm đã chọn</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left: Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={item.product.id}
              className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm"
            >
              {/* Product Image */}
              <div 
                className="w-20 h-20 bg-slate-50 rounded-xl overflow-hidden flex-shrink-0 cursor-pointer"
                onClick={() => navigate('detail', item.product.id)}
              >
                <img
                  src={item.product.image_url}
                  alt={item.product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Product Info */}
              <div className="flex-grow min-w-0">
                <h3
                  className="text-sm font-semibold text-slate-800 hover:text-violet-600 transition-colors line-clamp-1 cursor-pointer"
                  onClick={() => navigate('detail', item.product.id)}
                >
                  {item.product.name}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Đơn giá: {formatPrice(item.product.price)}
                </p>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Tổng: {formatPrice(item.product.price * item.quantity)}
                </p>
              </div>

              {/* Quantity Controls & Remove */}
              <div className="flex flex-col sm:flex-row items-center gap-4">
                {/* Quantity buttons */}
                <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    className="px-2 py-1 text-slate-600 hover:bg-slate-100 transition-colors font-bold cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-xs font-semibold text-slate-800 min-w-[30px] text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    className="px-2 py-1 text-slate-600 hover:bg-slate-100 transition-colors font-bold cursor-pointer"
                  >
                    +
                  </button>
                </div>

                {/* Remove button */}
                <button
                  onClick={() => removeFromCart(item.product.id)}
                  className="text-slate-400 hover:text-rose-600 transition-colors p-1.5 cursor-pointer"
                  title="Xóa sản phẩm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Summary panel */}
        <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 space-y-6">
          <h2 className="text-lg font-bold text-slate-800 border-b border-slate-200 pb-3 my-0">Tổng đơn hàng</h2>
          
          <div className="space-y-3">
            <div className="flex justify-between text-sm text-slate-600">
              <span>Tạm tính ({cart.reduce((s, i) => s + i.quantity, 0)} món)</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-slate-600">
              <span>Phí vận chuyển</span>
              <span className="text-emerald-600 font-medium">Miễn phí</span>
            </div>
            <div className="border-t border-slate-200 pt-3 flex justify-between font-bold text-slate-900">
              <span>Tổng thanh toán</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>
          </div>

          <button
            onClick={() => navigate('checkout')}
            className="w-full py-3.5 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-2xl shadow-lg shadow-violet-100 hover:shadow-violet-200 transition-all cursor-pointer text-sm flex items-center justify-center gap-1.5"
          >
            Tiến hành thanh toán
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
