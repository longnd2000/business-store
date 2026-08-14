import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { Category, Product } from '../types';
import { useDebounce } from '../hooks/useDebounce';
import { httpGet } from '../services/api';
import { Input, Typography, Row, Col, Skeleton, Result, Empty, Space, Button, Flex } from 'antd';

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

  // Áp dụng useDebounce hook để trì hoãn cập nhật truy vấn tìm kiếm
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await httpGet('/categories');
        setCategories(data);
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
        const params: Record<string, string> = {};
        if (selectedCategory !== 'all') {
          params.category = selectedCategory;
        }
        if (debouncedSearchQuery) {
          params.q = debouncedSearchQuery;
        }

        const data = await httpGet('/products', params);
        setProducts(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Không thể tải danh sách sản phẩm.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, debouncedSearchQuery]);

  return (
    <Flex vertical gap={32} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-left w-full">
      {/* Title */}
      <Flex 
        vertical={false} 
        align="center" 
        justify="space-between" 
        wrap="wrap" 
        gap={16} 
        className="border-b border-slate-100 pb-5"
      >
        <Flex vertical>
          <Typography.Title level={2} className="!font-extrabold !text-slate-900 !my-0">Cửa hàng Sản phẩm</Typography.Title>
          <Typography.Text type="secondary" className="block mt-1">Duyệt qua bộ sưu tập đầy đủ của chúng tôi</Typography.Text>
        </Flex>

        {/* Search Box */}
        <Flex className="relative max-w-md w-full">
          <Input.Search 
            placeholder="Tìm kiếm sản phẩm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="large"
            className="w-full"
            allowClear
          />
        </Flex>
      </Flex>

      {/* Category Filter Pills */}
      <Space wrap className="pb-2">
        <Button
          type={selectedCategory === 'all' ? 'primary' : 'default'}
          onClick={() => setSelectedCategory('all')}
          shape="round"
          className={`font-semibold tracking-wide uppercase text-xs px-4 h-9 ${selectedCategory === 'all' ? 'bg-violet-600' : 'text-slate-600'}`}
        >
          Tất cả
        </Button>
        {categories.map((category) => (
          <Button
            key={category.id}
            type={selectedCategory === category.slug ? 'primary' : 'default'}
            onClick={() => setSelectedCategory(category.slug)}
            shape="round"
            className={`font-semibold tracking-wide uppercase text-xs px-4 h-9 ${selectedCategory === category.slug ? 'bg-violet-600' : 'text-slate-600'}`}
          >
            {category.name}
          </Button>
        ))}
      </Space>

      {/* Products Grid */}
      {loading ? (
        <Row gutter={[32, 32]}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Col xs={24} sm={12} lg={6} key={i}>
              <Space direction="vertical" className="w-full">
                <Skeleton.Image active style={{ width: '100%', height: '240px', borderRadius: '16px' }} />
                <Skeleton active paragraph={{ rows: 2 }} />
              </Space>
            </Col>
          ))}
        </Row>
      ) : error ? (
        <Result status="error" subTitle={error} />
      ) : products.length === 0 ? (
        <Empty description="Không tìm thấy sản phẩm" className="my-16" />
      ) : (
        <Row gutter={[32, 32]}>
          {products.map((product) => (
            <Col xs={24} sm={12} lg={6} key={product.id}>
              <ProductCard product={product} navigate={navigate} />
            </Col>
          ))}
        </Row>
      )}
    </Flex>
  );
}
