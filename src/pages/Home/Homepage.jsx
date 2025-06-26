import React, { useEffect, useState } from 'react';
import { Button, Card, Row, Col, Typography, Carousel, Spin, Image } from 'antd';
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
      
      {/* Banner Carousel - Fixed size */}
      <div className="banner-carousel-container">
        <Carousel 
          autoplay={{ dotDuration: true }} 
          autoplaySpeed={3000}
          className="banner-carousel"
        >
          <div className="banner-slide">
            <Image 
              src='/assets/home-banner-1.png' 
              alt="Banner 1"
              preview={false}
              className="banner-image"
            />
          </div>
          <div className="banner-slide">
            <Image 
              src='/assets/home-banner-2.png' 
              alt="Banner 2"
              preview={false}
              className="banner-image"
            />
          </div>
          <div className="banner-slide">
            <Image 
              src='/assets/home-banner-3.png' 
              alt="Banner 3"
              preview={false}
              className="banner-image"
            />
          </div>
        </Carousel>
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
                  <Image
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
                        position: 'relative',
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
                    marginTop: 15,
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
        
      </section>

      {/* --- Section: Giới thiệu về S-Sneaker --- */}
      <section className="brand-intro-section">
        <div className="brand-intro-container">
          <Row gutter={[32, 32]} align="middle">
            <Col xs={24} md={24}>
              <div className="brand-intro-content">
                <Title level={2} className="brand-intro-title">
                  Về S-Sneaker
                </Title>
                <Paragraph className="brand-intro-description">
                  S-Sneaker là thương hiệu giày thể thao hàng đầu Việt Nam, chuyên cung cấp những đôi sneakers chất lượng cao với thiết kế thời trang và hiện đại.
                </Paragraph>
                <div className="brand-commitments">
                  <div className="commitment-item">
                    <strong>Sứ mệnh:</strong> Mang đến cho khách hàng những đôi giày không chỉ đẹp mà còn thoải mái, phù hợp với mọi hoạt động.
                  </div>
                  <div className="commitment-item">
                    <strong>Cam kết:</strong> Chất lượng cao, giá cả hợp lý, dịch vụ chăm sóc khách hàng tận tâm.
                  </div>
                  <div className="commitment-item">
                    <strong>Tầm nhìn:</strong> Trở thành thương hiệu sneakers được yêu thích nhất tại Việt Nam.
                  </div>
                </div>
                <Button
                  size="large"
                  className="brand-cta-button"
                  onClick={() => navigate('/about')}
                >
                  Tìm hiểu thêm về chúng tôi
                </Button>
              </div>
            </Col>
          </Row>
        </div>
      </section>

      {/* --- Section: Blog/Cẩm nang Sneaker --- */}
      <section className="blog-section">
        <div className="blog-container">
          <div className="blog-header">
            <Title level={2} className="blog-title">
              Cẩm nang Sneaker – Kiến thức cần biết khi lựa chọn và sử dụng giày
            </Title>
            <Paragraph className="blog-subtitle">
              Không chỉ bán giày, S-Sneaker còn là nơi chia sẻ những kiến thức hữu ích giúp bạn hiểu rõ hơn về giày sneaker, từ cách chọn mua giày rep 1:1 đến xu hướng sneaker mới nhất và các mẹo bảo quản giày đúng cách.
            </Paragraph>
          </div>
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={12} md={6}>
              <Card className="blog-card" hoverable onClick={() => navigate('/blog/phan-biet-giay-rep-fake-chinh-hang')}>
                <div className="blog-card-content">
                  <div className="blog-category">Kiến thức</div>
                  <Title level={4} className="blog-card-title">
                    Phân biệt giày rep 1:1, fake và chính hãng
                  </Title>
                  <Paragraph className="blog-card-excerpt">
                    Giải thích rõ khái niệm và cách nhận biết các loại giày trên thị trường. S-Sneaker chỉ cung cấp giày rep 1:1 chất lượng cao, gần như không thể phân biệt với hàng chính hãng bằng mắt thường.
                  </Paragraph>
                  <div className="blog-card-meta">
                    <span className="blog-date">20/12/2024</span>
                    <Button type="link" className="blog-read-more">Đọc thêm</Button>
                  </div>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card className="blog-card" hoverable onClick={() => navigate('/blog/cach-ve-sinh-bao-quan-giay')}>
                <div className="blog-card-content">
                  <div className="blog-category">Hướng dẫn</div>
                  <Title level={4} className="blog-card-title">
                    Cách vệ sinh và bảo quản giày sneaker đúng cách
                  </Title>
                  <Paragraph className="blog-card-excerpt">
                    Hướng dẫn chi tiết cách làm sạch giày sneaker với dụng cụ đơn giản tại nhà, giúp giữ form và màu sắc bền lâu.
                  </Paragraph>
                  <div className="blog-card-meta">
                    <span className="blog-date">18/12/2024</span>
                    <Button type="link" className="blog-read-more">Đọc thêm</Button>
                  </div>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card className="blog-card" hoverable onClick={() => navigate('/blog/xu-huong-sneaker-gen-z-2025')}>
                <div className="blog-card-content">
                  <div className="blog-category">Xu hướng</div>
                  <Title level={4} className="blog-card-title">
                    Xu hướng sneaker Gen Z năm 2025
                  </Title>
                  <Paragraph className="blog-card-excerpt">
                    Tổng hợp những phong cách sneaker đang được yêu thích: chunky sneaker, phối màu pastel, sneaker trắng đơn sắc...
                  </Paragraph>
                  <div className="blog-card-meta">
                    <span className="blog-date">15/12/2024</span>
                    <Button type="link" className="blog-read-more">Đọc thêm</Button>
                  </div>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card className="blog-card" hoverable onClick={() => navigate('/blog/tips-phoi-do-voi-sneaker')}>
                <div className="blog-card-content">
                  <div className="blog-category">Phối đồ</div>
                  <Title level={4} className="blog-card-title">
                    Tips phối đồ với sneaker cho nam và nữ
                  </Title>
                  <Paragraph className="blog-card-excerpt">
                    Gợi ý phối sneaker với nhiều phong cách khác nhau: đi học, đi chơi, đi làm, giúp bạn luôn nổi bật và tự tin.
                  </Paragraph>
                  <div className="blog-card-meta">
                    <span className="blog-date">12/12/2024</span>
                    <Button type="link" className="blog-read-more">Đọc thêm</Button>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
          <div className="blog-cta">
            <Button 
              type="default" 
              size="large" 
              className="view-all-blog-button"
              onClick={() => navigate('/blog')}
            >
              Xem tất cả bài viết
            </Button>
          </div>
        </div>
      </section>

      {/* --- Section: Ưu đãi & Khuyến mãi --- */}
      <section className="promotion-section">
        <div className="promotion-container">
          <div className="promotion-header">
            <Title level={2} className="promotion-title">
              Ưu đãi & Khuyến mãi đặc biệt
            </Title>
            <Paragraph className="promotion-subtitle">
              Đừng bỏ lỡ những chương trình khuyến mãi hấp dẫn từ S-Sneaker
            </Paragraph>
          </div>
          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <div className="promotion-card main-promo">
                <div className="promotion-badge">HOT</div>
                <div className="promotion-content">
                  <Title level={3} className="promotion-card-title">
                    Giảm 30% toàn bộ sản phẩm
                  </Title>
                  <Paragraph className="promotion-description">
                    Áp dụng cho tất cả sneakers trong store. Thời gian có hạn, nhanh tay sở hữu!
                  </Paragraph>
                  <div className="promotion-code">
                    Mã: <span className="code-text">SNEAKER30</span>
                  </div>
                  <Button type="primary" size="large" className="promotion-button" onClick={() => navigate('/product', { state: { type: 'all' } })}>
                    Mua ngay
                  </Button>
                </div>
              </div>
            </Col>
            <Col xs={24} md={12}>
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <div className="promotion-card small-promo">
                    <div className="promotion-content">
                      <Title level={4} className="promotion-card-title">
                        Freeship toàn quốc
                      </Title>
                      <Paragraph className="promotion-description">
                        Đơn hàng từ 1,000,000₫
                      </Paragraph>
                      <div className="promotion-code">
                        Mã: <span className="code-text">FREESHIP</span>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col span={24}>
                  <div className="promotion-card small-promo">
                    <div className="promotion-content">
                      <Title level={4} className="promotion-card-title">
                        Tặng voucher 200K
                      </Title>
                      <Paragraph className="promotion-description">
                        Cho khách hàng mới đăng ký
                      </Paragraph>
                      <div className="promotion-code">
                        Mã: <span className="code-text">WELCOME200</span>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </section>
    </div>
  );
};

export default Homepage;