import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

export default function ProductDetail({ productId, navigate }) {
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://127.0.0.1:8000/api/products/${productId}`);
        if (!res.ok) {
          throw new Error("Không tìm thấy sản phẩm.");
        }
        const data = await res.json();
        setProduct(data);
        setQuantity(1); // Reset quantity on product change
        setError(null);

        // Fetch related products in the same category
        if (data.category?.slug) {
          const relatedRes = await fetch(`http://127.0.0.1:8000/api/products?category=${data.category.slug}`);
          if (relatedRes.ok) {
            const relatedData = await relatedRes.json();
            // Filter out current product
            setRelatedProducts(relatedData.filter(p => p.id !== data.id).slice(0, 4));
          }
        }
      } catch (err) {
        console.error(err);
        setError("Không thể tải thông tin sản phẩm.");
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProductDetails();
    }
  }, [productId]);

  const handleIncrement = () => {
    if (quantity < product.stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 animate-pulse space-y-8">
        <div className="h-6 bg-slate-100 w-24 rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-slate-100 aspect-square rounded-3xl"></div>
          <div className="space-y-6">
            <div className="h-4 bg-slate-100 w-1/4 rounded"></div>
            <div className="h-8 bg-slate-100 w-3/4 rounded"></div>
            <div className="h-4 bg-slate-100 w-1/2 rounded"></div>
            <div className="h-20 bg-slate-100 rounded"></div>
            <div className="h-10 bg-slate-100 w-1/3 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-lg mx-auto text-center py-20 px-4">
        <div className="bg-rose-50 border border-rose-100 text-rose-800 p-6 rounded-2xl">
          <p className="font-semibold text-sm">{error || "Sản phẩm không khả dụng."}</p>
          <button 
            onClick={() => navigate('products')}
            className="mt-4 px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-semibold cursor-pointer hover:bg-rose-500 transition-colors"
          >
            Quay lại cửa hàng
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate('products')}
          className="inline-flex items-center gap-1 text-sm font-semibold text-slate-600 hover:text-violet-600 transition-colors cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Quay lại danh sách
        </button>
      </div>

      {/* Main product info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Left: Image */}
        <div className="relative overflow-hidden bg-slate-50 border border-slate-100 rounded-3xl shadow-sm aspect-square">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {product.stock <= 0 && (
            <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center backdrop-blur-[2px]">
              <span className="bg-rose-600 text-white font-bold text-sm uppercase px-4 py-2 rounded-full tracking-wide">
                Hết hàng
              </span>
            </div>
          )}
        </div>

        {/* Right: Info */}
        <div className="space-y-6 text-left">
          <div className="space-y-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-violet-50 text-violet-600">
              {product.category?.name}
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight my-0 leading-tight">
              {product.name}
            </h1>
          </div>

          <div className="text-2xl font-extrabold text-slate-900">
            {formatPrice(product.price)}
          </div>

          <div className="border-t border-b border-slate-100 py-5">
            <h3 className="text-slate-800 font-bold text-sm uppercase tracking-wide mb-2">Mô tả sản phẩm</h3>
            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>

          {/* Stock info & Quantity select */}
          {product.stock > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-slate-500">Trạng thái:</span>
                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  Còn hàng ({product.stock} sản phẩm)
                </span>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-slate-500">Số lượng:</span>
                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                  <button
                    onClick={handleDecrement}
                    className="px-3 py-2 text-slate-600 hover:bg-slate-100 transition-colors font-bold cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-sm font-semibold text-slate-800 min-w-[40px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={handleIncrement}
                    className="px-3 py-2 text-slate-600 hover:bg-slate-100 transition-colors font-bold cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart button */}
              <button
                onClick={() => addToCart(product, quantity)}
                className="w-full md:w-auto px-8 py-3.5 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-2xl shadow-lg shadow-violet-100 hover:shadow-violet-200 transition-all cursor-pointer text-sm flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
                Thêm vào giỏ hàng
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-500">Trạng thái:</span>
              <span className="text-sm font-bold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full">
                Tạm hết hàng
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-slate-100 pt-16">
          <h2 className="text-2xl font-bold text-slate-800 mb-8 text-left">Sản Phẩm Tương Tự</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} navigate={navigate} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
