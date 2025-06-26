import React from 'react';
import { Typography, Button, Row, Col, Card, Space, Image } from 'antd';
import { ArrowRightOutlined, CheckCircleOutlined, StarOutlined, HeartOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './AboutUs.css';

const { Title, Paragraph, Text } = Typography;

const AboutUs = () => {
  const navigate = useNavigate();

  const missionItems = [
    {
      icon: <StarOutlined style={{ fontSize: 32, color: '#000' }} />,
      title: "Mang đến cho khách hàng những đôi sneaker vừa chất, vừa dễ tiếp cận",
      description: "Chất lượng cao với mức giá phù hợp cho mọi đối tượng"
    },
    {
      icon: <HeartOutlined style={{ fontSize: 32, color: '#000' }} />,
      title: "Giúp bạn thể hiện cá tính qua những đôi giày thật phong cách",
      description: "Mỗi đôi giày là một câu chuyện, một phong cách riêng"
    },
    {
      icon: <CheckCircleOutlined style={{ fontSize: 32, color: '#000' }} />,
      title: "Nơi bạn \"mặc chất\" mà không lo lắng về giá cả",
      description: "Sneaker chất lượng với giá cả hợp lý từ 400.000 VNĐ"
    }
  ];

  const qualityFeatures = [
    "Form chuẩn như hàng real",
    "Chất liệu bền bỉ", 
    "Đường may và logo tinh xảo",
    "Mức giá hợp lý chỉ từ 400.000 VNĐ"
  ];

  return (
    <div className="abu-about-us-page">
      {/* Hero Section */}
      <section className="abu-hero-section">
        <div className="abu-hero-content">
          <div className="abu-hero-text">
            <Title level={1} className="abu-hero-title">
              S-SNEAKER
            </Title>
            <div className="abu-hero-subtitle">
              QUALITY - AFFORDABLE - DIVERSE
            </div>
            <Paragraph className="abu-hero-slogan">
              "Đôi giày bạn chọn, cá tính bạn thể hiện!"
            </Paragraph>
          </div>
          <div className="abu-sneaker-silhouette">
            <Image src='/assets/S-Sneaker-logo-white.png' />
          </div>
        </div>
      </section>

      {/* Opening Statement */}
      <section className="abu-opening-section">
        <div className="abu-container">
          <div className="abu-opening-text">
            <Title level={2} className="abu-section-title">
              Về chúng tôi
            </Title>
            <Paragraph className="abu-opening-paragraph">
              Tụi mình là một nhóm những người trẻ sống theo phong cách streetwear, 
              đam mê sneaker và yêu tự do thể hiện bản thân.
            </Paragraph>
            <Paragraph className="abu-opening-paragraph">
              <Text strong>S-Sneaker</Text> ra đời không chỉ để bán giày – tụi mình tạo ra 
              không gian để bạn chọn được đôi giày <Text className="abu-highlight">"gọi tên chính mình"</Text>.
            </Paragraph>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="abu-mission-section">
        <div className="abu-container">
          <Title level={2} className="abu-section-title abu-text-center">
            Sứ mệnh – Mission
          </Title>
          <Row gutter={[32, 32]}>
            {missionItems.map((item, index) => (
              <Col xs={24} md={8} key={index}>
                <Card className="abu-mission-card" hoverable>
                  <div className="abu-mission-icon">
                    {item.icon}
                  </div>
                  <Title level={4} className="abu-mission-title">
                    {item.title}
                  </Title>
                  <Paragraph className="abu-mission-description">
                    {item.description}
                  </Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Business Model Section */}
      <section className="abu-business-model-section">
        <div className="abu-container">
          <div className="abu-business-text">
            <Title level={2} className="abu-section-title">
              Chúng tôi bán khác biệt – và sẽ phát triển đúng cách
            </Title>
            <Paragraph className="abu-business-paragraph">
              Hiện tại, <Text strong>S-Sneaker</Text> hoạt động theo mô hình 
              <Text className="abu-highlight"> "bán hàng theo đơn đặt"</Text> – mỗi đơn hàng chỉ được xử lý khi có khách đặt.
            </Paragraph>
            <Paragraph className="abu-business-paragraph">
              Tụi mình không muốn chạy theo số lượng, mà tập trung vào chất lượng trải nghiệm 
              – từ khi bạn click "đặt hàng" đến khi mở hộp.
            </Paragraph>
            <div className="abu-future-plan">
              <Text strong className="abu-future-text">
                Từ năm 2026, S-Sneaker sẽ mở rộng với cửa hàng trải nghiệm thực tế
              </Text>
              <Paragraph style={{ marginTop: 8 }}>
                – nơi bạn có thể đến thử giày, cảm nhận chất lượng tận tay, và chọn ra đôi phù hợp với bạn nhất.
                Một không gian không chỉ để mua giày – mà còn để bạn sống trọn vibe streetwear theo cách riêng.
              </Paragraph>
            </div>
          </div>
        </div>
      </section>

      {/* Quality Section */}
      <section className="abu-quality-section">
        <div className="abu-container">
          <div className="abu-quality-text">
            <Title level={2} className="abu-section-title">
              Chất lượng là ưu tiên hàng đầu
            </Title>
            <Paragraph className="abu-quality-paragraph">
              Mỗi đôi giày tại <Text strong>S-Sneaker</Text> đều được lựa chọn kỹ lưỡng 
              từ các xưởng replica uy tín, đảm bảo:
            </Paragraph>
            <div className="abu-quality-features">
              {qualityFeatures.map((feature, index) => (
                <div key={index} className="abu-quality-feature">
                  <CheckCircleOutlined style={{ color: '#000', marginRight: 8 }} />
                  <Text>{feature}</Text>
                </div>
              ))}
            </div>
            <Paragraph className="abu-quality-conclusion">
              Chúng tôi không chỉ bán giày – chúng tôi chọn từng đôi để bạn tự tin mỗi bước đi, 
              dù là đi học, đi làm hay dạo phố.
            </Paragraph>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="abu-cta-section">
        <div className="abu-container">
          <div className="abu-cta-content">
            <Title level={2} className="abu-cta-title">
              Bạn không cần là fashionista để đi giày chất.
            </Title>
            <Paragraph className="abu-cta-subtitle">
              Chỉ cần chọn đúng đôi – phần còn lại, để tụi mình lo!
            </Paragraph>
            <Space size="large">
              <Button
                type="primary"
                size="large"
                className="abu-cta-button"
                onClick={() => navigate('/product', { state: { type: 'all' } })}
              >
                Xem bộ sưu tập <ArrowRightOutlined />
              </Button>
              <Button
                size="large"
                className="abu-cta-secondary-button"
                onClick={() => navigate('/')}
              >
                Về trang chủ
              </Button>
            </Space>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;