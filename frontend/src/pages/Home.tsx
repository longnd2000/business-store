import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { Category, Product } from '../types';
import { httpGet } from '../services/api';
import { Button, Skeleton, Result, Empty, Row, Col, Typography, Space, Flex, Layout, Card } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';

interface HomeProps {
  navigate: (page: string, productId?: number | null) => void;
}

export default function Home({ navigate }: HomeProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [latestNews, setLatestNews] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoriesData, productsData, newsData] = await Promise.all([
          httpGet('/categories'),
          httpGet('/products'),
          httpGet('/news')
        ]);

        setCategories(categoriesData);
        setFeaturedProducts(productsData.slice(0, 4));
        setLatestNews(newsData.slice(0, 3));
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Không thể tải dữ liệu. Bạn hãy đảm bảo kết nối API đang hoạt động.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Flex vertical gap={64} className="pb-16 w-full">
      {/* Hero Banner */}
      <div className="max-w-7xl mx-auto px-4 w-full mt-6">
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl py-20 px-8 md:px-16 shadow-xl">
          <Flex className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.15),transparent_50%)]" />
          <Flex vertical gap={24} className="relative max-w-xl text-left">
            <Typography.Text className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 w-max">
              ✨ Chào mừng đến với NovaStore
            </Typography.Text>
            <Typography.Title level={1} className="!text-4xl md:!text-5xl !font-extrabold !tracking-tight !leading-tight !m-0 !text-white">
              Khám phá Không gian <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">Công nghệ & Đời sống</span> Của Bạn
            </Typography.Title>
            <Typography.Paragraph className="!text-slate-300 !text-sm md:!text-base !leading-relaxed !m-0">
              NovaStore cung cấp các thiết bị điện tử tối tân, đồ dùng văn phòng, nội thất hiện đại và phụ kiện phong cách giúp nâng tầm cuộc sống của bạn.
            </Typography.Paragraph>
            <Flex gap={16}>
              <Button
                type="primary"
                size="large"
                onClick={() => navigate('products')}
                className="px-6 h-12 rounded-xl bg-violet-600 hover:bg-violet-500 border-none text-white font-semibold shadow-lg shadow-violet-600/30"
              >
                Mua sắm ngay
              </Button>
            </Flex>
          </Flex>
        </div>
      </div>

      {/* Categories Section */}
      <Flex vertical align="center" className="max-w-7xl mx-auto px-4 w-full">
        <Flex vertical align="center" className="max-w-md mx-auto mb-10 text-center">
          <Typography.Title level={2} className="!text-slate-800 !font-bold !m-0">Danh Mục Nổi Bật</Typography.Title>
          <Typography.Text type="secondary" className="block mt-2">Duyệt nhanh qua các nhóm sản phẩm chất lượng cao của chúng tôi</Typography.Text>
        </Flex>

        {loading ? (
          <Row gutter={[24, 24]} className="w-full">
            {[1, 2, 3, 4].map((i) => (
              <Col xs={12} md={6} key={i}>
                <Skeleton.Button active style={{ width: '100%', height: '160px', borderRadius: '16px' }} />
              </Col>
            ))}
          </Row>
        ) : error ? (
          <Result status="error" subTitle={error} />
        ) : (
          <Row gutter={[24, 24]} className="w-full">
            {categories.map((category) => (
              <Col xs={12} md={6} key={category.id}>
                <Flex
                  onClick={() => {
                    navigate('products');
                  }}
                  className="group relative overflow-hidden h-40 rounded-2xl shadow-sm border border-slate-100 cursor-pointer hover:shadow-md transition-all duration-300"
                >
                  <img
                    src={category.image_url}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <Flex vertical justify="flex-end" className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent p-4 text-left">
                    <Typography.Title level={3} className="!text-white !font-bold !text-base md:!text-lg !tracking-tight !m-0">
                      {category.name}
                    </Typography.Title>
                    <Typography.Text className="!text-xs !text-indigo-200 !font-medium">
                      {category.products_count} sản phẩm
                    </Typography.Text>
                  </Flex>
                </Flex>
              </Col>
            ))}
          </Row>
        )}
      </Flex>

      {/* Featured Products Section */}
      <Flex vertical className="max-w-7xl mx-auto px-4 w-full">
        <Flex align="center" justify="space-between" className="mb-10 w-full">
          <Flex vertical className="text-left">
            <Typography.Title level={2} className="!text-slate-800 !font-bold !m-0">Sản Phẩm Mới Nhất</Typography.Title>
            <Typography.Text type="secondary" className="block mt-1">Lựa chọn hàng đầu dành riêng cho phong cách của bạn</Typography.Text>
          </Flex>
          <Button
            type="link"
            onClick={() => navigate('products')}
            className="text-violet-600 hover:text-violet-500 font-semibold flex items-center gap-1.5"
          >
            Xem tất cả <ArrowRightOutlined />
          </Button>
        </Flex>

        {loading ? (
          <Row gutter={[32, 32]} className="w-full">
            {[1, 2, 3, 4].map((i) => (
              <Col xs={24} sm={12} md={6} key={i}>
                <Space direction="vertical" className="w-full">
                  <Skeleton.Image active style={{ width: '100%', height: '240px', borderRadius: '16px' }} />
                  <Skeleton active paragraph={{ rows: 2 }} />
                </Space>
              </Col>
            ))}
          </Row>
        ) : error ? (
          <Empty description="Không có sản phẩm để hiển thị." />
        ) : (
          <Row gutter={[32, 32]} className="w-full">
            {featuredProducts.map((product) => (
              <Col xs={24} sm={12} md={6} key={product.id}>
                <ProductCard product={product} navigate={navigate} />
              </Col>
            ))}
          </Row>
        )}
      </Flex>

      {/* Latest News Section */}
      <Flex vertical className="max-w-7xl mx-auto px-4 w-full">
        <Flex align="center" justify="space-between" className="mb-10 w-full">
          <Flex vertical className="text-left">
            <Typography.Title level={2} className="!text-slate-800 !font-bold !m-0">Tin Tức & Xu Hướng</Typography.Title>
            <Typography.Text type="secondary" className="block mt-1">Cập nhật những xu hướng thiết kế và chia sẻ mới nhất từ NovaStore</Typography.Text>
          </Flex>
          <Button
            type="link"
            onClick={() => navigate('news')}
            className="text-violet-600 hover:text-violet-500 font-semibold flex items-center gap-1.5"
          >
            Xem tất cả bài viết <ArrowRightOutlined />
          </Button>
        </Flex>

        {loading ? (
          <Row gutter={[24, 24]} className="w-full">
            {[1, 2, 3].map((i) => (
              <Col xs={24} md={8} key={i}>
                <Space direction="vertical" className="w-full">
                  <Skeleton.Image active style={{ width: '100%', height: '180px', borderRadius: '16px' }} />
                  <Skeleton active paragraph={{ rows: 2 }} />
                </Space>
              </Col>
            ))}
          </Row>
        ) : latestNews.length === 0 ? (
          <Empty description="Không có tin tức để hiển thị." />
        ) : (
          <Row gutter={[24, 24]} className="w-full">
            {latestNews.map((article: any) => (
              <Col xs={24} md={8} key={article.id}>
                <Card
                  hoverable
                  onClick={() => navigate('news-detail', article.id)}
                  cover={
                    <div className="relative overflow-hidden h-48 rounded-t-2xl">
                      <img
                        src={article.image_url}
                        alt={article.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  }
                  className="group rounded-2xl overflow-hidden shadow-sm h-full flex flex-col border-slate-100 hover:shadow-lg transition-all"
                  styles={{ body: { padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' } }}
                >
                  <Flex vertical gap={8} className="flex-grow text-left">
                    <span className="text-[10px] text-slate-400 font-semibold">{new Date(article.created_at).toLocaleDateString('vi-VN')}</span>
                    <Typography.Title level={5} className="!font-bold !text-slate-800 !m-0 group-hover:text-violet-650 transition-colors line-clamp-2 !leading-snug">
                      {article.title}
                    </Typography.Title>
                    <Typography.Paragraph className="!text-slate-500 !text-xs !m-0 line-clamp-2 !leading-relaxed">
                      {article.summary}
                    </Typography.Paragraph>
                  </Flex>
                  <div className="border-t border-slate-100 pt-3 mt-4 text-right">
                    <span className="text-xs font-bold text-violet-600 group-hover:text-violet-750 flex items-center justify-end gap-1">
                      Đọc tiếp <ArrowRightOutlined className="text-[10px]" />
                    </span>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Flex>
    </Flex>
  );
}
