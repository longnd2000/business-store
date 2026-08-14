import React from 'react';
import { useCart } from '../context/CartContext';
import { Product } from '../types';
import { Card, Button, Typography, Tag, Badge, Flex } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';

interface ProductCardProps {
  product: Product;
  navigate: (page: string, productId?: number | null) => void;
}

export default function ProductCard({ product, navigate }: ProductCardProps) {
  const { addToCart } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <Badge.Ribbon 
      text="Hết hàng" 
      color="red" 
      style={{ display: product.stock <= 0 ? 'block' : 'none' }}
    >
      <Card
        hoverable
        className={`h-full flex flex-col rounded-2xl overflow-hidden border-slate-100 ${product.stock <= 0 ? 'opacity-80 grayscale-[30%]' : ''}`}
        styles={{ 
          body: { display: 'flex', flexDirection: 'column', flex: 1, padding: '20px' },
          cover: { overflow: 'hidden' }
        }}
        cover={
          <Flex 
            className="relative aspect-square cursor-pointer overflow-hidden bg-slate-50"
            onClick={() => navigate('detail', product.id)}
          >
            <img
              alt={product.name}
              src={product.image_url}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              loading="lazy"
            />
            {product.stock > 0 && product.stock <= 5 && (
              <Flex className="absolute top-3 left-3">
                <Tag color="orange" className="!font-bold !m-0 !rounded-full !px-3">
                  Chỉ còn {product.stock}
                </Tag>
              </Flex>
            )}
          </Flex>
        }
      >
        <Flex className="mb-2">
          <Tag color="purple" className="!font-bold !rounded-md">
            {product.category?.name || 'Sản phẩm'}
          </Tag>
        </Flex>

        <Typography.Title 
          level={5} 
          className="!font-semibold !text-slate-800 line-clamp-1 hover:text-violet-600 transition-colors cursor-pointer !mb-1"
          onClick={() => navigate('detail', product.id)}
        >
          {product.name}
        </Typography.Title>

        <Typography.Paragraph type="secondary" className="text-xs line-clamp-2 !mb-4 flex-1">
          {product.description}
        </Typography.Paragraph>

        <Flex align="center" justify="space-between" className="mt-auto">
          <Typography.Text strong className="text-lg text-slate-900">
            {formatPrice(product.price)}
          </Typography.Text>

          <Button
            type="primary"
            shape="circle"
            icon={<ShoppingCartOutlined />}
            size="large"
            disabled={product.stock <= 0}
            onClick={() => addToCart(product, 1)}
            className={`${product.stock <= 0 ? '' : 'bg-violet-600 hover:bg-violet-500 shadow-md shadow-violet-200'}`}
          />
        </Flex>
      </Card>
    </Badge.Ribbon>
  );
}
