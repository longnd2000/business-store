import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Order } from '../types';
import { httpPost } from '../services/api';
import { Result, Button, Typography, Row, Col, Input, Radio, Space, Divider, Empty, Spin, Flex } from 'antd';
import { CheckCircleFilled } from '@ant-design/icons';

interface CheckoutProps {
  navigate: (page: string, productId?: number | null) => void;
}

export default function Checkout({ navigate }: CheckoutProps) {
  const { cart, cartTotal, clearCart } = useCart();
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    shipping_address: '',
    payment_method: 'COD' as 'COD' | 'Bank Transfer'
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [orderSuccess, setOrderSuccess] = useState<Order | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setError(null);
    setLoading(true);

    try {
      const payload = {
        ...formData,
        items: cart.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity
        }))
      };

      const data = await httpPost('/orders', payload);

      setOrderSuccess(data.order);
      clearCart();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Đặt hàng thất bại. Vui lòng kiểm tra lại thông tin.");
    } finally {
      setLoading(false);
    }
  };

  if (orderSuccess) {
    return (
      <Flex className="max-w-2xl mx-auto py-16 px-4 w-full">
        <Result
          icon={<CheckCircleFilled className="text-emerald-500" />}
          title={<Typography.Title level={2}>Đặt hàng thành công!</Typography.Title>}
          subTitle="Cảm ơn bạn đã tin tưởng và mua sắm tại NovaStore."
          extra={[
            <Button type="primary" size="large" onClick={() => navigate('products')} key="continue" className="bg-violet-600 hover:bg-violet-500 border-none rounded-xl">
              Tiếp tục mua sắm
            </Button>
          ]}
        >
          <Flex vertical className="bg-slate-50 rounded-2xl p-6 text-left border border-slate-100 space-y-4">
            <Row justify="space-between">
              <Typography.Text type="secondary">Mã đơn hàng:</Typography.Text>
              <Typography.Text strong>#ORD-{orderSuccess.id}</Typography.Text>
            </Row>
            <Row justify="space-between">
              <Typography.Text type="secondary">Người nhận:</Typography.Text>
              <Typography.Text strong>{orderSuccess.customer_name}</Typography.Text>
            </Row>
            <Row justify="space-between">
              <Typography.Text type="secondary">Số điện thoại:</Typography.Text>
              <Typography.Text strong>{orderSuccess.customer_phone}</Typography.Text>
            </Row>
            <Row justify="space-between">
              <Typography.Text type="secondary">Hình thức:</Typography.Text>
              <Typography.Text strong>{orderSuccess.payment_method}</Typography.Text>
            </Row>
            <Divider className="my-2" />
            <Row justify="space-between">
              <Typography.Text strong className="text-base">Tổng cộng:</Typography.Text>
              <Typography.Text strong className="text-base text-violet-600">{formatPrice(orderSuccess.total_amount)}</Typography.Text>
            </Row>
          </Flex>

          {orderSuccess.payment_method === 'Bank Transfer' && (
            <Flex vertical className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 text-left text-sm text-indigo-900 mt-6 space-y-2">
              <p className="font-bold m-0">Thông tin chuyển khoản ngân hàng:</p>
              <p className="m-0">Ngân hàng: Techcombank</p>
              <p className="m-0">Số tài khoản: 1903 1234 5678 90</p>
              <p className="m-0">Chủ tài khoản: NGUYEN VAN A</p>
              <p className="m-0">Nội dung CK: <span className="font-bold text-slate-850">ORD {orderSuccess.id}</span></p>
              <p className="text-slate-500 m-0 mt-2 text-xs">Hệ thống sẽ duyệt đơn hàng sau khi nhận được thanh toán.</p>
            </Flex>
          )}
        </Result>
      </Flex>
    );
  }

  if (cart.length === 0) {
    return (
      <Flex justify="center" className="max-w-md mx-auto py-20 px-4 text-center">
        <Empty description={<Typography.Text type="secondary">Không có sản phẩm nào trong giỏ để thanh toán.</Typography.Text>}>
          <Button type="primary" onClick={() => navigate('products')} className="mt-4 bg-violet-600 border-none rounded-xl">
            Quay lại cửa hàng
          </Button>
        </Empty>
      </Flex>
    );
  }

  return (
    <Flex vertical gap={32} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-left w-full">
      <Flex vertical>
        <Typography.Title level={2} className="!font-extrabold !text-slate-900 !my-0">Thanh Toán</Typography.Title>
        <Typography.Text type="secondary" className="block mt-1">Hoàn thành thông tin giao hàng của bạn</Typography.Text>
      </Flex>

      <Row gutter={[32, 32]} align="top">
        {/* Left: Billing Form */}
        <Col xs={24} lg={16}>
          <form onSubmit={handleSubmit} className="bg-white border border-slate-100 shadow-sm rounded-3xl p-6 md:p-8 space-y-6">
            <Typography.Title level={4} className="!text-slate-800 !my-0 border-b border-slate-100 pb-3">Thông tin giao hàng</Typography.Title>

            {error && (
              <Flex className="p-4 bg-rose-50 border border-rose-100 text-rose-800 text-sm font-semibold rounded-xl">
                {error}
              </Flex>
            )}

            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Space direction="vertical" className="w-full">
                  <Typography.Text strong className="text-slate-500 text-xs uppercase">Họ và tên</Typography.Text>
                  <Input
                    name="customer_name"
                    required
                    value={formData.customer_name}
                    onChange={handleInputChange}
                    placeholder="Nguyễn Văn A"
                    size="large"
                    className="rounded-xl bg-slate-50 border-slate-200"
                  />
                </Space>
              </Col>
              <Col xs={24} sm={12}>
                <Space direction="vertical" className="w-full">
                  <Typography.Text strong className="text-slate-500 text-xs uppercase">Số điện thoại</Typography.Text>
                  <Input
                    type="tel"
                    name="customer_phone"
                    required
                    value={formData.customer_phone}
                    onChange={handleInputChange}
                    placeholder="0987654321"
                    size="large"
                    className="rounded-xl bg-slate-50 border-slate-200"
                  />
                </Space>
              </Col>
            </Row>

            <Space direction="vertical" className="w-full">
              <Typography.Text strong className="text-slate-500 text-xs uppercase">Địa chỉ email</Typography.Text>
              <Input
                type="email"
                name="customer_email"
                required
                value={formData.customer_email}
                onChange={handleInputChange}
                placeholder="email@example.com"
                size="large"
                className="rounded-xl bg-slate-50 border-slate-200"
              />
            </Space>

            <Space direction="vertical" className="w-full">
              <Typography.Text strong className="text-slate-500 text-xs uppercase">Địa chỉ nhận hàng</Typography.Text>
              <Input.TextArea
                name="shipping_address"
                required
                rows={3}
                value={formData.shipping_address}
                onChange={handleInputChange}
                placeholder="Số nhà, Tên đường, Phường/Xã, Quận/Huyện, Tỉnh/Thành phố..."
                size="large"
                className="rounded-xl bg-slate-50 border-slate-200"
              />
            </Space>

            {/* Payment Options */}
            <Flex vertical gap={12} className="pt-2">
              <Typography.Text strong className="text-slate-500 text-xs uppercase block">Phương thức thanh toán</Typography.Text>
              <Radio.Group 
                className="w-full"
                value={formData.payment_method} 
                onChange={(e) => setFormData(prev => ({ ...prev, payment_method: e.target.value }))}
              >
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12}>
                    <Flex vertical className={`p-4 rounded-xl border transition-all ${formData.payment_method === 'COD' ? 'border-violet-600 bg-violet-50/50' : 'border-slate-200 bg-slate-50/20'}`}>
                      <Radio value="COD" className="font-bold text-slate-800">
                        Thanh toán khi nhận hàng (COD)
                      </Radio>
                      <Typography.Text type="secondary" className="block text-xs mt-1 ml-6">Trả tiền mặt khi nhận hàng</Typography.Text>
                    </Flex>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Flex vertical className={`p-4 rounded-xl border transition-all ${formData.payment_method === 'Bank Transfer' ? 'border-violet-600 bg-violet-50/50' : 'border-slate-200 bg-slate-50/20'}`}>
                      <Radio value="Bank Transfer" className="font-bold text-slate-800">
                        Chuyển khoản ngân hàng
                      </Radio>
                      <Typography.Text type="secondary" className="block text-xs mt-1 ml-6">Nhận thông tin STK sau khi đặt hàng</Typography.Text>
                    </Flex>
                  </Col>
                </Row>
              </Radio.Group>
            </Flex>

            <Button
              htmlType="submit"
              type="primary"
              size="large"
              block
              disabled={loading}
              className="mt-6 h-14 rounded-2xl bg-violet-600 hover:bg-violet-500 border-none font-bold text-base shadow-lg shadow-violet-100"
            >
              {loading ? <Spin /> : "Xác nhận đặt hàng"}
            </Button>
          </form>
        </Col>

        {/* Right: Cart Summary Panel */}
        <Col xs={24} lg={8}>
          <Flex vertical className="bg-slate-50 border border-slate-100 rounded-3xl p-6">
            <Typography.Title level={4} className="!font-bold !text-slate-800 !mt-0 !mb-4 border-b border-slate-200 pb-3">Đơn hàng của bạn</Typography.Title>
            
            <Flex vertical className="divide-y divide-slate-100 max-h-60 overflow-y-auto pr-2 mb-4">
              {cart.map(item => (
                <Flex key={item.product.id} justify="space-between" align="center" className="py-3 text-sm">
                  <Flex vertical className="min-w-0 pr-3">
                    <Typography.Text strong className="line-clamp-1">{item.product.name}</Typography.Text>
                    <Typography.Text type="secondary" className="text-xs">Số lượng: {item.quantity}</Typography.Text>
                  </Flex>
                  <Typography.Text strong className="flex-shrink-0">{formatPrice(item.product.price * item.quantity)}</Typography.Text>
                </Flex>
              ))}
            </Flex>

            <Divider className="my-3" />

            <Space direction="vertical" className="w-full" size="small">
              <Flex justify="space-between" className="text-sm text-slate-600">
                <span>Tạm tính:</span>
                <Typography.Text strong>{formatPrice(cartTotal)}</Typography.Text>
              </Flex>
              <Flex justify="space-between" className="text-sm text-slate-600">
                <span>Phí vận chuyển:</span>
                <Typography.Text strong className="text-emerald-600">Miễn phí</Typography.Text>
              </Flex>
              <Divider className="my-2" />
              <Flex justify="space-between" className="text-base font-bold text-slate-900">
                <span>Tổng cộng:</span>
                <span>{formatPrice(cartTotal)}</span>
              </Flex>
            </Space>
          </Flex>
        </Col>
      </Row>
    </Flex>
  );
}
