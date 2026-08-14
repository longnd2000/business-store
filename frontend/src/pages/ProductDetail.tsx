import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Product } from '../types';
import { httpGet } from '../services/api';
import { Skeleton, Result, Button, InputNumber, Tag, Row, Col, Typography, Space, Divider, Flex } from 'antd';
import { ShoppingCartOutlined, ArrowLeftOutlined } from '@ant-design/icons';

interface ProductDetailProps {
  productId: number | null;
  navigate: (page: string, productId?: number | null) => void;
}

export default function ProductDetail({ productId, navigate }: ProductDetailProps) {
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const data = await httpGet(`/products/${productId}`);
        setProduct(data);
        setQuantity(1);
        setError(null);

        if (data.category?.slug) {
          try {
            const relatedData: Product[] = await httpGet(`/products`, { category: data.category.slug });
            setRelatedProducts(relatedData.filter(p => p.id !== data.id).slice(0, 4));
          } catch (e) {
            console.error(e);
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

  if (loading) {
    return (
      <Flex vertical className="max-w-7xl mx-auto px-4 py-16 w-full">
        <Skeleton.Button active size="small" className="w-32 mb-8" />
        <Row gutter={[48, 48]} className="w-full">
          <Col xs={24} md={12}>
            <Flex align="center" justify="center" className="w-full aspect-square rounded-3xl overflow-hidden bg-slate-50">
              <Skeleton.Image active style={{ width: '200px', height: '200px' }} />
            </Flex>
          </Col>
          <Col xs={24} md={12}>
            <Skeleton active paragraph={{ rows: 6 }} />
            <Skeleton.Button active size="large" className="w-48 mt-8" />
          </Col>
        </Row>
      </Flex>
    );
  }

  if (error || !product) {
    return (
      <Flex justify="center" align="center" className="max-w-7xl mx-auto py-20 px-4 w-full">
        <Result
          status="error"
          title="Không thể tải sản phẩm"
          subTitle={error || "Sản phẩm không khả dụng."}
          extra={[
            <Button key="back" type="primary" onClick={() => navigate('products')}>
              Quay lại cửa hàng
            </Button>
          ]}
        />
      </Flex>
    );
  }

  return (
    <Flex vertical gap={48} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Back button */}
      <Flex className="text-left w-full">
        <Button
          type="link"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('products')}
          className="px-0 text-slate-600 hover:text-violet-600 font-semibold"
        >
          Quay lại danh sách
        </Button>
      </Flex>

      {/* Main product info */}
      <Row gutter={[48, 48]} align="top" className="w-full">
        {/* Left: Image */}
        <Col xs={24} md={12}>
          <Flex className="relative overflow-hidden bg-slate-50 border border-slate-100 rounded-3xl shadow-sm aspect-square w-full">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.stock <= 0 && (
              <Flex align="center" justify="center" className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px]">
                <Tag color="error" className="text-sm px-4 py-2 uppercase tracking-wide border-none font-bold">
                  Hết hàng
                </Tag>
              </Flex>
            )}
          </Flex>
        </Col>

        {/* Right: Info */}
        <Col xs={24} md={12}>
          <Space direction="vertical" size="large" className="w-full text-left">
            <Space direction="vertical" size="small" className="w-full">
              <Tag color="purple" className="px-3 py-1 rounded-full text-xs font-semibold border-none bg-violet-50 text-violet-600">
                {product.category?.name}
              </Tag>
              <Typography.Title level={1} className="!my-0 !text-slate-900 tracking-tight font-extrabold text-3xl md:text-4xl">
                {product.name}
              </Typography.Title>
            </Space>

            <Typography.Title level={2} className="!my-0 !text-slate-900 font-extrabold">
              {formatPrice(product.price)}
            </Typography.Title>

            <Divider className="my-2" />

            <Flex vertical>
              <Typography.Text strong className="text-slate-800 uppercase tracking-wide mb-2 block text-sm">
                Mô tả sản phẩm
              </Typography.Text>
              <Typography.Paragraph className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                {product.description}
              </Typography.Paragraph>
            </Flex>

            <Divider className="my-2" />

            {/* Stock info & Quantity select */}
            {product.stock > 0 ? (
              <Space direction="vertical" size="middle" className="w-full">
                <Space size="middle">
                  <Typography.Text type="secondary" className="font-medium text-sm">Trạng thái:</Typography.Text>
                  <Tag color="success" className="px-2.5 py-0.5 rounded-full font-bold border-none">
                    Còn hàng ({product.stock} sản phẩm)
                  </Tag>
                </Space>

                <Space size="middle" className="items-center mt-2">
                  <Typography.Text type="secondary" className="font-medium text-sm">Số lượng:</Typography.Text>
                  <InputNumber 
                    min={1} 
                    max={product.stock} 
                    value={quantity} 
                    onChange={(val) => setQuantity(val || 1)}
                    size="large"
                    className="w-24"
                  />
                </Space>

                <Button
                  type="primary"
                  size="large"
                  icon={<ShoppingCartOutlined />}
                  onClick={() => addToCart(product, quantity)}
                  className="w-full md:w-auto px-8 mt-4 h-12 rounded-2xl shadow-lg shadow-violet-100 hover:shadow-violet-200 font-semibold bg-violet-600 hover:bg-violet-500 border-none"
                >
                  Thêm vào giỏ hàng
                </Button>
              </Space>
            ) : (
              <Space size="middle">
                <Typography.Text type="secondary" className="font-medium text-sm">Trạng thái:</Typography.Text>
                <Tag color="error" className="px-2.5 py-0.5 rounded-full font-bold border-none">
                  Tạm hết hàng
                </Tag>
              </Space>
            )}
          </Space>
        </Col>
      </Row>
    </Flex>
  );
}
