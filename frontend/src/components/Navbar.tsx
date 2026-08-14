import React from 'react';
import { useCart } from '../context/CartContext';
import { Badge, Button, Typography, Space, Flex, Layout } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';

interface NavbarProps {
  navigate: (page: string, productId?: number | null) => void;
  currentPage: string;
}

export default function Navbar({ navigate, currentPage }: NavbarProps) {
  const { cartCount } = useCart();

  return (
    <Layout.Header 
      className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all duration-300 h-16 px-0 leading-normal"
      style={{ background: 'rgba(255, 255, 255, 0.8)', padding: 0 }}
    >
      <Flex className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full w-full">
        <Flex align="center" justify="space-between" className="h-full w-full">
          {/* Logo */}
          <Flex align="center" onClick={() => navigate('home')} className="cursor-pointer">
            <span className="text-2xl font-extrabold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">
              NovaStore
            </span>
          </Flex>

          {/* Navigation Links */}
          <Space size="large" className="hidden md:flex">
            <Typography.Link
              onClick={() => navigate('home')}
              className={`text-sm font-medium transition-colors cursor-pointer !text-slate-600 hover:!text-violet-600 ${
                currentPage === 'home' ? '!text-violet-600 border-b-2 border-violet-600 pb-1' : ''
              }`}
            >
              Trang Chủ
            </Typography.Link>
            <Typography.Link
              onClick={() => navigate('products')}
              className={`text-sm font-medium transition-colors cursor-pointer !text-slate-600 hover:!text-violet-600 ${
                currentPage === 'products' || currentPage === 'detail' ? '!text-violet-600 border-b-2 border-violet-600 pb-1' : ''
              }`}
            >
              Sản Phẩm
            </Typography.Link>
            <Typography.Link
              onClick={() => navigate('news')}
              className={`text-sm font-medium transition-colors cursor-pointer !text-slate-600 hover:!text-violet-600 ${
                currentPage === 'news' || currentPage === 'news-detail' ? '!text-violet-600 border-b-2 border-violet-600 pb-1' : ''
              }`}
            >
              Tin Tức
            </Typography.Link>
            <Typography.Link
              onClick={() => navigate('dashboard')}
              className={`text-sm font-medium transition-colors cursor-pointer !text-slate-600 hover:!text-violet-600 ${
                currentPage === 'dashboard' ? '!text-violet-600 border-b-2 border-violet-600 pb-1' : ''
              }`}
            >
              Quản Trị (Admin)
            </Typography.Link>
          </Space>

          {/* Cart Icon */}
          <Flex align="center">
            <Badge count={cartCount} showZero={false} size="small" color="#7c3aed">
              <Button 
                type="text" 
                shape="circle" 
                icon={<ShoppingCartOutlined className="text-xl text-slate-600 hover:text-violet-600" />} 
                size="large"
                onClick={() => navigate('cart')}
              />
            </Badge>
          </Flex>
        </Flex>
      </Flex>
    </Layout.Header>
  );
}
