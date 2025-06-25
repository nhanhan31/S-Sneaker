import React, { useEffect, useState } from 'react';
// XÓA DÒNG NÀY: import shoesData from '../../components/shoesData';
import { Button, Image, Spin, message } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import {
  updateProductQuantityCart,
  deleteProductFromCart,
  deleteAllProductFromCart
} from '../../utils/cartApi';
import { fetchAllSizes } from '../../utils/sizeApi'; // Thêm dòng này
import './Cartpage.css';

const Cartpage = () => {
  const [cart, setCart] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [loadingAll, setLoadingAll] = useState(false);
  const [sizes, setSizes] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isTablet, setIsTablet] = useState(window.innerWidth <= 1024);
  const navigate = useNavigate();

  // Handle window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      setIsTablet(window.innerWidth <= 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");

  // Lấy shoesData từ localStorage thay vì import file js
  const shoesData = React.useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('shoesData') || '[]');
    } catch {
      return [];
    }
  }, []);

  // Lấy danh sách size từ API khi load trang
  useEffect(() => {
    fetchAllSizes(token).then(data => {
      setSizes(data); // data giờ là mảng sizes đúng chuẩn
    });
  }, [token]);

  console.log('shoesData:', sizes); // Log để kiểm tra dữ liệu shoesData

  useEffect(() => {
    const cartData = JSON.parse(sessionStorage.getItem('cart') || '[]');
    setCart(cartData);
  }, []);

  // Lấy tên size từ sizeId
  const getSizeName = (sizeId) => {
    // Ép kiểu về số để so sánh chắc chắn
    const found = sizes.find(s => Number(s.sizeId) === Number(sizeId));
    
    return found ? found.sizeNumber : sizeId; // fallback nếu không tìm thấy
  };

  // SỬA: Dùng productId thay cho id, productName thay cho name, productImage thay cho img, price là string
  const cartItems = cart.map(item => {
    const product = shoesData.find(p => p.productId === item.id);
    return product
      ? { ...product, quantity: item.quantity, sizeId: item.sizeId }
      : null;
  }).filter(Boolean);

  const subTotal = cartItems.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
  const deliveryFee = 0;
  const total = subTotal + deliveryFee;

  // Thay đổi số lượng (PUT)
  const handleQuantityChange = async (id, sizeId, delta) => {
    if (!user?.userId || !token) {
      message.error("Bạn cần đăng nhập!");
      return;
    }
    const item = cart.find(i => i.id === id && i.sizeId === sizeId);
    if (!item) return;
    const newQuantity = item.quantity + delta;

    setLoadingId(id + '-' + sizeId);

    if (newQuantity < 1) {
      // Gọi API xoá khi số lượng về 0
      const result = await deleteProductFromCart({
        userId: user.userId,
        productId: id,
        sizeId, // truyền thêm sizeId
        token
      });
      setLoadingId(null);
    if (result.ok) {
      const newCart = cart.filter(i => !(i.id === id && i.sizeId === sizeId));
      setCart(newCart);
      sessionStorage.setItem('cart', JSON.stringify(newCart));
      window.dispatchEvent(new Event('cartChanged'));
      message.success("Đã xóa sản phẩm khỏi giỏ hàng!");
    } else {
      message.error(result.data.message || "Xóa thất bại!");
    }
      return;
    }

    // Nếu số lượng > 0 thì update như cũ
    const result = await updateProductQuantityCart({
      userId: user.userId,
      productId: id,
      sizeId, // truyền thêm sizeId
      quantity: newQuantity,
      token
    });
    setLoadingId(null);

    if (result.ok) {
      const newCart = cart.map(i =>
        i.id === id && i.sizeId === sizeId ? { ...i, quantity: newQuantity } : i
      );
      setCart(newCart);
      sessionStorage.setItem('cart', JSON.stringify(newCart));
      window.dispatchEvent(new Event('cartChanged'));
      message.success("Cập nhật số lượng thành công!");
    } else {
      message.error(result.data.message || "Cập nhật thất bại!");
    }
  };

  // Xoá 1 sản phẩm (DELETE)
  const handleDeleteItem = async (id, sizeId) => {
    if (!user?.userId || !token) {
      message.error("Bạn cần đăng nhập!");
      return;
    }
    setLoadingId(id + '-' + sizeId);
    const result = await deleteProductFromCart({
      userId: user.userId,
      productId: id,
      sizeId, // truyền thêm sizeId
      token
    });
    setLoadingId(null);

    if (result.ok) {
      const newCart = cart.filter(i => !(i.id === id && i.sizeId === sizeId));
      setCart(newCart);
      sessionStorage.setItem('cart', JSON.stringify(newCart));
      window.dispatchEvent(new Event('cartChanged'));
      message.success("Đã xóa sản phẩm khỏi giỏ hàng!");
    } else {
      message.error(result.data.message || "Xóa thất bại!");
    }
  };

  // Xoá tất cả (DELETE ALL)
  const handleClearCart = async () => {
    if (!user?.userId || !token) {
      message.error("Bạn cần đăng nhập!");
      return;
    }
    setLoadingAll(true);
    const result = await deleteAllProductFromCart({
      userId: user.userId,
      token
    });
    setLoadingAll(false);

    if (result.ok) {
      setCart([]);
      sessionStorage.removeItem('cart');
      window.dispatchEvent(new Event('cartChanged'));
      message.success("Đã xóa toàn bộ giỏ hàng!");
    } else {
      message.error(result.data.message || "Xóa thất bại!");
    }
  };

  return (
    <div className="cartpage-container" style={{
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      gap: isMobile ? 24 : 48,
      alignItems: 'flex-start',
      padding: isMobile ? '16px 12px 0 12px' : isTablet ? '24px 16px 0 16px' : '32px 24px 0 24px',
      minHeight: '70vh',
      background: '#fff'
    }}>
      {/* Cart List */}
      <div style={{ flex: isMobile ? 'none' : 2, width: isMobile ? '100%' : 'auto' }}>
        <h3 className="cart-header" style={{ 
          fontWeight: 600, 
          fontSize: isMobile ? 20 : 24, 
          marginBottom: 18,
          textAlign: isMobile ? 'center' : 'left'
        }}>
          Giỏ hàng của bạn
        </h3>
        {cartItems.length > 0 && (
          <Button
            type="default"
            style={{
              marginBottom: 16,
              borderRadius: 8,
              borderColor: '#bbb',
              fontWeight: 600,
              background: '#fff',
              width: isMobile ? '100%' : 'auto'
            }}
            loading={loadingAll}
            onClick={handleClearCart}
          >
            Xóa tất cả
          </Button>
        )}
        <div style={{
          background: '#fff',
          borderRadius: 10,
          padding: 0,
          minHeight: 80
        }}>
          {cartItems.length === 0 ? (
            <div className="empty-cart" style={{ 
              color: '#888', 
              textAlign: 'center', 
              padding: isMobile ? 20 : 40,
              fontSize: isMobile ? 14 : 16
            }}>
              Giỏ hàng của bạn đang trống.
            </div>
          ) : (
            <div style={{
              background: '#fafafa',
              borderRadius: 10,
              padding: 0,
            }}>
              {cartItems.map(item => {

                return (
                  <div key={item.productId + '-' + item.sizeId} 
                       className={`cart-item ${loadingId === (item.productId + '-' + item.sizeId) ? 'loading-item' : ''}`}
                       style={{
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    alignItems: isMobile ? 'flex-start' : 'center',
                    padding: isMobile ? '16px' : '18px 24px',
                    borderRadius: 10,
                    background: '#fafafa',
                    marginBottom: 0,
                    gap: isMobile ? 12 : 0
                  }}>
                    {/* Mobile: Delete button at top-right */}
                    {isMobile && (
                      <div style={{ alignSelf: 'flex-end' }}>
                        <Button
                          type="text"
                          icon={loadingId === (item.productId + '-' + item.sizeId) ? <Spin size="small" /> : <CloseOutlined />}
                          style={{ color: '#888' }}
                          onClick={() => handleDeleteItem(item.productId, item.sizeId)}
                          disabled={loadingId === (item.productId + '-' + item.sizeId) || loadingAll}
                        />
                      </div>
                    )}
                    
                    {/* Desktop: Delete button at left */}
                    {!isMobile && (
                      <Button
                        className="delete-button"
                        type="text"
                        icon={loadingId === (item.productId + '-' + item.sizeId) ? <Spin size="small" /> : <CloseOutlined />}
                        style={{ marginRight: 16, color: '#888' }}
                        onClick={() => handleDeleteItem(item.productId, item.sizeId)}
                        disabled={loadingId === (item.productId + '-' + item.sizeId) || loadingAll}
                      />
                    )}
                    
                    {/* Product Image and Info */}
                    <div className="cart-item-info" style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 16,
                      flex: isMobile ? 'none' : 1,
                      width: isMobile ? '100%' : 'auto'
                    }}>
                      <Image
                        className="cart-item-image"
                        src={item.productImage}
                        alt={item.productName}
                        width={isMobile ? 80 : 60}
                        height={isMobile ? 80 : 60}
                        style={{
                          objectFit: 'contain',
                          borderRadius: 8,
                          background: '#fff',
                        }}
                        preview={false}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ 
                          fontWeight: 600, 
                          fontSize: isMobile ? 16 : 16,
                          lineHeight: 1.4
                        }}>
                          {item.productName}
                        </div>
                        <div style={{ 
                          color: '#888', 
                          fontSize: isMobile ? 14 : 13, 
                          marginTop: 4,
                          display: 'flex',
                          flexDirection: isMobile ? 'column' : 'row',
                          gap: isMobile ? 4 : 12
                        }}>
                          <span>{Number(item.price).toLocaleString('vi-VN')} ₫</span>
                          {item.sizeId && (
                            <span style={{ color: '#222', fontWeight: 500 }}>
                              Size: {getSizeName(item.sizeId)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Quantity Controls and Total */}
                    <div className="cart-item-controls" style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: isMobile ? 'space-between' : 'flex-end',
                      width: isMobile ? '100%' : 'auto',
                      gap: isMobile ? 16 : 32
                    }}>
                      {/* Quantity Controls */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        background: 'transparent',
                        borderRadius: 8,
                        border: 'none',
                        padding: '2px 10px',
                        minWidth: 90,
                        justifyContent: 'center'
                      }}>
                        <Button
                          className="quantity-button"
                          type="text"
                          style={{ 
                            fontSize: 18, 
                            minWidth: 28, 
                            height: 28, 
                            color: '#222' 
                          }}
                          onClick={() => handleQuantityChange(item.productId, item.sizeId, -1)}
                          disabled={loadingId === (item.productId + '-' + item.sizeId) || loadingAll}
                        >-</Button>
                        <span style={{
                          minWidth: 24,
                          textAlign: 'center',
                          fontWeight: 500,
                          fontSize: 16
                        }}>{item.quantity}</span>
                        <Button
                          className="quantity-button"
                          type="text"
                          style={{ 
                            fontSize: 18, 
                            minWidth: 28, 
                            height: 28, 
                            color: '#222' 
                          }}
                          onClick={() => handleQuantityChange(item.productId, item.sizeId, 1)}
                          disabled={loadingId === (item.productId + '-' + item.sizeId) || loadingAll}
                        >+</Button>
                      </div>
                      
                      {/* Total Price */}
                      <div style={{
                        fontWeight: 700,
                        fontSize: isMobile ? 16 : 18,
                        minWidth: isMobile ? 80 : 120,
                        textAlign: 'right'
                      }}>
                        {(Number(item.price) * item.quantity).toLocaleString('vi-VN')} ₫
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      {/* Order Summary */}
      {cartItems.length > 0 && (
        <div className="order-summary" style={{
          flex: isMobile ? 'none' : 1,
          width: isMobile ? '100%' : 'auto',
          minWidth: isMobile ? 'auto' : 260,
          marginTop: isMobile ? 24 : 16,
          position: isMobile ? 'sticky' : 'static',
          bottom: isMobile ? 0 : 'auto',
          background: isMobile ? '#fff' : 'transparent',
          padding: isMobile ? '16px 0' : 0,
          borderTop: isMobile ? '1px solid #eee' : 'none'
        }}>
          <div style={{ 
            fontWeight: 600, 
            fontSize: isMobile ? 18 : 16, 
            marginBottom: 18,
            textAlign: isMobile ? 'center' : 'left'
          }}>
            Tổng kết đơn hàng
          </div>
          <div style={{
            background: '#fff',
            borderRadius: 10,
            padding: '18px 0 0 0',
            border: 'none'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: 10,
              fontSize: isMobile ? 16 : 15
            }}>
              <span>Tạm tính</span>
              <span style={{ fontWeight: 600 }}>{subTotal.toLocaleString('vi-VN')} ₫</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: 10,
              fontSize: isMobile ? 16 : 15
            }}>
              <span>Phí vận chuyển</span>
              <span style={{ fontWeight: 600 }}>{deliveryFee.toLocaleString('vi-VN')} ₫</span>
            </div>
            <div style={{
              borderTop: '1px solid #eee',
              margin: '16px 0 12px 0'
            }} />
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontWeight: 700,
              fontSize: isMobile ? 20 : 18
            }}>
              <span>Tổng cộng</span>
              <span>{total.toLocaleString('vi-VN')} ₫</span>
            </div>
            <Button
              className="checkout-button"
              type="primary"
              style={{
                width: '100%',
                marginTop: 24,
                background: '#111',
                borderColor: '#111',
                fontWeight: 600,
                height: isMobile ? 48 : 40,
                fontSize: isMobile ? 16 : 14
              }}
              size="large"
              onClick={() => navigate('/checkout')}
              disabled={loadingAll}
            >
              Tiến hành thanh toán
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cartpage;