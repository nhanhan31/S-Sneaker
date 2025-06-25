import React, { useEffect, useState } from 'react';
import { Button, Card, Row, Col, Typography, Carousel, Spin } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import './Homepage.css';
import { fetchAllProducts } from '../../utils/productApi';

const { Title, Paragraph } = Typography;

const Homepage = () => {
  const navigate = useNavigate();
  const [shoesData, setShoesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchAllProducts().then(data => {
      setShoesData(Array.isArray(data) ? data : []);
      setLoading(false);
    });
  }, []);

  // Lấy 4 sản phẩm mới nhất có isArrivals = true từ shoesData
  const newArrivals = shoesData.filter(item => item.isArrivals).slice(0, 4);

  return (
    <div className="homepage-wrapper">
      <div className="top-banner">
         Miễn phí vận chuyển toàn quốc cho đơn hàng từ 1,000,000₫! 
      </div>
      {/* Hero Section */}
      <Row
        gutter={32}
        align="middle"
        className="hero-section"
        style={{margin: 0}}
      >
        
        <Col xs={24} md={12} className="hero-text-col">
          <div className="hero-info">
            <Title className="hero-title">
              Đôi giày bạn chọn,<br />cá tính bạn tỏa sáng!
            </Title>
            <Paragraph className="hero-description">
              Sở hữu những đôi sneakers thời trang, thể hiện sự độc đáo của bạn. Xác định phong cách streetwear ngay hôm nay!
            </Paragraph>
            <ul className="hero-features">
              <li>Chất liệu cao cấp, bền bỉ theo thời gian</li>
              <li>Thiết kế thời trang, phù hợp mọi phong cách</li>
              <li>Chính sách đổi trả dễ dàng trong 7 ngày</li>
            </ul>
            <Button
              type="primary"
              size="large"
              className="hero-cta-button"
              href="#collection"
            >
              Xem bộ sưu tập <ArrowRightOutlined />
            </Button>
          </div>
        </Col>
        <Col xs={24} md={12} className="hero-carousel-col">
          <Spin spinning={loading}>
            <Carousel
              autoplay={{ dotDuration: true }} 
              autoplaySpeed={3000}
              dotPosition='top'
              className="hero-carousel"
            >
              {newArrivals.map((item) => (
                <div key={item.productId} className="carousel-slide">
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    className="carousel-image"
                  />
                  <div className="carousel-title">
                    {item.productName}
                  </div>
                </div>
              ))}
            </Carousel>
          </Spin>
        </Col>
      </Row>

      {/* Brand Intro */}
      <section className="brand-intro">
        <Title level={2} className="brand-title">
          Chúng tôi là S-Sneaker
        </Title>
        <Paragraph className="brand-description">
          Chúng tôi tạo ra không gian để bạn lựa chọn giày không phải theo khuôn mẫu, mà theo cá tính của bạn.
          Streetwear là phong cách của bạn? Chúng tôi hiểu điều đó.
        </Paragraph>
        <Paragraph className="brand-subdescription">
          S-Sneaker là thương hiệu sneakers trẻ trung, năng động, luôn cập nhật xu hướng mới nhất. Chúng tôi cam kết mang đến cho bạn trải nghiệm mua sắm tuyệt vời, dịch vụ tận tâm và sản phẩm chất lượng.
        </Paragraph>
      </section>

      {/* Best Sellers / Featured Collection */}
      <section id="collection" className="featured-collection">
        <div className="collection-header">
          <Title level={3} className="collection-title">
            Tất cả sản phẩm mới
          </Title>
          <Button
            type="link"
            className="view-all-button"
            onClick={() => navigate('/product', { state: { type: 'newarrival' } })}
          >
            Xem tất cả sản phẩm mới <ArrowRightOutlined />
          </Button>
        </div>
        <Spin spinning={loading}>
          <Row gutter={24}>
            {newArrivals.map((item) => (
              <Col xs={24} sm={12} md={6} key={item.productId}>
                <Card
                  hoverable
                  onClick={() => navigate(`/detail/${item.productId}`)}
                  cover={
                    <div
                      style={{
                        width: '100%',
                        aspectRatio: '1/1',
                        background: '#fafbfc',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 12,
                        overflow: 'hidden',
                        position: 'relative'
                      }}
                      className="custom-card-cover"
                    >
                      <img
                        alt={item.productName}
                        src={item.productImage}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.3s',
                        }}
                        className="custom-card-img"
                      />
                    </div>
                  }
                  style={{
                    borderRadius: 12,
                    boxShadow: '0 2px 16px #f3f3f3',
                    border: '1px solid #ffffff',
                    transition: 'box-shadow 0.3s, transform 0.3s',
                    cursor: 'pointer'
                  }}
                  bodyStyle={{ textAlign: 'center', minHeight: 80 }}
                  className="custom-card"
                >
                  <div style={{ fontWeight: 600 }}>{item.productName}</div>
                  <div style={{ color: '#888', marginTop: 4 }}>
                    {Number(item.price).toLocaleString('vi-VN')} ₫
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </Spin>
      </section>

      {/* --- New Section: Slogan and Features --- */}
      <section className="slogan-features">
        <Title level={2} className="slogan-title">
          Đôi giày tốt<br />đưa bạn đến những nơi tốt đẹp
        </Title>
        <div className="slogan-subtitle">
          đừng tìm đâu xa nữa; đây chính là nơi bạn tìm thấy đôi giày hoàn hảo!
        </div>
        <Row gutter={[48, 24]} justify="space-between" className="features-row" style={{ margin: 0 }}>
          <Col xs={24} sm={12} md={8} className="feature-col">
            <img
              src="/assets/Group.png"
              alt="Curated"
              className="feature-icon"
            />
            <div className="feature-title">
              Bộ sưu tập được tuyển chọn & độc đáo
            </div>
          </Col>
          <Col xs={24} sm={12} md={8} className="feature-col">
            <img
              src="/assets/Group (1).png"
              alt="Trendy"
              className="feature-icon"
            />
            <div className="feature-title">
              Mua những sản phẩm mới nhất & định hình xu hướng
            </div>
          </Col>
        </Row>
      </section>
    </div>
  );
};

export default Homepage;