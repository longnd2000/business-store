import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { Category, Product } from '../types';

interface ProductsProps {
  navigate: (page: string, productId?: number | null) => void;
}

export default function Products({ navigate }: ProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/categories');
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let url = 'http://127.0.0.1:8000/api/products';
        const params: string[] = [];
        if (selectedCategory !== 'all') {
          params.push(`category=${selectedCategory}`);
        }
        if (searchQuery) {
          params.push(`q=${encodeURIComponent(searchQuery)}`);
        }
        if (params.length > 0) {
          url += `?${params.join('&')}`;
        }

        const res = await fetch(url);
        if (!res.ok) {
          throw new Error("Không thể kết nối đến API.");
        }
        const data = await res.json();
        setProducts(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Không thể tải danh sách sản phẩm.");
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(timer);
  }, [selectedCategory, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-100 pb-5 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight my-0">Cửa hàng Sản phẩm</h1>
          <p className="text-slate-500 text-sm mt-1 mb-0">Duyệt qua bộ sưu tập đầy đủ của chúng tôi</p>
        </div>

        {/* Search Box */}
        <div className="relative max-w-md w-full">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.637 10.637Z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2.5 pb-2">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide uppercase transition-all cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-violet-600 text-white shadow-md shadow-violet-100'
              : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-100'
          }`}
        >
          Tất cả
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.slug)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide uppercase transition-all cursor-pointer ${
              selectedCategory === category.slug
                ? 'bg-violet-600 text-white shadow-md shadow-violet-100'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-100'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="animate-pulse flex flex-col space-y-4">
              <div className="bg-slate-100 aspect-square rounded-2xl"></div>
              <div className="h-4 bg-slate-100 rounded w-2/3"></div>
              <div className="h-4 bg-slate-100 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-6 rounded-2xl text-center max-w-lg mx-auto">
          <p className="font-semibold text-sm m-0">{error}</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-2xl w-full">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto text-slate-400 mb-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-3-3.675v3.675m-3-3v3m3-12h.008v.008H12V5.25Zm1.5 1.5h.008v.008h-.008v-.008Zm1.5-1.5h.008v.008H15V5.25Zm-1.5-1.5H12v.008h.008v-.008ZM12 12h.008v.008H12V12Zm1.5 1.5h.008v.008h-.008v-.008Zm1.5-1.5h.008v.008H15V12Zm-1.5-1.5H12v.008h.008v-.008ZM6 16.5H1.5M3 18v-3m16.5 1.5H22.5m-1.5 1.5v-3M1.5 6.75H6M4.5 8.25v-3m15-1.5h4.5M21 5.25v3" />
          </svg>
          <h3 className="text-slate-800 font-bold text-lg my-0">Không tìm thấy sản phẩm</h3>
          <p className="text-slate-400 text-sm mt-1 mb-0">Hãy thử sử dụng bộ lọc khác hoặc nhập từ khóa khác.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} navigate={navigate} />
          ))}
        </div>
      )}
    </div>
  );
}
