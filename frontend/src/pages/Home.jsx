import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';

export default function Home({ navigate }) {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch categories and products in parallel from Laravel API
        const [categoriesRes, productsRes] = await Promise.all([
          fetch('http://127.0.0.1:8000/api/categories'),
          fetch('http://127.0.0.1:8000/api/products')
        ]);

        if (!categoriesRes.ok || !productsRes.ok) {
          throw new Error("Không thể kết nối đến máy chủ API.");
        }

        const categoriesData = await categoriesRes.json();
        const productsData = await productsRes.json();

        setCategories(categoriesData);
        setFeaturedProducts(productsData.slice(0, 4)); // Show first 4 products as featured
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Không thể tải dữ liệu. Bạn hãy đảm bảo Laravel backend đang chạy ở cổng 8000.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl py-20 px-8 md:px-16 shadow-xl mx-4 mt-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.15),transparent_50%)]"></div>
        <div className="relative max-w-xl space-y-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            ✨ Chào mừng đến với NovaStore
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
            Khám phá Không gian <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">Công nghệ & Đời sống</span> Của Bạn
          </h1>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed">
            NovaStore cung cấp các thiết bị điện tử tối tân, đồ dùng văn phòng, nội thất hiện đại và phụ kiện phong cách giúp nâng tầm cuộc sống của bạn.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('products')}
              className="px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold transition-all shadow-lg shadow-violet-600/30 cursor-pointer text-sm"
            >
              Mua sắm ngay
            </button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-md mx-auto mb-10">
          <h2 className="text-3xl font-bold text-slate-800">Danh Mục Nổi Bật</h2>
          <p className="text-slate-500 mt-2 text-sm">Duyệt nhanh qua các nhóm sản phẩm chất lượng cao của chúng tôi</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse bg-slate-100 h-40 rounded-2xl"></div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 p-6 rounded-2xl text-center max-w-lg mx-auto">
            <p className="font-semibold text-sm">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => (
              <div
                key={category.id}
                onClick={() => {
                  navigate('products');
                }}
                className="group relative overflow-hidden h-40 rounded-2xl shadow-sm border border-slate-100 cursor-pointer hover:shadow-md transition-all duration-300"
              >
                <img
                  src={category.image_url}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent flex flex-col justify-end p-4">
                  <h3 className="text-white font-bold text-base md:text-lg tracking-tight">
                    {category.name}
                  </h3>
                  <span className="text-xs text-indigo-200 font-medium">
                    {category.products_count} sản phẩm
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Featured Products Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-slate-800">Sản Phẩm Mới Nhất</h2>
            <p className="text-slate-500 mt-1 text-sm">Lựa chọn hàng đầu dành riêng cho phong cách của bạn</p>
          </div>
          <button
            onClick={() => navigate('products')}
            className="flex items-center gap-1.5 text-sm font-semibold text-violet-600 hover:text-violet-500 transition-colors cursor-pointer"
          >
            Xem tất cả
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse flex flex-col space-y-4">
                <div className="bg-slate-100 aspect-square rounded-2xl"></div>
                <div className="h-4 bg-slate-100 rounded w-2/3"></div>
                <div className="h-4 bg-slate-100 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-slate-400 py-12">Không có sản phẩm để hiển thị.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} navigate={navigate} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
