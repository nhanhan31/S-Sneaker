import React, { useEffect, useState } from 'react';
import { Layout, Menu, Badge, Divider, Avatar, Drawer, Button, FloatButton } from 'antd';
import { ShoppingCartOutlined, UserOutlined, InstagramOutlined, FacebookFilled, TikTokOutlined, HeartOutlined, MenuOutlined, DashboardOutlined, PhoneOutlined, MessageOutlined, CustomerServiceOutlined } from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import './MainLayout.css';
import { getCartByUserId } from '../utils/cartApi';
import { getFavoriteByUserId } from '../utils/favoriteApi';
import { Dropdown } from 'antd';
import { getUserDetail } from '../utils/userApi';
import { fetchAllProducts } from '../utils/productApi';
import BotpressChat from './BotpressChat';
import { SiZalo } from "react-icons/si";

const { Header, Footer, Content } = Layout;

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [cartCount, setCartCount] = useState(0);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Handle window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Gọi API lấy toàn bộ sản phẩm và lưu vào localStorage
  useEffect(() => {
    fetchAllProducts().then((data) => {
      if (Array.isArray(data)) {
        localStorage.setItem('shoesData', []);
        localStorage.setItem('shoesData', JSON.stringify(data));
      }
    });
  }, []);

  // Cập nhật cartCount khi sessionStorage thay đổi hoặc khi add vào cart
  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(sessionStorage.getItem('cart') || '[]');
      setCartCount(cart.length);
    };
    updateCartCount();

    window.addEventListener('storage', updateCartCount);
    const handleCartChange = () => updateCartCount();
    window.addEventListener('cartChanged', handleCartChange);

    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartChanged', handleCartChange);
    };
  }, []);

  // Lấy user từ localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");

  // Cập nhật badge ngay sau khi call API getCartByUserId thành công
  useEffect(() => {
    if (user?.userId && token) {
      getCartByUserId({ userId: user.userId, token }).then(res => {
        // Luôn set lại cart về [] nếu không có sản phẩm
        if (res.ok && Array.isArray(res.data.data)) {
          sessionStorage.removeItem("cart");
          const cartArr = res.data.data.map(item => ({
            id: item.productId,
            sizeId: item.sizeId ?? '',
            quantity: item.quantity
          }));
          sessionStorage.setItem("cart", JSON.stringify(cartArr));
          setCartCount(cartArr.length);
        } else {
          // Nếu không ok hoặc không có data, set cart rỗng
          sessionStorage.setItem("cart", JSON.stringify([]));
          setCartCount(0);
        }
      }).catch(() => {
        // Nếu lỗi API, cũng set cart rỗng
        sessionStorage.setItem("cart", JSON.stringify([]));
        setCartCount(0);
      });
      getFavoriteByUserId({ userId: user.userId, token }).then(res => {
        if (res.ok && Array.isArray(res.data.favorites)) {
          sessionStorage.removeItem("favorites");
          const favArr = (res.data.favorites[0]?.items || []).map(item => item.productId);
          sessionStorage.setItem("favorites", JSON.stringify(favArr));
        }
      });
      // Gọi thêm API lấy user detail và cập nhật localStorage
      getUserDetail(user.userId, token).then(res => {
        if (res.ok && res.data && res.data.user) {
          localStorage.setItem("user", JSON.stringify(res.data.user));
        }
      });
    }
  }, [user?.userId, token]);

  const handleMenuClick = ({ key }) => {
    if (key === "setting") {
      navigate("/user");
    }
    if (key === "logout") {
      const rememberEmail = localStorage.getItem("rememberEmail");
      sessionStorage.removeItem('cart');
      sessionStorage.removeItem('favorites');
      localStorage.clear();
      if (rememberEmail) {
        localStorage.setItem("rememberEmail", rememberEmail);
      }
      navigate("/");
    }
    if (key === "login") {
      navigate("/login");
    }
  };

  const userMenu = user?.userId
    ? (
      <Menu onClick={handleMenuClick}>
        <Menu.Item key="setting">Cài đặt tài khoản</Menu.Item>
        <Menu.Item key="logout">Đăng xuất</Menu.Item>
      </Menu>
    )
    : (
      <Menu onClick={handleMenuClick}>
        <Menu.Item key="login">Đăng nhập</Menu.Item>
      </Menu>
    );

  // Lấy avatar từ user (giả sử trường là user.avatar hoặc user.avatarUrl)
  const avatarUrl = user?.image || null;

  // Responsive menu items for mobile drawer
  const navMenu = (
    <Menu
      mode="vertical"
      style={{
        borderBottom: 'none',
        fontWeight: 500,
        fontSize: 16,
        background: 'transparent',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}
      onClick={() => setDrawerVisible(false)}
    >
      <Menu.Item
        key="3"
        onClick={() => navigate('/about')}
      >
        Về chúng tôi
      </Menu.Item>
      <Menu.Item
        key="6"
        onClick={() => navigate('/blog')}
      >
        Blog
      </Menu.Item>
      <Menu.Item
        key="1"
        onClick={() => navigate('/product', { state: { type: 'men' } })}
      >
        Nam
      </Menu.Item>
      <Menu.Item
        key="2"
        onClick={() => navigate('/product', { state: { type: 'women' } })}
      >
        Nữ
      </Menu.Item>
      <Menu.Item
        key="4"
        onClick={() => navigate('/product', { state: { type: 'newarrival' } })}
      >
        Hàng mới về
      </Menu.Item>
      <Menu.Item
        key="5"
        onClick={() => navigate('/product', { state: { type: 'all' } })}
      >
        Tất cả sản phẩm
      </Menu.Item>

    </Menu>
  );

  return (
    <Layout style={{ minHeight: '100vh' }} className="homepage">
      {/* Mobile Navigation Drawer */}
      <Drawer
        title="Menu"
        placement="left"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={280}
        className="mobile-drawer"
        styles={{
          body: { padding: '16px' },
          header: { borderBottom: '1px solid #f0f0f0' }
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Navigation Menu */}
          {location.pathname !== "/user" && (
            <div style={{ marginBottom: 20 }}>
              {navMenu}
            </div>
          )}

          {/* Divider */}
          <Divider />

          {/* Action Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Button
              type="text"
              icon={<HeartOutlined />}
              onClick={() => {
                navigate('/favorite');
                setDrawerVisible(false);
              }}
              style={{ justifyContent: 'flex-start', height: 'auto', padding: '8px 0' }}
            >
              Yêu thích
            </Button>

            <Badge count={cartCount} size="small">
              <Button
                type="text"
                icon={<ShoppingCartOutlined />}
                onClick={() => {
                  navigate('/cart');
                  setDrawerVisible(false);
                }}
                style={{ justifyContent: 'flex-start', height: 'auto', padding: '8px 0' }}
              >
                Giỏ hàng
              </Button>
            </Badge>

            {/* User Menu */}
            <div style={{ marginTop: 20 }}>
              <Divider />
              {user?.userId ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0' }}>
                    {avatarUrl ? (
                      <Avatar src={avatarUrl} alt="avatar" size={28} />
                    ) : (
                      <UserOutlined style={{ fontSize: 20 }} />
                    )}
                    <span>Xin chào, {user.firstName || user.fullName || 'User'}</span>
                  </div>
                  <Button
                    type="text"
                    onClick={() => {
                      navigate('/user');
                      setDrawerVisible(false);
                    }}
                    style={{ justifyContent: 'flex-start', height: 'auto', padding: '8px 0' }}
                  >
                    Cài đặt tài khoản
                  </Button>

                  <Button
                    type="text"
                    onClick={() => {
                      handleMenuClick({ key: 'logout' });
                      setDrawerVisible(false);
                    }}
                    style={{ justifyContent: 'flex-start', height: 'auto', padding: '8px 0', color: '#ff4d4f' }}
                  >
                    Đăng xuất
                  </Button>
                </div>
              ) : (
                <Button
                  type="primary"
                  onClick={() => {
                    navigate('/login');
                    setDrawerVisible(false);
                  }}
                  style={{ width: '100%', background: '#111', borderColor: '#111' }}
                >
                  Đăng nhập
                </Button>
              )}
            </div>
          </div>
        </div>
      </Drawer>

      <Header
        className="header"
        style={{
          background: 'rgb(238, 238, 238)',
          padding: isMobile ? '0 12px' : '0 16px',
          display: 'flex',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          opacity: 0.90,
          justifyContent: 'space-between',
          minHeight: isMobile ? 56 : 64
        }}
      >
        {/* Logo */}
        <div
          className="logo"
          style={{
            fontWeight: 'bold',
            fontSize: isMobile ? 18 : 22,
            marginRight: isMobile ? 8 : 32,
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
          onClick={() => navigate('/')}
        >
          <img
            style={{ width: isMobile ? 60 : 80 }}
            src='/assets/S-Sneaker-logo.png'
            alt="S-Sneaker Logo"
          />
        </div>

        {/* Desktop Navigation Menu */}
        {!isMobile && !location.pathname.startsWith("/user") && (
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <Menu
              mode="horizontal"
              style={{
                borderBottom: 'none',
                fontWeight: 500,
                fontSize: 16,
                background: 'transparent',
                width: '100%',
                display: 'flex',
                justifyContent: 'center'
              }}
            >
              <Menu.Item
                key="3"
                onClick={() => navigate('/about')}
              >
                Về chúng tôi
              </Menu.Item>
              <Menu.Item
                key="6"
                onClick={() => navigate('/blog')}
              >
                Blog
              </Menu.Item>
              <Menu.Item
                key="1"
                onClick={() => navigate('/product', { state: { type: 'men' } })}
              >
                Nam
              </Menu.Item>
              <Menu.Item
                key="2"
                onClick={() => navigate('/product', { state: { type: 'women' } })}
              >
                Nữ
              </Menu.Item>
              <Menu.Item
                key="4"
                onClick={() => navigate('/product', { state: { type: 'newarrival' } })}
              >
                Hàng mới về
              </Menu.Item>
              <Menu.Item
                key="5"
                onClick={() => navigate('/product', { state: { type: 'all' } })}
              >
                Tất cả sản phẩm
              </Menu.Item>
            </Menu>
          </div>
        )}

        {/* Header Icons */}
        <div className="header-icons" style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 8 : 12 }}>
          {/* Desktop Icons */}
          {!isMobile && (
            <>
              <HeartOutlined
                style={{ fontSize: 20, cursor: 'pointer' }}
                onClick={() => navigate('/favorite')}
              />
              <Badge count={cartCount} size="small" offset={[1, 1]}>
                <ShoppingCartOutlined
                  style={{ fontSize: 20, cursor: 'pointer' }}
                  onClick={() => navigate('/cart')}
                />
              </Badge>
              <Dropdown overlay={userMenu} trigger={['click']}>
                <span style={{
                  fontSize: 20,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center'
                }}>
                  {user?.userId && avatarUrl ? (
                    <Avatar src={avatarUrl} alt="avatar" size={28} />
                  ) : (
                    <UserOutlined />
                  )}
                </span>
              </Dropdown>
              {/* Admin Access for Desktop */}

            </>
          )}

          {/* Mobile Icons - Cart and Menu */}
          {isMobile && (
            <>
              <Badge count={cartCount} size="small" offset={[1, 1]}>
                <Button
                  type="text"
                  icon={<ShoppingCartOutlined />}
                  onClick={() => navigate('/cart')}
                  style={{ fontSize: 18, padding: '4px 8px' }}
                />
              </Badge>
              <Button
                type="text"
                icon={<MenuOutlined />}
                onClick={() => setDrawerVisible(true)}
                style={{ fontSize: 20, padding: '4px 8px' }}
              />
            </>
          )}
        </div>
      </Header>

      <Content style={{ background: 'linear-gradient(90deg, rgb(248, 250, 252) 60%, rgb(227, 227, 227) 100%)' }}>
        <Outlet />

        <BotpressChat />
      </Content>
      <Divider style={{ margin: '0 0 0 0', borderColor: '#e8e8e8', borderWidth: '1px' }} />
      <Footer
        className="footer"
        style={{
          background: 'linear-gradient(90deg, #f8fafc 60%, #e3e3e3 100%)',
          padding: isMobile ? '16px 12px' : '40px 150px 16px 150px',
          minHeight: isMobile ? 'auto' : 120
        }}
      >
        <div style={{
          maxWidth: 1900,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: isMobile ? 16 : 24
        }}>
          {/* Logo + Description */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: isMobile ? 20 : 40,
            flexDirection: isMobile ? 'column' : 'row'
          }}>
            <div style={{ flex: 1, minWidth: isMobile ? 'auto' : 260 }}>
              <div style={{
                fontWeight: 'bold',
                fontSize: isMobile ? 24 : 32,
                marginBottom: 8,
                fontFamily: 'inherit',
                letterSpacing: 1
              }}>
                S-SNEAKER
              </div>
              <div style={{
                color: '#222',
                fontSize: isMobile ? 13 : 14,
                maxWidth: isMobile ? '100%' : 520,
                lineHeight: 1.7,
                marginTop: isMobile ? 12 : 18
              }}>
                Chúng tôi không chỉ bán giày, chúng tôi bán những kỷ niệm và bộ sưu tập. Chúng tôi thu thập những sản phẩm tốt nhất
                {!isMobile && <br />}
                {' '}với sự chú ý đến từng chi tiết nhỏ. Chúng tôi biết rằng đôi giày nói lên
                {!isMobile && <br />}
                {' '}nhiều điều hơn lời nói, đó là lý do tại sao chúng tôi đã thành thạo nghệ thuật làm giày tốt.
              </div>
            </div>

            {/* Google Map - Square Shape */}
            <div style={{
              width: isMobile ? '100%' : '300px',
              height: isMobile ? '250px' : '300px',
              borderRadius: 12,
              overflow: 'hidden',
              flexShrink: 0,
              border: '3px solid rgb(190, 190, 190)'
            }}>
              <iframe
                title="Google Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.832168710479!2d106.75852837601306!3d10.824152558309564!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3175265228983c73%3A0x7c5405782cb50a3a!2zNjcgxJAuIE5hbSBIb8OgLCBQaMaw4bubYyBMb25nIEEsIFRo4bunIMSQ4bupYywgSOG7kyBDaMOtIE1pbmgsIFZp4buHdCBOYW0!5e0!3m2!1svi!2s!4v1750864445273!5m2!1svi!2s"
                style={{
                  border: 0,
                  width: '100%',
                  height: '100%'
                }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Social + Support + Copyright */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            marginTop: isMobile ? 16 : 24,
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? 12 : 0
          }}>
            <div style={{
              color: '#222',
              fontSize: isMobile ? 13 : 14,
              textAlign: isMobile ? 'center' : 'left',
              order: isMobile ? 2 : 1
            }}>
              Đừng bỏ lỡ những ưu đãi đặc biệt:
              <span style={{ marginLeft: isMobile ? 8 : 16 }}>
                <span style={{
                  display: 'inline-block',
                  background: '#f5f5f5',
                  borderRadius: 6,
                  padding: '4px 7px',
                  margin: '0 3px',
                  fontSize: isMobile ? 14 : 16,
                  color: '#1da1f2'
                }}>
                  <TikTokOutlined onClick={() => window.open('https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.tiktok.com%2F%40s.sneaker03%3F_t%3DZS-8xVNxcOrgji%26_r%3D1%26fbclid%3DIwZXh0bgNhZW0CMTAAYnJpZBExbU5kTUp2ZTRWQTEwWEtCWgEeckaUfMOlPU9pa8_y3U3Biik10owr7j7W0PqaEPSU6hfAkRp0s5wPnC5iVvI_aem_oycSJJIe2htTrSaA8oI44w&h=AT2b960BOuuO-9hyQpvSIOzJq5veYAin4BzOTZ3sDSeXiJXxN3aeUSCmxqf1ufF0BXSLD3Gl2ND67kNfzuF_3D_xZINBfUIoVlG0OJXtFHvLp6jHRo1gL0igVomd1SkSGEAL91PboEQEmUQ', '_blank')}/>
                </span>
                
                <span style={{
                  display: 'inline-block',
                  background: '#f5f5f5',
                  borderRadius: 6,
                  padding: '4px 7px',
                  margin: '0 3px',
                  fontSize: isMobile ? 14 : 16,
                  color: '#4267B2'
                }}>
                  <FacebookFilled onClick={() => window.open('https://www.facebook.com/profile.php?id=61576730682285', '_blank')}/>
                </span>
              </span>
            </div>
            <div style={{
              color: '#222',
              fontSize: isMobile ? 13 : 14,
              textAlign: isMobile ? 'center' : 'right',
              order: isMobile ? 3 : 2
            }}>
              Hỗ trợ khách hàng:  0346522836
            </div>
            <div style={{
              color: '#999',
              fontSize: isMobile ? 12 : 13,
              textAlign: isMobile ? 'center' : 'right',
              order: isMobile ? 1 : 2
            }}>
              © 2025 S-SNEAKER
            </div>
          </div>
        </div>
      </Footer>

      {/* Float Button for Contact */}
      <FloatButton.Group
        trigger="click"
        type="primary"
        style={{
          zIndex: 1001
        }}
        icon={<CustomerServiceOutlined />}
        tooltip="Liên hệ hỗ trợ"
        description="Hỗ trợ"
      >
        <FloatButton
          icon={<PhoneOutlined style={{ fontSize: 24 }} />}
          tooltip="Gọi ngay: 0346522836"
          onClick={() => {
            if (isMobile) {
              window.open('tel:0346522836');
            } else {
              // Desktop: copy số điện thoại và hiển thị thông báo
              navigator.clipboard.writeText('0346522836').then(() => {
                alert('Số điện thoại đã được sao chép vào clipboard: 0346522836');
                // Có thể thêm notification ở đây
              });
            }
          }}
        />
        <FloatButton
          icon={<FacebookFilled style={{ fontSize: 24 }} />}
          tooltip="Facebook"
          onClick={() => window.open('https://www.facebook.com/profile.php?id=61576730682285', '_blank')}
        />
        <FloatButton
          icon={<SiZalo style={{ fontSize: 24 }} />}
          tooltip="Chat Zalo"
          onClick={() => window.open('https://zalo.me/0346522836', '_blank')}
        />
      </FloatButton.Group>
    </Layout>
  );
};

export default MainLayout;