import React from 'react';
import { Button, Card, Row, Col, Typography } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import './Homepage.css';

const { Title, Paragraph } = Typography;

// Lấy shoesData từ localStorage thay vì import file js
const shoesData = JSON.parse(localStorage.getItem('shoesData') || '[]');
// Lấy 4 sản phẩm mới nhất có isArrivals = true từ shoesData
const newArrivals = shoesData.filter(item => item.isArrivals).slice(0, 4);

const Homepage = () => {
  return (
    <div style={{ background: '#fff', padding: '0 0 60px 0', minHeight: '100vh' }}>
      <div style={{
        width: "100%",
        background: "rgb(0, 0, 0)",
        color: "#fff",
        textAlign: "center",
        padding: "8px 0",
        fontWeight: 500,
        letterSpacing: 1
      }}>
         Free nationwide shipping for orders from 1,000,000₫! 
      </div>
      {/* Hero Section */}
      <Row
        gutter={32}
        align="middle"
        style={{
          padding: '48px 0 24px 0',
          background: 'linear-gradient(90deg, #f8fafc 60%, #e3e3e3 100%)',
        }}
      >
        
        <Col xs={24} md={12}>
          <div className="hero-info" style={{ paddingLeft: 60 }}>
            <Title style={{ fontSize: 44, fontWeight: 800, marginBottom: 0, color: '#111' }}>
              The shoes you choose,<br />your personality shines!
            </Title>
            <Paragraph style={{ color: '#888', margin: '24px 0 0 0', fontSize: 18 }}>
              Own stylish sneakers, express your uniqueness. Define your streetwear style today!
            </Paragraph>
            <ul style={{ color: "#444", fontSize: 16, margin: "24px 0 0 0", paddingLeft: 20 }}>
              <li>Premium materials, durable over time</li>
              <li>Trendy design, fits every style</li>
              <li>Easy 7-day return policy</li>
            </ul>
            <Button
              type="primary"
              size="large"
              style={{
                marginTop: 32,
                background: '#111',
                borderColor: '#111',
                fontWeight: 600,
                fontSize: 18,
                borderRadius: 8,
              }}
              href="#collection"
            >
              View Collection <ArrowRightOutlined />
            </Button>
          </div>
        </Col>
        <Col xs={24} md={12} style={{ textAlign: 'center' }}>
          <img
            src="https://i.imgur.com/6RLwKQF.png"
            alt="S-Sneaker Hero"
            style={{ maxWidth: '80%', borderRadius: 24, boxShadow: '0 8px 32px #eee' }}
          />
          <div style={{ marginTop: 16, color: "#888", fontSize: 15 }}>
            Sample image: Addison Beluga - Best Seller 2025
          </div>
        </Col>
      </Row>

      {/* Brand Intro */}
      <section style={{ padding: '48px 0 24px 0', textAlign: 'center' }}>
        <Title level={2} style={{ fontWeight: 700, marginBottom: 12, color: '#1a237e' }}>
          We are S-Sneaker
        </Title>
        <Paragraph style={{ fontSize: 18, color: '#444', maxWidth: 600, margin: '0 auto' }}>
          We create a space for you to choose shoes not by the mold, but by your personality.
          Streetwear is your vibe? We get it.
        </Paragraph>
        <Paragraph style={{ fontSize: 16, color: '#888', maxWidth: 600, margin: '12px auto 0 auto' }}>
          S-Sneaker is a young, dynamic sneaker brand, always updating the latest trends. We are committed to bringing you a great shopping experience, dedicated service, and quality products.
        </Paragraph>
      </section>

      {/* Best Sellers / Featured Collection */}
      <section id="collection" style={{ margin: '0 auto', maxWidth: 1200 }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
          padding: '0 16px'
        }}>
          <Title level={3} style={{ fontWeight: 700, margin: 0 }}>
            All the new arrivals
          </Title>
          <Button type="link" style={{ fontWeight: 500, color: '#1a237e' }}>
            View all new arrivals <ArrowRightOutlined />
          </Button>
        </div>
        <Row gutter={24}>
          {newArrivals.map((item) => (
            <Col xs={24} sm={12} md={6} key={item.productId}>
              <Card
                hoverable
                onClick={() => window.location.href = `/detail/${item.productId}`}
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
      </section>

      {/* --- New Section: Slogan and Features --- */}
      <section style={{ margin: '64px auto 0 auto', maxWidth: 1000, textAlign: 'center' }}>
        <Title level={2} style={{ fontWeight: 800, marginBottom: 0, color: '#111' }}>
          Good sneakers<br />take you good places
        </Title>
        <div style={{ color: "#888", fontSize: 18, margin: "16px 0 40px 0" }}>
          look no further; this is where you find the best pair!
        </div>
        <Row gutter={48} justify="center">
          <Col xs={24} md={8} style={{ marginBottom: 24 }}>
            <img
              src="/assets/Group.png"
              alt="Curated"
              style={{ width: 80, height: 80, marginBottom: 16 }}
            />
            <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>
              Curated & unique collection
            </div>
          </Col>
          <Col xs={24} md={8} style={{ marginBottom: 24 }}>
            <img
              src="/assets/Group (1).png"
              alt="Trendy"
              style={{ width: 80, height: 80, marginBottom: 16 }}
            />
            <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>
              Buy the latest & define the trends
            </div>
          </Col>
        </Row>
      </section>
    </div>
  );
};

export default Homepage;