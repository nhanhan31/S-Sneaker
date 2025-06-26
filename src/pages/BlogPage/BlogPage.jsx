import React, { useState } from 'react';
import { Row, Col, Card, Typography, Button, Input, Select, Tag } from 'antd';
import { SearchOutlined, CalendarOutlined, UserOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import './BlogPage.css';
import BlogDetailPage from './BlogDetailPage';

const { Title, Paragraph } = Typography;
const { Option } = Select;

const BlogPage = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Nếu có slug, hiển thị trang chi tiết
  if (slug) {
    return <BlogDetailPage />;
  }

  // Mock data cho blog posts
  const blogPosts = [
    {
      id: 1,
      slug: 'phan-biet-giay-rep-fake-chinh-hang',
      title: 'Phân biệt giày rep 1:1, fake và chính hãng',
      excerpt: 'Giải thích rõ khái niệm và cách nhận biết các loại giày trên thị trường. S-Sneaker chỉ cung cấp giày rep 1:1 chất lượng cao, gần như không thể phân biệt với hàng chính hãng bằng mắt thường.',
      category: 'Kiến thức',
      categorySlug: 'kien-thuc',
      date: '20/12/2024',
      readTime: '8 phút đọc',
      views: 2430,
      author: 'S-Sneaker Team',
      image: '/assets/blog-1.jpg',
      featured: true
    },
    {
      id: 2,
      slug: 'cach-ve-sinh-bao-quan-giay',
      title: 'Cách vệ sinh và bảo quản giày sneaker đúng cách',
      excerpt: 'Hướng dẫn chi tiết cách làm sạch giày sneaker với dụng cụ đơn giản tại nhà, giúp giữ form và màu sắc bền lâu.',
      category: 'Hướng dẫn',
      categorySlug: 'huong-dan',
      date: '18/12/2024',
      readTime: '6 phút đọc',
      views: 1950,
      author: 'S-Sneaker Team',
      image: '/assets/blog-2.jpg',
      featured: true
    },
    {
      id: 3,
      slug: 'xu-huong-sneaker-gen-z-2025',
      title: 'Xu hướng sneaker Gen Z năm 2025',
      excerpt: 'Tổng hợp những phong cách sneaker đang được yêu thích: chunky sneaker, phối màu pastel, sneaker trắng đơn sắc...',
      category: 'Xu hướng',
      categorySlug: 'xu-huong',
      date: '15/12/2024',
      readTime: '5 phút đọc',
      views: 3200,
      author: 'S-Sneaker Team',
      image: '/assets/blog-3.jpg',
      featured: true
    },
    {
      id: 4,
      slug: 'tips-phoi-do-voi-sneaker',
      title: 'Tips phối đồ với sneaker cho nam và nữ',
      excerpt: 'Gợi ý phối sneaker với nhiều phong cách khác nhau: đi học, đi chơi, đi làm, giúp bạn luôn nổi bật và tự tin.',
      category: 'Phối đồ',
      categorySlug: 'phoi-do',
      date: '12/12/2024',
      readTime: '7 phút đọc',
      views: 1820,
      author: 'S-Sneaker Team',
      image: '/assets/blog-4.jpg',
      featured: true
    },
    {
      id: 5,
      slug: 'lich-su-phat-trien-giay-sneaker',
      title: 'Lịch sử phát triển của giày sneaker qua các thời kỳ',
      excerpt: 'Từ những đôi giày thể thao đơn giản đến biểu tượng thời trang, hành trình phát triển của sneaker thật thú vị.',
      category: 'Kiến thức',
      categorySlug: 'kien-thuc',
      date: '10/12/2024',
      readTime: '10 phút đọc',
      views: 1450,
      author: 'S-Sneaker Team',
      image: '/assets/blog-5.jpg',
      featured: false
    },
    {
      id: 6,
      slug: 'cach-chon-size-giay-chuan-xac',
      title: 'Cách chọn size giày chuẩn xác nhất',
      excerpt: 'Hướng dẫn đo size chân và chọn size giày phù hợp, tránh trường hợp mua phải giày không vừa chân.',
      category: 'Hướng dẫn',
      categorySlug: 'huong-dan',
      date: '08/12/2024',
      readTime: '4 phút đọc',
      views: 2100,
      author: 'S-Sneaker Team',
      image: '/assets/blog-6.jpg',
      featured: false
    }
  ];

  const categories = [
    { value: 'all', label: 'Tất cả' },
    { value: 'kien-thuc', label: 'Kiến thức' },
    { value: 'huong-dan', label: 'Hướng dẫn' },
    { value: 'xu-huong', label: 'Xu hướng' },
    { value: 'phoi-do', label: 'Phối đồ' }
  ];

  // Filter posts based on search and category
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.categorySlug === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPosts = filteredPosts.filter(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  return (
    <div className="blog-page-wrapper">
      {/* Hero Section */}
      <section className="blog-hero">
        <div className="blog-hero-container">
          <Title level={1} className="blog-hero-title">
            Cẩm nang Sneaker
          </Title>
          <Paragraph className="blog-hero-subtitle">
            Khám phá thế giới sneaker qua những bài viết chuyên sâu và hữu ích từ đội ngũ chuyên gia của S-Sneaker
          </Paragraph>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="blog-filter-section">
        <div className="blog-filter-container">
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} md={12}>
              <Input
                placeholder="Tìm kiếm bài viết..."
                prefix={<SearchOutlined />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="blog-search-input"
                size="large"
              />
            </Col>
            <Col xs={24} md={12}>
              <Select
                value={selectedCategory}
                onChange={setSelectedCategory}
                className="blog-category-select"
                size="large"
                style={{ width: '100%' }}
              >
                {categories.map(cat => (
                  <Option key={cat.value} value={cat.value}>
                    {cat.label}
                  </Option>
                ))}
              </Select>
            </Col>
          </Row>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="blog-featured-section">
          <div className="blog-content-container">
            <Title level={2} className="blog-section-title">
              Bài viết nổi bật
            </Title>
            <Row gutter={[24, 24]}>
              {featuredPosts.map((post) => (
                <Col xs={24} md={12} key={post.id}>
                  <Card
                    className="blog-featured-card"
                    hoverable
                    onClick={() => navigate(`/blog/${post.slug}`)}
                    cover={
                      <div className="blog-card-image-container">
                        <div 
                          className="blog-card-image"
                          style={{ 
                            background: `url(${post.image}) center center / cover no-repeat`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                          }}
                        />
                        <div className="blog-card-overlay">
                          <Tag color="blue" className="blog-card-category">
                            {post.category}
                          </Tag>
                        </div>
                      </div>
                    }
                  >
                    <div className="blog-card-content">
                      <Title level={3} className="blog-card-title">
                        {post.title}
                      </Title>
                      <Paragraph className="blog-card-excerpt">
                        {post.excerpt}
                      </Paragraph>
                      <div className="blog-card-meta">
                        <div className="blog-meta-left">
                          <span className="blog-meta-item">
                            <CalendarOutlined /> {post.date}
                          </span>
                          <span className="blog-meta-item">
                            <UserOutlined /> {post.author}
                          </span>
                        </div>
                        <div className="blog-meta-right">
                          <span className="blog-read-time">{post.readTime}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </section>
      )}

      {/* Regular Posts */}
      

      {/* Newsletter Signup */}
      
      
    </div>
  );
};

export default BlogPage;
