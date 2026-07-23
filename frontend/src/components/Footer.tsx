import React from 'react';

interface FooterProps {
  navigate: (page: string, productId?: number | null) => void;
}

export default function Footer({ navigate }: FooterProps) {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-left">
          {/* Logo & Slogan */}
          <div className="space-y-4 col-span-1 md:col-span-2">
            <span className="text-2xl font-extrabold text-white tracking-tight">
              NovaStore
            </span>
            <p className="text-sm max-w-xs text-slate-400">
              Cửa hàng cung cấp các sản phẩm thiết bị điện tử, thời trang, nội thất và sách chất lượng cao, mang lại trải nghiệm mua sắm hoàn hảo cho bạn.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-white text-sm font-semibold tracking-wider uppercase mb-4">Khám phá</h3>
            <ul className="space-y-2 text-sm p-0 list-none">
              <li>
                <button onClick={() => navigate('home')} className="hover:text-white transition-colors cursor-pointer bg-transparent border-none p-0 text-slate-400">
                  Trang Chủ
                </button>
              </li>
              <li>
                <button onClick={() => navigate('products')} className="hover:text-white transition-colors cursor-pointer bg-transparent border-none p-0 text-slate-400">
                  Sản Phẩm
                </button>
              </li>
              <li>
                <button onClick={() => navigate('dashboard')} className="hover:text-white transition-colors cursor-pointer bg-transparent border-none p-0 text-slate-400">
                  Trang Admin
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white text-sm font-semibold tracking-wider uppercase mb-4">Liên hệ</h3>
            <ul className="space-y-2 text-sm text-slate-400 p-0 list-none">
              <li>Địa chỉ: Laragon Local Host, Việt Nam</li>
              <li>Điện thoại: +84 987 654 321</li>
              <li>Email: contact@novastore.test</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-900 pt-8 flex items-center justify-between text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} NovaStore. Môi trường Laragon Local Dev.</p>
          <div className="flex space-x-4">
            <span>Powered by Laravel & React (TypeScript)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
