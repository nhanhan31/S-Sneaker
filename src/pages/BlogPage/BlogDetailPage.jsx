import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Button, Tag, Row, Col, Divider } from 'antd';
import { ArrowLeftOutlined, CalendarOutlined, UserOutlined, EyeOutlined, ClockCircleOutlined } from '@ant-design/icons';
import './BlogDetailPage.css';

const { Title, Paragraph } = Typography;

const BlogDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  // Mock data cho các bài viết
  const blogData = {
    'phan-biet-giay-rep-fake-chinh-hang': {
      title: 'Phân biệt giày rep 1:1, fake và chính hãng',
      content: `
        <h2>Khái niệm về giày rep 1:1, fake và chính hãng</h2>
        <p>Trong thế giới sneaker hiện nay, có ba loại giày chính mà người tiêu dùng cần biết để phân biệt:</p>
        
        <h3>1. Giày chính hãng (Authentic)</h3>
        <p>Giày chính hãng là những sản phẩm được sản xuất trực tiếp bởi thương hiệu hoặc nhà máy được ủy quyền chính thức. Đây là sản phẩm có chất lượng cao nhất, đi kèm với bảo hành và giấy tờ chứng nhận từ thương hiệu.</p>
        
        <h3>2. Giày Rep 1:1 (Replica 1:1)</h3>
        <p>Giày Rep 1:1 là những sản phẩm được sao chép với độ chính xác cao nhất, gần như không thể phân biệt với hàng chính hãng bằng mắt thường. Chúng được sản xuất với chất liệu và quy trình tương tự, mang lại trải nghiệm gần như tương đương với hàng chính hãng nhưng với giá thành hợp lý hơn.</p>
        
        <h3>3. Giày Fake</h3>
        <p>Giày fake là những sản phẩm nhái chất lượng thấp, thường có nhiều khiếm khuyết về thiết kế, chất liệu và độ hoàn thiện. Đây là loại sản phẩm không được khuyến khích sử dụng.</p>
        
        <h2>Cách nhận biết giày Rep 1:1 chất lượng cao</h2>
        
        <h3>Về chất liệu</h3>
        <ul>
          <li>Da thật, mềm mại và có độ bền cao</li>
          <li>Đế giày được làm từ cao su chất lượng tốt</li>
          <li>Các chi tiết may khâu tinh tế, đường chỉ đều</li>
        </ul>
        
        <h3>Về thiết kế</h3>
        <ul>
          <li>Logo và các chi tiết được in/thêu chính xác</li>
          <li>Màu sắc trung thực với bản gốc</li>
          <li>Kích thước và tỷ lệ chuẩn xác</li>
        </ul>
        
        <h2>Tại sao chọn S-Sneaker?</h2>
        <p>S-Sneaker cam kết chỉ cung cấp giày Rep 1:1 chất lượng cao nhất, được tuyển chọn kỹ lưỡng từ các nhà máy uy tín. Chúng tôi hiểu rằng không phải ai cũng có điều kiện mua hàng chính hãng với giá cao, vì vậy chúng tôi mang đến giải pháp tối ưu để bạn vẫn có thể sở hữu những đôi giày yêu thích với chất lượng tuyệt vời.</p>
        
        <h3>Cam kết của S-Sneaker:</h3>
        <ul>
          <li>Chỉ bán giày Rep 1:1 chất lượng cao</li>
          <li>Kiểm tra kỹ lưỡng trước khi giao hàng</li>
          <li>Chính sách đổi trả linh hoạt</li>
          <li>Hỗ trợ khách hàng 24/7</li>
        </ul>
      `,
      category: 'Kiến thức',
      date: '20/12/2024',
      readTime: '8 phút đọc',
      views: 2430,
      author: 'S-Sneaker Team'
    },
    'cach-ve-sinh-bao-quan-giay': {
      title: 'Cách vệ sinh và bảo quản giày sneaker đúng cách',
      content: `
        <h2>Tầm quan trọng của việc bảo quản giày</h2>
        <p>Việc vệ sinh và bảo quản giày sneaker đúng cách không chỉ giúp giữ cho đôi giày luôn như mới mà còn kéo dài tuổi thọ sử dụng, tiết kiệm chi phí thay thế.</p>
        
        <h2>Dụng cụ cần thiết</h2>
        <ul>
          <li>Bàn chải mềm hoặc bàn chải đánh răng cũ</li>
          <li>Khăn mềm, không xơ</li>
          <li>Nước ấm</li>
          <li>Xà phòng hoặc dung dịch vệ sinh chuyên dụng</li>
          <li>Giấy báo hoặc khăn giấy</li>
          <li>Cây giữ form giày (shoe tree)</li>
        </ul>
        
        <h2>Quy trình vệ sinh chi tiết</h2>
        
        <h3>Bước 1: Chuẩn bị</h3>
        <p>Tháo dây giày và lót giày ra khỏi đôi giày. Dũi bỏ bụi bẩn và đất cát bám trên bề mặt bằng bàn chải mềm.</p>
        
        <h3>Bước 2: Vệ sinh phần đế</h3>
        <p>Sử dụng bàn chải cứng và nước xà phòng để làm sạch phần đế giày. Đây là phần bẩn nhất và cần được vệ sinh kỹ lưỡng.</p>
        
        <h3>Bước 3: Vệ sinh thân giày</h3>
        <p>Tùy theo chất liệu của giày (da, vải, da lộn...) mà có cách vệ sinh khác nhau:</p>
        <ul>
          <li><strong>Giày da:</strong> Dùng khăn ẩm lau nhẹ, sau đó sử dụng kem dưỡng da</li>
          <li><strong>Giày vải:</strong> Có thể giặt máy ở chế độ nhẹ hoặc giặt tay</li>
          <li><strong>Giày da lộn:</strong> Sử dụng bàn chải chuyên dụng cho da lộn</li>
        </ul>
        
        <h3>Bước 4: Sấy khô</h3>
        <p>Để giày ở nơi thoáng mát, tránh ánh nắng trực tiếp. Nhồi giấy báo vào trong giày để giữ form và hút ẩm.</p>
        
        <h2>Mẹo bảo quản lâu dài</h2>
        <ul>
          <li>Luân phiên sử dụng nhiều đôi giày</li>
          <li>Sử dụng cây giữ form khi không đi</li>
          <li>Bảo quản trong hộp giày hoặc túi vải thoáng khí</li>
          <li>Tránh để giày ở nơi ẩm ướt</li>
          <li>Vệ sinh ngay khi giày bị bẩn</li>
        </ul>
        
        <h2>Sản phẩm bảo quản chuyên dụng</h2>
        <p>S-Sneaker cũng cung cấp các sản phẩm bảo quản giày chuyên nghiệp như spray chống thấm, kem dưỡng da, bàn chải chuyên dụng để giúp khách hàng chăm sóc giày tốt nhất.</p>
      `,
      category: 'Hướng dẫn',
      date: '18/12/2024',
      readTime: '6 phút đọc',
      views: 1950,
      author: 'S-Sneaker Team'
    },
    'xu-huong-sneaker-gen-z-2025': {
      title: 'Xu hướng sneaker Gen Z năm 2025',
      content: `
        <h2>Tổng quan xu hướng sneaker 2025</h2>
        <p>Năm 2025 đánh dấu sự bùng nổ của những xu hướng sneaker mới, được định hình bởi thế hệ Gen Z với tư duy sáng tạo và cá tính riêng biệt.</p>
        
        <h2>Những xu hướng nổi bật</h2>
        
        <h3>1. Chunky Sneakers - Xu hướng "to bự"</h3>
        <p>Giày sneaker có thiết kế chunky (to bự) tiếp tục là xu hướng hot. Những đôi giày với đế dày, form dáng bản to mang lại phong cách street style đậm chất Gen Z.</p>
        
        <h3>2. Màu sắc Pastel nhẹ nhàng</h3>
        <p>Thay vì những màu sắc neon chói mắt, Gen Z 2025 ưa chuộng những gam màu pastel nhẹ nhàng như:</p>
        <ul>
          <li>Hồng pastel</li>
          <li>Xanh mint</li>
          <li>Vàng butter</li>
          <li>Tím lavender</li>
        </ul>
        
        <h3>3. Sneaker trắng đơn sắc</h3>
        <p>Giày sneaker trắng tinh khôi vẫn là lựa chọn không bao giờ lỗi thời. Sự đơn giản nhưng tinh tế của màu trắng giúp bạn dễ dàng phối với mọi trang phục.</p>
        
        <h3>4. Sustainable Fashion - Thời trang bền vững</h3>
        <p>Gen Z ngày càng quan tâm đến môi trường, vì vậy những đôi giày được làm từ chất liệu tái chế, thân thiện với môi trường đang trở thành xu hướng mạnh.</p>
        
        <h2>Thương hiệu và mẫu giày hot</h2>
        
        <h3>Nike</h3>
        <ul>
          <li>Nike Air Force 1</li>
          <li>Nike Dunk Low</li>
          <li>Nike Air Max series</li>
        </ul>
        
        <h3>Adidas</h3>
        <ul>
          <li>Adidas Stan Smith</li>
          <li>Adidas Samba</li>
          <li>Adidas Gazelle</li>
        </ul>
        
        <h3>New Balance</h3>
        <ul>
          <li>New Balance 530</li>
          <li>New Balance 327</li>
          <li>New Balance 2002R</li>
        </ul>
        
        <h2>Cách phối đồ theo xu hướng</h2>
        
        <h3>Style Minimalist</h3>
        <p>Kết hợp sneaker trắng với quần jeans và áo thun basic tạo nên phong cách tối giản nhưng không kém phần thời trang.</p>
        
        <h3>Style Streetwear</h3>
        <p>Chunky sneakers + jogger pants + oversized hoodie = công thức hoàn hảo cho phong cách streetwear đúng chất Gen Z.</p>
        
        <h3>Style Retro</h3>
        <p>Những đôi giày vintage kết hợp với váy midi hoặc quần ống rộng tạo nên vẻ đẹp retro cực kỳ ấn tượng.</p>
        
        <h2>Dự đoán xu hướng tiếp theo</h2>
        <p>Theo các chuyên gia thời trang, xu hướng sneaker sẽ tiếp tục phát triển theo hướng:</p>
        <ul>
          <li>Tính năng công nghệ cao (smart sneakers)</li>
          <li>Customization - cá nhân hóa theo sở thích</li>
          <li>Collaboration giữa các thương hiệu</li>
          <li>Limited edition với số lượng giới hạn</li>
        </ul>
      `,
      category: 'Xu hướng',
      date: '15/12/2024',
      readTime: '5 phút đọc',
      views: 3200,
      author: 'S-Sneaker Team'
    },
    'tips-phoi-do-voi-sneaker': {
      title: 'Tips phối đồ với sneaker cho nam và nữ',
      content: `
        <h2>Nguyên tắc cơ bản khi phối đồ với sneaker</h2>
        <p>Phối đồ với sneaker không chỉ đơn thuần là kết hợp giày với trang phục, mà còn cần hiểu rõ phong cách bản thân và dịp sử dụng.</p>
        
        <h2>Phối đồ cho Nam</h2>
        
        <h3>1. Phong cách Casual - Đi học/đi chơi</h3>
        <p><strong>Công thức:</strong> Sneaker trắng + Jeans + T-shirt/Polo</p>
        <ul>
          <li>Chọn quần jeans slim fit hoặc straight fit</li>
          <li>Áo thun basic hoặc polo shirt đơn giản</li>
          <li>Sneaker trắng hoặc màu trung tính</li>
          <li>Thêm phụ kiện: đồng hồ, mũ lưỡi trai</li>
        </ul>
        
        <h3>2. Phong cách Smart Casual - Đi làm</h3>
        <p><strong>Công thức:</strong> Sneaker leather + Chinos + Shirt</p>
        <ul>
          <li>Chọn sneaker da hoặc canvas cao cấp</li>
          <li>Quần chinos màu trung tính</li>
          <li>Áo sơ mi không cài cúc cuối hoặc áo polo</li>
          <li>Blazer nhẹ nếu cần formal hơn</li>
        </ul>
        
        <h3>3. Phong cách Streetwear</h3>
        <p><strong>Công thức:</strong> Chunky sneakers + Joggers + Hoodie</p>
        <ul>
          <li>Sneaker chunky màu sắc nổi bật</li>
          <li>Quần jogger hoặc cargo pants</li>
          <li>Hoodie oversized</li>
          <li>Phụ kiện: bucket hat, túi đeo chéo</li>
        </ul>
        
        <h2>Phối đồ cho Nữ</h2>
        
        <h3>1. Phong cách Feminine Sporty</h3>
        <p><strong>Công thức:</strong> Sneaker pastel + Váy/Chân váy + Áo crop top</p>
        <ul>
          <li>Sneaker màu pastel hoặc trắng</li>
          <li>Chân váy tennis hoặc váy suông</li>
          <li>Áo crop top hoặc baby tee</li>
          <li>Phụ kiện: túi mini, scrunchie</li>
        </ul>
        
        <h3>2. Phong cách Minimalist</h3>
        <p><strong>Công thức:</strong> Sneaker trắng + Quần âu + Áo sơ mi</p>
        <ul>
          <li>Sneaker trắng basic</li>
          <li>Quần âu ống rộng hoặc mom jeans</li>
          <li>Áo sơ mi oversized</li>
          <li>Tông màu trung tính: trắng, đen, be</li>
        </ul>
        
        <h3>3. Phong cách Retro Chic</h3>
        <p><strong>Công thức:</strong> Vintage sneakers + High-waist jeans + Crop top</p>
        <ul>
          <li>Sneaker vintage (Converse, Vans Old Skool)</li>
          <li>Quần jeans lưng cao</li>
          <li>Áo crop top hoặc áo tay phồng</li>
          <li>Phụ kiện: kính mát aviator, túi đeo chéo</li>
        </ul>
        
        <h2>Tips phối màu với sneaker</h2>
        
        <h3>Quy tắc 3 màu</h3>
        <p>Trong một outfit, không nên sử dụng quá 3 màu chủ đạo để tránh rối mắt.</p>
        
        <h3>Màu trung tính làm nền</h3>
        <p>Sử dụng màu trung tính (trắng, đen, xám, be) làm màu nền, sneaker có thể là điểm nhấn màu sắc.</p>
        
        <h3>Phối màu tương phản</h3>
        <p>Sneaker đen với outfit màu sáng, hoặc sneaker trắng với outfit màu tối tạo sự tương phản thú vị.</p>
        
        <h2>Lỗi thường gặp khi phối đồ</h2>
        
        <h3>1. Sai dịp</h3>
        <p>Không nên đi sneaker thể thao khi tham dự sự kiện formal hoặc dự tiệc quan trọng.</p>
        
        <h3>2. Không phù hợp với body shape</h3>
        <p>Người thấp nên tránh chunky sneakers quá to, người cao có thể thoải mái hơn trong việc lựa chọn.</p>
        
        <h3>3. Quá nhiều brand logo</h3>
        <p>Tránh mix nhiều thương hiệu lớn trong cùng một outfit, điều này có thể tạo cảm giác rối mắt.</p>
        
        <h2>Kết luận</h2>
        <p>Phối đồ với sneaker là cả một nghệ thuật. Hãy bắt đầu từ những công thức đơn giản, sau đó dần phát triển phong cách riêng của bạn. Nhớ rằng, tự tin chính là phụ kiện đẹp nhất!</p>
        
        <p>S-Sneaker luôn cập nhật những xu hướng mới nhất và chia sẻ kinh nghiệm phối đồ để giúp bạn luôn thời trang và nổi bật.</p>
      `,
      category: 'Phối đồ',
      date: '12/12/2024',
      readTime: '7 phút đọc',
      views: 1820,
      author: 'S-Sneaker Team'
    }
  };

  const post = blogData[slug];

  if (!post) {
    return (
      <div className="blog-detail-wrapper">
        <div className="blog-detail-container">
          <div className="blog-not-found">
            <Title level={2}>Bài viết không tồn tại</Title>
            <Paragraph>Bài viết bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</Paragraph>
            <Button type="primary" onClick={() => navigate('/blog')}>
              Quay lại trang Blog
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-detail-wrapper">
      <div className="blog-detail-container">
        {/* Back Button */}
        <Button 
          type="text" 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/blog')}
          className="blog-back-button"
        >
          Quay lại
        </Button>

        {/* Article Header */}
        <div className="blog-article-header">
          <Tag color="blue" className="blog-article-category">
            {post.category}
          </Tag>
          
          <Title level={1} className="blog-article-title">
            {post.title}
          </Title>
          
          <div className="blog-article-meta">
            <Row gutter={[16, 8]} align="middle">
              <Col>
                <span className="blog-meta-item">
                  <CalendarOutlined /> {post.date}
                </span>
              </Col>
              <Col>
                <span className="blog-meta-item">
                  <UserOutlined /> {post.author}
                </span>
              </Col>
              <Col>
                <span className="blog-meta-item">
                  <ClockCircleOutlined /> {post.readTime}
                </span>
              </Col>
            </Row>
          </div>
        </div>

        <Divider />

        {/* Article Content */}
        <div className="blog-article-content">
          <div 
            dangerouslySetInnerHTML={{ __html: post.content }}
            className="blog-content-body"
          />
        </div>

        <Divider />

        {/* Call to Action */}
        <div className="blog-article-cta">
          <div className="blog-cta-content">
            <Title level={3}>Khám phá thêm sản phẩm tại S-Sneaker</Title>
            <Paragraph>
              Sau khi đã hiểu rõ hơn về sneaker, hãy khám phá bộ sưu tập đa dạng tại S-Sneaker để tìm cho mình đôi giày ưng ý nhất!
            </Paragraph>
            <Button 
              type="primary" 
              size="large"
              onClick={() => navigate('/product', { state: { type: 'all' } })}
              className="blog-cta-button"
            >
              Xem sản phẩm
            </Button>
          </div>
        </div>

        {/* Related Articles */}
        <div className="blog-related-section">
          <Title level={3}>Bài viết liên quan</Title>
          <Row gutter={[24, 24]}>
            {Object.entries(blogData)
              .filter(([key]) => key !== slug)
              .slice(0, 3)
              .map(([key, relatedPost]) => (
                <Col xs={24} md={8} key={key}>
                  <div 
                    className="blog-related-card"
                    onClick={() => navigate(`/blog/${key}`)}
                  >
                    <Tag color="blue" className="blog-related-category">
                      {relatedPost.category}
                    </Tag>
                    <Title level={4} className="blog-related-title">
                      {relatedPost.title}
                    </Title>
                    <div className="blog-related-meta">
                      <span><CalendarOutlined /> {relatedPost.date}</span>
                      <span><ClockCircleOutlined /> {relatedPost.readTime}</span>
                    </div>
                  </div>
                </Col>
              ))}
          </Row>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailPage;
