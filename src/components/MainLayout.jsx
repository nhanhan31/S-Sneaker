import React, { useEffect, useState } from 'react';
import { Layout, Menu, Badge, Divider, Avatar } from 'antd';
import { ShoppingCartOutlined, UserOutlined, SearchOutlined, InstagramOutlined, FacebookFilled, TikTokOutlined, HeartOutlined, DownOutlined } from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import './MainLayout.css';
import { getCartByUserId } from '../utils/cartApi';
import { getFavoriteByUserId } from '../utils/favoriteApi';
import { Dropdown } from 'antd';
import { getUserDetail } from '../utils/userApi';
// Thêm dòng này để import hàm gọi API sản phẩm
import { fetchAllProducts } from '../utils/productApi';

const { Header, Footer, Content } = Layout;

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [cartCount, setCartCount] = useState(0);

  // Gọi API lấy toàn bộ sản phẩm và lưu vào localStorage
  useEffect(() => {
    fetchAllProducts().then((data) => {
      if (Array.isArray(data)) {
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

    // Lắng nghe sự kiện storage (giữa các tab)
    window.addEventListener('storage', updateCartCount);

    // Lắng nghe sự kiện custom khi add to cart (trong cùng tab)
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
        if (res.ok && Array.isArray(res.data.data)) {
          sessionStorage.removeItem("cart");
          // Lưu cả id, sizeId, quantity cho từng sản phẩm trong cart
          const cartArr = res.data.data.map(item => ({
            id: item.productId,
            sizeId: item.sizeId ?? '', // nếu API trả về sizeId, dùng luôn, nếu không thì để 0
            quantity: item.quantity
          }));
          sessionStorage.setItem("cart", JSON.stringify(cartArr));
          setCartCount(cartArr.length);
        }
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
      sessionStorage.clear();
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
        <Menu.Item key="setting">User Setting</Menu.Item>
        <Menu.Item key="logout">Logout</Menu.Item>
      </Menu>
    )
    : (
      <Menu onClick={handleMenuClick}>
        <Menu.Item key="login">Login</Menu.Item>
      </Menu>
    );

  // Lấy avatar từ user (giả sử trường là user.avatar hoặc user.avatarUrl)
  const avatarUrl = user?.image || null;

  return (
    <Layout style={{ minHeight: '100vh' }} className="homepage">
      <Header className="header" style={{ background: 'rgb(238, 238, 238)', padding: '0 30px', display: 'flex', alignItems: 'center', position: 'sticky', top: 0, zIndex: 1000, opacity: 0.90, justifyContent: 'space-between' }}>
        <div className="logo" style={{ fontWeight: 'bold', fontSize: 22, marginRight: 32, cursor: 'pointer' }} onClick={() => navigate('/')}>S-SNEAKER</div>
        {/* Ẩn menu khi ở /user */}
        {!location.pathname.startsWith("/user") && (
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
                key="1"
                onClick={() => navigate('/product', { state: { type: 'men' } })}
              >
                Men
              </Menu.Item>
              <Menu.Item
                key="2"
                onClick={() => navigate('/product', { state: { type: 'women' } })}
              >
                Women
              </Menu.Item>
              <Menu.Item
                key="3"
                onClick={() => navigate('/product', { state: { type: 'kid' } })}
              >
                Kids
              </Menu.Item>
              <Menu.Item
                key="4"
                onClick={() => navigate('/product', { state: { type: 'newarrival' } })}
              >
                New Arrivals
              </Menu.Item>
              <Menu.Item
                key="5"
                onClick={() => navigate('/product', { state: { type: 'all' } })}
              >
                All Products
              </Menu.Item>
            </Menu>
          </div>
        )}
        <div className="header-icons" style={{ display: 'flex', alignItems: 'center' }}>
          <HeartOutlined
            style={{ fontSize: 20, marginRight: 20 }}
            onClick={() => navigate('/favorite')} />
          <Badge count={cartCount} size="small" offset={[1, 1]}>
            <ShoppingCartOutlined
              style={{ fontSize: 20, cursor: 'pointer' }}
              onClick={() => navigate('/cart')}
            />
          </Badge>
          <Dropdown overlay={userMenu} trigger={['click']}>
            <span style={{ marginLeft: 20, fontSize: 20, cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}>
              {user?.userId && avatarUrl ? (
                <Avatar src={avatarUrl} alt="avatar" size={28} />
              ) : (
                <UserOutlined />
              )}
            </span>
          </Dropdown>
        </div>
      </Header>
      <Content style={{ background: '#fff' }}>
        <Outlet />
        
        <Divider style={{ margin: '32px 0', borderColor: '#e8e8e8', borderWidth: '1px' }} />
      </Content>
      <Footer className="footer" style={{ background: '#fff', padding: '0px 30px 16px 30px', minHeight: 120 }}>
        <div style={{
          maxWidth: 1900,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 24
        }}>
          {/* Logo + Description */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 40 }}>
            <div style={{ flex: 2, minWidth: 260 }}>
              <div style={{ fontWeight: 'bold', fontSize: 32, marginBottom: 8, fontFamily: 'inherit', letterSpacing: 1 }}>
                S-SNEAKER
              </div>
              <div style={{ color: '#222', fontSize: 14, maxWidth: 520, lineHeight: 1.7, marginTop: 18 }}>
                We don’t just sell shoes, we sell memories and collectibles. We collect the best<br />
                in the best with an attention to all little details. we know that shoes speaks<br />
                louder than words that’s why we’ve mastered the science of good sneakers.
              </div>
            </div>
          </div>
          {/* Social + Support + Copyright */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            marginTop: 24
          }}>
            <div style={{ color: '#222', fontSize: 14 }}>
              Don’t missout on once-in-a-while-deals:
              <span style={{ marginLeft: 16 }}>
                <span style={{
                  display: 'inline-block',
                  background: '#f5f5f5',
                  borderRadius: 6,
                  padding: '4px 7px',
                  margin: '0 3px',
                  fontSize: 16,
                  color: '#1da1f2'
                }}>
                  <TikTokOutlined />
                </span>
                <span style={{
                  display: 'inline-block',
                  background: '#f5f5f5',
                  borderRadius: 6,
                  padding: '4px 7px',
                  margin: '0 3px',
                  fontSize: 16,
                  color: '#e1306c'
                }}>
                  <InstagramOutlined />
                </span>
                <span style={{
                  display: 'inline-block',
                  background: '#f5f5f5',
                  borderRadius: 6,
                  padding: '4px 7px',
                  margin: '0 3px',
                  fontSize: 16,
                  color: '#1877f3'
                }}>
                  <FacebookFilled />
                </span>
              </span>
            </div>
            <div style={{ color: '#222', fontSize: 14 }}>
              Support line: <b>+250 788 467 808</b>
            </div>
            <div style={{ color: '#222', fontSize: 13, textAlign: 'right', minWidth: 180 }}>
              Copyright&nbsp;2021<sup>©</sup> Sneaker City ltd
            </div>
          </div>
        </div>
      </Footer>
    </Layout>
  );
};

export default MainLayout;