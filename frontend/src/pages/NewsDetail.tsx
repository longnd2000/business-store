import React, { useState, useEffect } from 'react';
import { News as NewsType } from '../types';
import { httpGet } from '../services/api';
import { Skeleton, Result, Button, Row, Col, Typography, Divider, Flex, Card } from 'antd';
import { ArrowLeftOutlined, CalendarOutlined, UserOutlined, ClockCircleOutlined } from '@ant-design/icons';

interface NewsDetailProps {
  articleId: number | null;
  navigate: (page: string, productId?: number | null) => void;
}

export default function NewsDetail({ articleId, navigate }: NewsDetailProps) {
  const [article, setArticle] = useState<NewsType | null>(null);
  const [otherArticles, setOtherArticles] = useState<NewsType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticleDetails = async () => {
      try {
        setLoading(true);
        const data = await httpGet(`/news/${articleId}`);
        setArticle(data);
        setError(null);

        // Fetch other articles for suggestions
        try {
          const list: NewsType[] = await httpGet('/news');
          setOtherArticles(list.filter(item => item.id !== data.id).slice(0, 3));
        } catch (e) {
          console.error(e);
        }
      } catch (err) {
        console.error(err);
        setError("Không thể tải thông tin bài viết.");
      } finally {
        setLoading(false);
      }
    };

    if (articleId) {
      fetchArticleDetails();
    }
  }, [articleId]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const estimateReadTime = (htmlContent: string) => {
    const text = htmlContent.replace(/<[^>]*>/g, '');
    const wordCount = text.split(/\s+/).filter(Boolean).length;
    const time = Math.max(1, Math.ceil(wordCount / 150));
    return `${time} phút đọc`;
  };

  if (loading) {
    return (
      <Flex vertical className="max-w-4xl mx-auto px-4 py-16 w-full text-left">
        <Skeleton.Button active size="small" className="w-32 mb-8" />
        <Skeleton active paragraph={{ rows: 12 }} />
      </Flex>
    );
  }

  if (error || !article) {
    return (
      <Flex justify="center" align="center" className="max-w-4xl mx-auto py-20 px-4 w-full">
        <Result
          status="error"
          title="Không thể tải bài viết"
          subTitle={error || "Bài viết không khả dụng."}
          extra={[
            <Button key="back" type="primary" onClick={() => navigate('news')}>
              Quay lại tin tức
            </Button>
          ]}
        />
      </Flex>
    );
  }

  return (
    <Flex vertical gap={32} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full text-left">
      
      {/* Back button */}
      <Flex className="w-full">
        <Button
          type="link"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('news')}
          className="px-0 text-slate-600 hover:text-violet-650 font-semibold"
        >
          Quay lại danh sách tin tức
        </Button>
      </Flex>

      {/* Article Header */}
      <Flex vertical gap={16} className="w-full">
        <Typography.Title level={1} className="!text-3xl md:!text-4xl !font-extrabold !text-slate-900 !m-0 !leading-tight tracking-tight">
          {article.title}
        </Typography.Title>
        
        <Flex gap={20} className="text-slate-500 text-xs font-semibold" wrap="wrap">
          <span className="flex items-center gap-1.5"><UserOutlined className="text-violet-500" /> {article.author}</span>
          <span className="flex items-center gap-1.5"><CalendarOutlined className="text-violet-500" /> {formatDate(article.created_at)}</span>
          <span className="flex items-center gap-1.5"><ClockCircleOutlined className="text-violet-500" /> {estimateReadTime(article.content)}</span>
        </Flex>

        {article.summary && (
          <Typography.Paragraph className="!text-slate-500 !text-base md:!text-lg !leading-relaxed border-l-4 border-violet-500 pl-4 py-1 italic bg-slate-50 rounded-r-xl my-4">
            {article.summary}
          </Typography.Paragraph>
        )}
      </Flex>

      {/* Cover Image */}
      {article.image_url && (
        <div className="w-full h-64 md:h-[450px] overflow-hidden rounded-3xl border border-slate-100 shadow-sm">
          <img 
            src={article.image_url} 
            alt={article.title} 
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Article Content */}
      <div 
        className="article-content text-slate-600 text-base md:text-lg leading-relaxed antialiased mt-4 w-full"
        dangerouslySetInnerHTML={{ __html: article.content }}
        style={{
          // Set specific styled rules for raw seeded html
        }}
      />
      
      <style>{`
        .article-content h3 {
          font-size: 1.5rem;
          font-weight: 800;
          margin-top: 2rem;
          margin-bottom: 0.8rem;
          color: #0f172a;
          letter-spacing: -0.02em;
        }
        .article-content h4 {
          font-size: 1.25rem;
          font-weight: 700;
          margin-top: 1.5rem;
          margin-bottom: 0.6rem;
          color: #1e293b;
        }
        .article-content p {
          margin-bottom: 1.2rem;
          color: #334155;
          line-height: 1.8;
        }
        .article-content ul, .article-content ol {
          list-style-type: disc;
          padding-left: 1.8rem;
          margin-bottom: 1.2rem;
        }
        .article-content li {
          margin-bottom: 0.5rem;
          color: #334155;
        }
        .article-content strong {
          color: #0f172a;
          font-weight: 700;
        }
        .article-content blockquote {
          border-left: 4px solid #7c3aed;
          padding-left: 1.2rem;
          font-style: italic;
          margin: 1.5rem 0;
          color: #475569;
        }
      `}</style>

      <Divider className="my-8" />

      {/* Suggested Other Articles */}
      {otherArticles.length > 0 && (
        <Flex vertical gap={24} className="w-full mt-4">
          <Typography.Title level={3} className="!text-slate-800 !font-extrabold !text-xl md:!text-2xl !m-0">
            Bài Viết Khác
          </Typography.Title>
          <Row gutter={[24, 24]}>
            {otherArticles.map((item) => (
              <Col xs={24} md={8} key={item.id}>
                <Card
                  hoverable
                  onClick={() => navigate('news-detail', item.id)}
                  cover={
                    <div className="relative overflow-hidden h-40 rounded-t-2xl">
                      <img 
                        src={item.image_url} 
                        alt={item.title} 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  }
                  className="group rounded-2xl overflow-hidden shadow-sm h-full flex flex-col border-slate-200/60"
                  styles={{ body: { padding: '16px', display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' } }}
                >
                  <Flex vertical gap={8} className="flex-grow">
                    <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1"><CalendarOutlined /> {formatDate(item.created_at)}</span>
                    <Typography.Title level={5} className="!font-bold !text-slate-800 !m-0 group-hover:text-violet-650 transition-colors line-clamp-2 !leading-snug !text-sm">
                      {item.title}
                    </Typography.Title>
                  </Flex>
                </Card>
              </Col>
            ))}
          </Row>
        </Flex>
      )}

    </Flex>
  );
}
