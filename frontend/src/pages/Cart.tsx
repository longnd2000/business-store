import React from 'react';
import { useCart } from '../context/CartContext';
import { Empty, Button, Typography, List, Avatar, Space, InputNumber, Divider, Row, Col, Flex } from 'antd';
import { DeleteOutlined, ShoppingCartOutlined } from '@ant-design/icons';

interface CartProps {
  navigate: (page: string, productId?: number | null) => void;
}

export default function Cart({ navigate }: CartProps) {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  if (cart.length === 0) {
    return (
      <Flex justify="center" className="max-w-md mx-auto py-20 px-4 text-center">
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={<Typography.Text type="secondary">Giỏ hàng của bạn đang trống. Hãy quay lại cửa hàng và chọn các sản phẩm ưng ý nhất nhé!</Typography.Text>}
        >
          <Button 
            type="primary" 
            size="large" 
            icon={<ShoppingCartOutlined />}
            onClick={() => navigate('products')} 
            className="mt-4 bg-violet-600 hover:bg-violet-500 border-none rounded-xl"
          >
            Khám phá sản phẩm
          </Button>
        </Empty>
      </Flex>
    );
  }

  return (
    <Flex vertical gap={32} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-left w-full">
      <Flex vertical>
        <Typography.Title level={2} className="!font-extrabold !text-slate-900 !my-0">Giỏ Hàng Của Bạn</Typography.Title>
        <Typography.Text type="secondary" className="block mt-1">Kiểm tra lại danh sách các sản phẩm đã chọn</Typography.Text>
      </Flex>

      <Row gutter={[32, 32]} align="top" className="w-full">
        {/* Left: Cart Items List */}
        <Col xs={24} lg={16}>
          <List
            itemLayout="horizontal"
            dataSource={cart}
            renderItem={item => (
              <List.Item
                className="bg-white rounded-2xl border border-slate-100 shadow-sm mb-4 px-4 py-4"
                actions={[
                  <Button 
                    key="delete"
                    type="text" 
                    danger 
                    icon={<DeleteOutlined />} 
                    onClick={() => removeFromCart(item.product.id)} 
                  />
                ]}
              >
                <Flex align="center" gap={16} wrap="wrap" className="w-full">
                  <Flex flex={1} style={{ minWidth: 0 }}>
                    <List.Item.Meta
                      avatar={
                        <Avatar 
                          src={item.product.image_url} 
                          shape="square" 
                          size={80} 
                          style={{ cursor: 'pointer' }} 
                          onClick={() => navigate('detail', item.product.id)} 
                        />
                      }
                      title={
                        <a onClick={() => navigate('detail', item.product.id)} className="font-semibold text-slate-800 line-clamp-1 hover:text-violet-600">
                          {item.product.name}
                        </a>
                      }
                      description={
                        <Space direction="vertical" size="small" className="mt-1">
                          <Typography.Text type="secondary" className="text-xs">
                            Đơn giá: {formatPrice(item.product.price)}
                          </Typography.Text>
                          <Typography.Text strong className="text-slate-800 text-xs">
                            Tổng: {formatPrice(item.product.price * item.quantity)}
                          </Typography.Text>
                        </Space>
                      }
                    />
                  </Flex>
                  <Flex className="pl-[96px] sm:pl-0 pt-2 sm:pt-0">
                    <InputNumber 
                      min={1} 
                      value={item.quantity} 
                      onChange={(val) => updateQuantity(item.product.id, val || 1)} 
                    />
                  </Flex>
                </Flex>
              </List.Item>
            )}
          />
        </Col>

        {/* Right: Summary panel */}
        <Col xs={24} lg={8}>
          <Flex vertical className="bg-slate-50 border border-slate-100 rounded-3xl p-6">
            <Typography.Title level={4} className="!font-bold !text-slate-800 !mt-0 !mb-4 border-b border-slate-200 pb-3">
              Tổng đơn hàng
            </Typography.Title>
            <Space direction="vertical" className="w-full" size="middle">
              <Flex justify="space-between" className="text-sm text-slate-600">
                <span>Tạm tính ({cart.reduce((s, i) => s + i.quantity, 0)} món)</span>
                <span>{formatPrice(cartTotal)}</span>
              </Flex>
              <Flex justify="space-between" className="text-sm text-slate-600">
                <span>Phí vận chuyển</span>
                <span className="text-emerald-600 font-medium">Miễn phí</span>
              </Flex>
              <Divider className="my-0" />
              <Flex justify="space-between" className="font-bold text-slate-900 text-base">
                <span>Tổng thanh toán</span>
                <span>{formatPrice(cartTotal)}</span>
              </Flex>
              <Button
                type="primary"
                size="large"
                block
                onClick={() => navigate('checkout')}
                className="mt-4 h-12 rounded-2xl bg-violet-600 hover:bg-violet-500 border-none font-semibold shadow-lg shadow-violet-100"
              >
                Tiến hành thanh toán
              </Button>
            </Space>
          </Flex>
        </Col>
      </Row>
    </Flex>
  );
}
