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

const Cartpage = () => {
  const [cart, setCart] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [loadingAll, setLoadingAll] = useState(false);
  const [sizes, setSizes] = useState([]);
  const navigate = useNavigate();

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
        message.success("Đã xoá sản phẩm khỏi giỏ hàng!");
      } else {
        message.error(result.data.message || "Xoá thất bại!");
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
      message.success("Đã xoá sản phẩm khỏi giỏ hàng!");
    } else {
      message.error(result.data.message || "Xoá thất bại!");
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
      message.success("Đã xoá toàn bộ giỏ hàng!");
    } else {
      message.error(result.data.message || "Xoá thất bại!");
    }
  };

  return (
    <div style={{
      display: 'flex',
      gap: 48,
      alignItems: 'flex-start',
      padding: '32px 24px 0 24px',
      minHeight: '70vh',
      background: '#fff'
    }}>
      {/* Cart List */}
      <div style={{ flex: 2 }}>
        <h3 style={{ fontWeight: 600, fontSize: 18, marginBottom: 18 }}>Your shopping cart</h3>
        {cartItems.length > 0 && (
          <Button
            type="default"
            style={{
              marginBottom: 16,
              borderRadius: 8,
              borderColor: '#bbb',
              fontWeight: 600,
              background: '#fff'
            }}
            loading={loadingAll}
            onClick={handleClearCart}
          >
            Clear cart
          </Button>
        )}
        <div style={{
          background: '#fff',
          borderRadius: 10,
          padding: 0,
          minHeight: 80
        }}>
          {cartItems.length === 0 ? (
            <div style={{ color: '#888', textAlign: 'center', padding: 40 }}>Your cart is empty.</div>
          ) : (
            <div style={{
              background: '#fafafa',
              borderRadius: 10,
              padding: 0,
            }}>
              {cartItems.map(item => {

                return (
                  <div key={item.productId + '-' + item.sizeId} style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '18px 24px',
                    borderRadius: 10,
                    background: '#fafafa',
                    marginBottom: 0
                  }}>
                    <Button
                      type="text"
                      icon={loadingId === (item.productId + '-' + item.sizeId) ? <Spin size="small" /> : <CloseOutlined />}
                      style={{ marginRight: 16, color: '#888' }}
                      onClick={() => handleDeleteItem(item.productId, item.sizeId)}
                      disabled={loadingId === (item.productId + '-' + item.sizeId) || loadingAll}
                    />
                    <Image
                      src={item.productImage}
                      alt={item.productName}
                      width={60}
                      height={60}
                      style={{
                        objectFit: 'contain',
                        borderRadius: 8,
                        background: '#fff',
                      }}
                      preview={false}
                    />
                    <div style={{ flex: 1, marginLeft: 16 }}>
                      <div style={{ fontWeight: 600, fontSize: 16 }}>{item.productName}</div>
                      <div style={{ color: '#888', fontSize: 13, marginTop: 2 }}>
                        {Number(item.price).toLocaleString('vi-VN')} ₫
                        {item.sizeId && (
                          <span style={{ marginLeft: 12, color: '#222', fontWeight: 500 }}>
                            Size: {getSizeName(item.sizeId)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      background: '#fff',
                      borderRadius: 8,
                      border: '1px solid #eee',
                      padding: '2px 10px',
                      minWidth: 90,
                      justifyContent: 'center'
                    }}>
                      <Button
                        type="text"
                        style={{ fontSize: 18, minWidth: 28, height: 28, color: '#222' }}
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
                        type="text"
                        style={{ fontSize: 18, minWidth: 28, height: 28, color: '#222' }}
                        onClick={() => handleQuantityChange(item.productId, item.sizeId, 1)}
                        disabled={loadingId === (item.productId + '-' + item.sizeId) || loadingAll}
                      >+</Button>
                    </div>
                    <div style={{
                      fontWeight: 700,
                      fontSize: 18,
                      marginLeft: 32,
                      minWidth: 120,
                      textAlign: 'right'
                    }}>
                      {(Number(item.price) * item.quantity).toLocaleString('vi-VN')} ₫
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
        <div style={{
          flex: 1,
          minWidth: 260,
          marginTop: 16
        }}>
          <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 18 }}>Order summary</div>
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
              fontSize: 15
            }}>
              <span>Sub total</span>
              <span style={{ fontWeight: 600 }}>{subTotal.toLocaleString('vi-VN')} ₫</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: 10,
              fontSize: 15
            }}>
              <span>Delivery fee</span>
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
              fontSize: 18
            }}>
              <span></span>
              <span>{total.toLocaleString('vi-VN')} ₫</span>
            </div>
            <Button
              type="primary"
              style={{
                width: '100%',
                marginTop: 24,
                background: '#111',
                borderColor: '#111',
                fontWeight: 600,
                height: 40
              }}
              size="large"
              onClick={() => navigate('/checkout')}
              disabled={loadingAll}
            >
              Proceed to checkout
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cartpage;