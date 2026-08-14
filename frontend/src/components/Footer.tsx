import React from 'react';
import { Layout, Row, Col, Typography, Space, Flex } from 'antd';

interface FooterProps {
  navigate: (page: string, productId?: number | null) => void;
}

export default function Footer({ navigate }: FooterProps) {
  return (
    <Layout.Footer className="bg-slate-950 text-slate-400 border-t border-slate-900 mt-auto p-0">
      <Flex vertical className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 w-full">
        <Row gutter={[32, 32]} className="text-left w-full">
          {/* Logo & Slogan */}
          <Col xs={24} md={12}>
            <Space direction="vertical" size="middle">
              <Typography.Text className="text-2xl font-extrabold text-white tracking-tight">
                NovaStore
              </Typography.Text>
              <Typography.Paragraph className="text-sm max-w-xs text-slate-400 m-0">
                Cửa hàng cung cấp các sản phẩm thiết bị điện tử, thời trang, nội thất và sách chất lượng cao, mang lại trải nghiệm mua sắm hoàn hảo cho bạn.
              </Typography.Paragraph>
            </Space>
          </Col>

          {/* Quick links */}
          <Col xs={24} md={6}>
            <Typography.Title level={5} className="!text-white !text-sm !font-semibold tracking-wider uppercase !mb-4">Khám phá</Typography.Title>
            <Space direction="vertical" size="small">
              <Typography.Link onClick={() => navigate('home')} className="!text-slate-400 hover:!text-white transition-colors cursor-pointer">
                Trang Chủ
              </Typography.Link>
              <Typography.Link onClick={() => navigate('products')} className="!text-slate-400 hover:!text-white transition-colors cursor-pointer">
                Sản Phẩm
              </Typography.Link>
              <Typography.Link onClick={() => navigate('dashboard')} className="!text-slate-400 hover:!text-white transition-colors cursor-pointer">
                Trang Admin
              </Typography.Link>
            </Space>
          </Col>

          {/* Contact Info */}
          <Col xs={24} md={6}>
            <Typography.Title level={5} className="!text-white !text-sm !font-semibold tracking-wider uppercase !mb-4">Liên hệ</Typography.Title>
            <Space direction="vertical" size="small" className="text-sm text-slate-400">
              <Typography.Text className="text-slate-400">Địa chỉ: Laragon Local Host, Việt Nam</Typography.Text>
              <Typography.Text className="text-slate-400">Điện thoại: +84 987 654 321</Typography.Text>
              <Typography.Text className="text-slate-400">Email: contact@novastore.test</Typography.Text>
            </Space>
          </Col>
        </Row>

        <Flex justify="space-between" align="center" className="mt-8 border-t border-slate-900 pt-8 text-xs text-slate-500 w-full">
          <Typography.Text className="text-slate-500">&copy; {new Date().getFullYear()} NovaStore. Môi trường Laragon Local Dev.</Typography.Text>
          <Space>
            <Typography.Text className="text-slate-500">Powered by Laravel & React (TypeScript)</Typography.Text>
          </Space>
        </Flex>
      </Flex>
    </Layout.Footer>
  );
}
