import React, { useState, useEffect } from 'react';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, ordersRes] = await Promise.all([
        fetch('http://127.0.0.1:8000/api/admin/stats'),
        fetch('http://127.0.0.1:8000/api/admin/orders')
      ]);

      if (!statsRes.ok || !ordersRes.ok) {
        throw new Error("Không thể tải thông tin admin dashboard.");
      }

      const statsData = await statsRes.json();
      const ordersData = await ordersRes.json();

      setStats(statsData);
      setOrders(ordersData);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Lỗi tải dữ liệu quản trị. Hãy kiểm tra kết nối API.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!res.ok) {
        throw new Error("Cập nhật trạng thái thất bại.");
      }

      await fetchDashboardData();
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const toggleOrderExpand = (orderId) => {
    setExpandedOrderId(prev => (prev === orderId ? null : orderId));
  };

  if (loading && !stats) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse space-y-8">
        <div className="h-8 bg-slate-100 w-1/4 rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-28 bg-slate-100 rounded-2xl"></div>
          ))}
        </div>
        <div className="h-96 bg-slate-100 rounded-3xl"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-lg mx-auto text-center py-20 px-4">
        <div className="bg-rose-50 border border-rose-100 text-rose-800 p-6 rounded-2xl">
          <p className="font-semibold text-sm">{error}</p>
          <button 
            onClick={fetchDashboardData}
            className="mt-4 px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-semibold cursor-pointer hover:bg-rose-500 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight my-0">Bảng Quản Trị (Admin Dashboard)</h1>
        <p className="text-slate-500 text-sm mt-1">Theo dõi hoạt động kinh doanh và quản lý đơn hàng</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tổng doanh thu</span>
            <p className="text-2xl font-black text-slate-900 m-0">{formatPrice(stats.total_revenue)}</p>
          </div>
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Đơn hàng mới (Chờ xử lý)</span>
            <p className="text-2xl font-black text-amber-600 m-0">{stats.pending_orders} đơn</p>
          </div>
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tổng số đơn hàng</span>
            <p className="text-2xl font-black text-slate-900 m-0">{stats.total_orders} đơn</p>
          </div>
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Số lượng sản phẩm</span>
            <p className="text-2xl font-black text-slate-900 m-0">{stats.total_products} món</p>
          </div>
        </div>
      )}

      {/* Orders List Table */}
      <div className="bg-white border border-slate-100 shadow-sm rounded-3xl overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800 my-0">Danh Sách Đơn Hàng</h2>
          <button 
            onClick={fetchDashboardData}
            className="p-2 text-slate-400 hover:text-violet-600 transition-colors rounded-lg hover:bg-slate-50 cursor-pointer"
            title="Tải lại dữ liệu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase">
                <th className="px-6 py-4">Đơn hàng</th>
                <th className="px-6 py-4">Khách hàng</th>
                <th className="px-6 py-4">Tổng tiền</th>
                <th className="px-6 py-4">Phương thức</th>
                <th className="px-6 py-4">Ngày đặt</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map(order => {
                const isExpanded = expandedOrderId === order.id;
                const isUpdating = updatingOrderId === order.id;

                let statusColor = 'bg-slate-100 text-slate-600';
                if (order.status === 'Pending') statusColor = 'bg-amber-50 text-amber-600 border border-amber-100';
                if (order.status === 'Processing') statusColor = 'bg-blue-50 text-blue-600 border border-blue-100';
                if (order.status === 'Completed') statusColor = 'bg-emerald-50 text-emerald-600 border border-emerald-100';
                if (order.status === 'Cancelled') statusColor = 'bg-rose-50 text-rose-600 border border-rose-100';

                return (
                  <React.Fragment key={order.id}>
                    <tr className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-800">
                        <button 
                          onClick={() => toggleOrderExpand(order.id)}
                          className="flex items-center gap-1.5 hover:text-violet-600 font-bold cursor-pointer"
                        >
                          #ORD-{order.id}
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                          </svg>
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-800 m-0">{order.customer_name}</p>
                        <p className="text-slate-400 text-xs mt-0.5 mb-0">{order.customer_phone}</p>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-800">
                        {formatPrice(order.total_amount)}
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold text-slate-500">
                        {order.payment_method}
                      </td>
                      <td className="px-6 py-4 text-slate-400 text-xs">
                        {new Date(order.created_at).toLocaleString('vi-VN')}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${statusColor}`}>
                          {order.status === 'Pending' && 'Chờ xử lý'}
                          {order.status === 'Processing' && 'Đang đóng gói'}
                          {order.status === 'Completed' && 'Đã hoàn thành'}
                          {order.status === 'Cancelled' && 'Đã hủy'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <select
                          disabled={isUpdating}
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className="px-2 py-1.5 border border-slate-200 rounded-lg text-xs bg-slate-50 text-slate-700 focus:outline-none focus:ring-1 focus:ring-violet-500 cursor-pointer"
                        >
                          <option value="Pending">Chờ xử lý</option>
                          <option value="Processing">Đang đóng gói</option>
                          <option value="Completed">Hoàn thành</option>
                          <option value="Cancelled">Hủy đơn</option>
                        </select>
                      </td>
                    </tr>

                    {/* Expanded Detail Row */}
                    {isExpanded && (
                      <tr className="bg-slate-50/30">
                        <td colSpan={7} className="px-6 py-4 border-t border-b border-slate-100">
                          <div className="space-y-3">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider m-0">Chi tiết sản phẩm đã mua:</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Left: Products list */}
                              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm divide-y divide-slate-100">
                                {order.items.map(item => (
                                  <div key={item.id} className="flex justify-between items-center py-2 text-xs first:pt-0 last:pb-0">
                                    <div className="pr-3">
                                      <p className="font-semibold text-slate-800 m-0">{item.product?.name || 'Sản phẩm đã bị xóa'}</p>
                                      <p className="text-slate-400 mt-0.5 mb-0">Số lượng: {item.quantity} x {formatPrice(item.price)}</p>
                                    </div>
                                    <span className="font-bold text-slate-800">{formatPrice(item.price * item.quantity)}</span>
                                  </div>
                                ))}
                              </div>

                              {/* Right: Customer address */}
                              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm text-xs space-y-2">
                                <p className="font-bold text-slate-500 uppercase m-0">Thông tin nhận hàng:</p>
                                <p className="m-0"><span className="font-semibold text-slate-600">Email:</span> {order.customer_email}</p>
                                <p className="m-0"><span className="font-semibold text-slate-600">Địa chỉ giao:</span> {order.shipping_address}</p>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        {orders.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            Chưa có đơn đặt hàng nào trong hệ thống.
          </div>
        )}
      </div>
    </div>
  );
}
