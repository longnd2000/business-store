import React, { useState, useEffect } from 'react';
import { News as NewsType } from '../types';
import { useDebounce } from '../hooks/useDebounce';
import { httpGet } from '../services/api';
import { Input, Typography, Row, Col, Skeleton, Result, Empty, Card, Flex, Button, Space } from 'antd';
import { CalendarOutlined, UserOutlined, ClockCircleOutlined, ArrowRightOutlined } from '@ant-design/icons';

interface NewsProps {
  navigate: (page: string, productId?: number | null) => void;
}

export default function News({ navigate }: NewsProps) {
  const [articles, setArticles] = useState<NewsType[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const params: Record<string, string> = {};
        if (debouncedSearchQuery) {
          params.q = debouncedSearchQuery;
        }
        const data = await httpGet('/news', params);
        setArticles(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch news:", err);
        setError("Không thể tải danh sách tin tức.");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [debouncedSearchQuery]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  // Simple reading time estimator based on content word count (assuming 200 words per min)
  const estimateReadTime = (htmlContent: string) => {
    const text = htmlContent.replace(/<[^>]*>/g, ''); // strip HTML tags
    const wordCount = text.split(/\s+/).filter(Boolean).length;
    const time = Math.max(1, Math.ceil(wordCount / 150)); // Vietnamese reads slightly slower
    return `${time} phút đọc`;
  };

  const featuredArticle = articles.length > 0 && !searchQuery ? articles[0] : null;
  const regularArticles = featuredArticle ? articles.slice(1) : articles;

  return (
    <Flex vertical gap={48} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full text-left">
      
      {/* Title & Search bar */}
      <Flex 
        vertical={false} 
        align="center" 
        justify="space-between" 
        wrap="wrap" 
        gap={16} 
        className="border-b border-slate-100 pb-5"
      >
        <Flex vertical>
          <Typography.Title level={2} className="!font-extrabold !text-slate-900 !my-0 bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            Tin Tức & Xu Hướng
          </Typography.Title>
          <Typography.Text type="secondary" className="block mt-1">Cập nhật xu hướng công nghệ, thiết kế không gian sống và phong cách thời trang</Typography.Text>
        </Flex>

        {/* Search Box */}
        <Flex className="relative max-w-md w-full">
          <Input.Search 
            placeholder="Tìm kiếm bài viết..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="large"
            className="w-full rounded-xl"
            allowClear
          />
        </Flex>
      </Flex>

      {/* Loading state */}
      {loading ? (
        <Flex vertical gap={32} className="w-full">
          {!searchQuery && (
            <div className="bg-slate-100 rounded-3xl p-8 h-96 animate-pulse" />
          )}
          <Row gutter={[32, 32]}>
            {[1, 2, 3].map((i) => (
              <Col xs={24} md={8} key={i}>
                <Space direction="vertical" className="w-full">
                  <Skeleton.Image active style={{ width: '100%', height: '200px', borderRadius: '24px' }} />
                  <Skeleton active paragraph={{ rows: 3 }} />
                </Space>
              </Col>
            ))}
          </Row>
        </Flex>
      ) : error ? (
        <Result status="error" subTitle={error} />
      ) : articles.length === 0 ? (
        <Empty description="Không tìm thấy bài viết nào" className="my-16" />
      ) : (
        <Flex vertical gap={48} className="w-full">
          
          {/* Featured Article Banner */}
          {featuredArticle && (
            <div 
              onClick={() => navigate(`news-detail`, featuredArticle.id)}
              className="group relative overflow-hidden bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 text-white rounded-3xl cursor-pointer hover:shadow-2xl hover:shadow-indigo-900/10 transition-all duration-500 shadow-xl border border-slate-800"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.15),transparent_50%)]" />
              <Row gutter={[0, 0]} className="h-full items-stretch">
                <Col xs={24} lg={12} className="relative min-h-[300px] lg:min-h-[420px]">
                  <img 
                    src={featuredArticle.image_url} 
                    alt={featuredArticle.title} 
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-slate-950 via-transparent to-transparent opacity-80" />
                </Col>
                <Col xs={24} lg={12} className="p-8 md:p-12 flex flex-col justify-between relative z-10">
                  <Flex vertical gap={16} className="h-full justify-center">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/20 text-violet-300 border border-violet-500/30 w-max">
                      ⭐ Bài viết nổi bật
                    </span>
                    <Typography.Title level={2} className="!text-white !font-extrabold !text-2xl md:!text-3xl !m-0 group-hover:text-violet-400 transition-colors duration-300 !leading-tight">
                      {featuredArticle.title}
                    </Typography.Title>
                    <Typography.Paragraph className="!text-slate-300 !text-sm md:!text-base !leading-relaxed !m-0 line-clamp-3">
                      {featuredArticle.summary}
                    </Typography.Paragraph>
                    <Flex gap={20} className="text-slate-400 text-xs mt-2" wrap="wrap">
                      <span className="flex items-center gap-1.5"><UserOutlined className="text-violet-400" /> {featuredArticle.author}</span>
                      <span className="flex items-center gap-1.5"><CalendarOutlined className="text-violet-400" /> {formatDate(featuredArticle.created_at)}</span>
                      <span className="flex items-center gap-1.5"><ClockCircleOutlined className="text-violet-400" /> {estimateReadTime(featuredArticle.content)}</span>
                    </Flex>
                  </Flex>
                  <Button 
                    type="link" 
                    className="text-violet-400 hover:text-violet-300 !font-bold flex items-center gap-2 p-0 w-max mt-6 hover:translate-x-1 transition-transform"
                  >
                    Đọc bài viết ngay <ArrowRightOutlined />
                  </Button>
                </Col>
              </Row>
            </div>
          )}

          {/* Regular Articles Grid */}
          {regularArticles.length > 0 && (
            <Row gutter={[32, 40]}>
              {regularArticles.map((article) => (
                <Col xs={24} md={12} lg={8} key={article.id}>
                  <Card 
                    hoverable
                    onClick={() => navigate(`news-detail`, article.id)}
                    cover={
                      <div className="relative overflow-hidden h-52 rounded-t-3xl">
                        <img 
                          src={article.image_url} 
                          alt={article.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    }
                    className="group border-slate-200/60 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-slate-100 transition-all duration-300 h-full flex flex-col"
                    styles={{ body: { padding: '24px', display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' } }}
                  >
                    <Flex vertical gap={12} className="flex-grow">
                      <Flex gap={12} className="text-slate-400 text-[11px] font-medium" wrap="wrap">
                        <span className="flex items-center gap-1"><UserOutlined /> {article.author}</span>
                        <span className="flex items-center gap-1"><ClockCircleOutlined /> {estimateReadTime(article.content)}</span>
                      </Flex>
                      <Typography.Title level={4} className="!font-bold !text-slate-800 !m-0 group-hover:text-violet-600 transition-colors line-clamp-2 !leading-snug !text-lg">
                        {article.title}
                      </Typography.Title>
                      <Typography.Paragraph className="!text-slate-500 !text-xs !m-0 line-clamp-3 !leading-relaxed">
                        {article.summary}
                      </Typography.Paragraph>
                    </Flex>
                    <Flex justify="space-between" align="center" className="border-t border-slate-100 pt-4 mt-4">
                      <span className="text-[11px] text-slate-400 flex items-center gap-1"><CalendarOutlined /> {formatDate(article.created_at)}</span>
                      <span className="text-xs font-bold text-violet-600 group-hover:text-violet-700 flex items-center gap-1 group-hover:gap-2 transition-all">
                        Đọc thêm <ArrowRightOutlined className="text-[10px]" />
                      </span>
                    </Flex>
                  </Card>
                </Col>
              ))}
            </Row>
          )}

        </Flex>
      )}

    </Flex>
  );
}
