import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

export default function Checkout({ navigate }) {
  const { cart, cartTotal, clearCart } = useCart();
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    shipping_address: '',
    payment_method: 'COD'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(null);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setError(null);
    setLoading(true);

    try {
      const payload = {
        ...formData,
        items: cart.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity
        }))
      };

      const res = await fetch('http://127.0.0.1:8000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Đã xảy ra lỗi khi tạo đơn hàng.");
      }

      setOrderSuccess(data.order);
      clearCart();
    } catch (err) {
      console.error(err);
      setError(err.message || "Đặt hàng thất bại. Vui lòng kiểm tra lại thông tin.");
    } finally {
      setLoading(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="max-w-xl mx-auto text-center py-20 px-4">
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl space-y-6">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-slate-800">Đặt hàng thành công!</h2>
            <p className="text-slate-500 text-sm">Cảm ơn bạn đã mua sắm tại NovaStore.</p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-5 text-left border border-slate-100 space-y-3">
            <div className="flex justify-between text-xs text-slate-500">
              <span>Mã đơn hàng:</span>
              <span className="font-bold text-slate-800">#ORD-{orderSuccess.id}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-500">
              <span>Người nhận:</span>
              <span className="font-bold text-slate-800">{orderSuccess.customer_name}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-500">
              <span>Số điện thoại:</span>
              <span className="font-bold text-slate-800">{orderSuccess.customer_phone}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-500">
              <span>Hình thức:</span>
              <span className="font-bold text-slate-800">{orderSuccess.payment_method}</span>
            </div>
            <div className="border-t border-slate-200 pt-3 flex justify-between text-sm font-bold text-slate-900">
              <span>Tổng cộng:</span>
              <span>{formatPrice(orderSuccess.total_amount)}</span>
            </div>
          </div>

          {orderSuccess.payment_method === 'Bank Transfer' && (
            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 text-left text-xs text-indigo-900 space-y-2">
              <p className="font-bold">Thông tin chuyển khoản ngân hàng:</p>
              <p>Ngân hàng: Techcombank</p>
              <p>Số tài khoản: 1903 1234 5678 90</p>
              <p>Chủ tài khoản: NGUYEN VAN A</p>
              <p>Nội dung CK: <span className="font-bold">ORD {orderSuccess.id}</span></p>
              <p className="text-slate-500">Hệ thống sẽ duyệt đơn hàng sau khi nhận được thanh toán.</p>
            </div>
          )}

          <button
            onClick={() => navigate('products')}
            className="w-full py-3 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-2xl shadow-lg shadow-violet-100 transition-all cursor-pointer text-sm"
          >
            Tiếp tục mua sắm
          </button>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-20 px-4">
        <p className="text-slate-500 text-sm">Không có sản phẩm nào trong giỏ để thanh toán.</p>
        <button
          onClick={() => navigate('products')}
          className="mt-4 px-6 py-2.5 bg-violet-600 text-white rounded-xl text-xs font-semibold cursor-pointer"
        >
          Quay lại cửa hàng
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight my-0">Thanh Toán</h1>
        <p className="text-slate-500 text-sm mt-1">Hoàn thành thông tin giao hàng của bạn</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left: Billing Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 bg-white border border-slate-100 shadow-sm rounded-3xl p-6 md:p-8 space-y-6">
          <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3 my-0">Thông tin giao hàng</h2>

          {error && (
            <div className="p-4 bg-rose-50 border border-rose-100 text-rose-800 text-xs font-semibold rounded-xl">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 col-span-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Họ và tên</label>
              <input
                type="text"
                name="customer_name"
                required
                value={formData.customer_name}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                placeholder="Nguyễn Văn A"
              />
            </div>
            <div className="space-y-1.5 col-span-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Số điện thoại</label>
              <input
                type="tel"
                name="customer_phone"
                required
                value={formData.customer_phone}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                placeholder="0987654321"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase">Địa chỉ email</label>
            <input
              type="email"
              name="customer_email"
              required
              value={formData.customer_email}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
              placeholder="email@example.com"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase">Địa chỉ nhận hàng</label>
            <textarea
              name="shipping_address"
              required
              rows={3}
              value={formData.shipping_address}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
              placeholder="Số nhà, Tên đường, Phường/Xã, Quận/Huyện, Tỉnh/Thành phố..."
            ></textarea>
          </div>

          {/* Payment Options */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-500 uppercase">Phương thức thanh toán</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                formData.payment_method === 'COD' 
                  ? 'border-violet-600 bg-violet-50/50' 
                  : 'border-slate-200 bg-slate-50/20 hover:bg-slate-50'
              }`}>
                <input
                  type="radio"
                  name="payment_method"
                  value="COD"
                  checked={formData.payment_method === 'COD'}
                  onChange={handleInputChange}
                  className="accent-violet-600 mt-1"
                />
                <div className="text-sm">
                  <p className="font-bold text-slate-800 my-0">Thanh toán khi nhận hàng (COD)</p>
                  <p className="text-slate-400 text-xs mt-0.5 mb-0">Trả tiền mặt khi nhận hàng</p>
                </div>
              </label>

              <label className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                formData.payment_method === 'Bank Transfer' 
                  ? 'border-violet-600 bg-violet-50/50' 
                  : 'border-slate-200 bg-slate-50/20 hover:bg-slate-50'
              }`}>
                <input
                  type="radio"
                  name="payment_method"
                  value="Bank Transfer"
                  checked={formData.payment_method === 'Bank Transfer'}
                  onChange={handleInputChange}
                  className="accent-violet-600 mt-1"
                />
                <div className="text-sm">
                  <p className="font-bold text-slate-800 my-0">Chuyển khoản ngân hàng</p>
                  <p className="text-slate-400 text-xs mt-0.5 mb-0">Nhận thông tin STK sau khi đặt hàng</p>
                </div>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-2xl shadow-lg shadow-violet-100 hover:shadow-violet-200 transition-all cursor-pointer text-sm flex items-center justify-center gap-1.5"
          >
            {loading ? (
              <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
            ) : "Xác nhận đặt hàng"}
          </button>
        </form>

        {/* Right: Cart Summary Panel */}
        <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 space-y-6">
          <h2 className="text-lg font-bold text-slate-800 border-b border-slate-200 pb-3 my-0">Đơn hàng của bạn</h2>

          <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto pr-1">
            {cart.map(item => (
              <div key={item.product.id} className="flex justify-between items-center py-3 text-xs">
                <div className="min-w-0 pr-3">
                  <p className="font-semibold text-slate-800 line-clamp-1">{item.product.name}</p>
                  <p className="text-slate-400 mt-0.5">Số lượng: {item.quantity}</p>
                </div>
                <span className="font-bold text-slate-800 flex-shrink-0">{formatPrice(item.product.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-200 pt-4 space-y-3">
            <div className="flex justify-between text-xs text-slate-500">
              <span>Tạm tính:</span>
              <span className="font-bold text-slate-800">{formatPrice(cartTotal)}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-500">
              <span>Phí vận chuyển:</span>
              <span className="text-emerald-600 font-bold">Miễn phí</span>
            </div>
            <div className="border-t border-slate-200 pt-3 flex justify-between text-sm font-bold text-slate-900">
              <span>Tổng cộng:</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
