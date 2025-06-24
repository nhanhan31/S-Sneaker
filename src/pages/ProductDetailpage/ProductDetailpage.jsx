import React, { useState, useEffect, useRef } from "react";
import { Button, Image, message } from "antd";
import { HeartFilled, HeartOutlined, LeftOutlined, RightOutlined, DownOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { addProductToFavorite, deleteFavoriteByProductId } from "../../utils/favoriteApi";
import { addProductToCart } from "../../utils/cartApi";
import "./ProductDetailpage.css"; // Thêm dòng này để import CSS custom

const ProductDetailpage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Lấy shoesData từ localStorage
  const shoesData = React.useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('shoesData') || '[]');
    } catch {
      return [];
    }
  }, []);

  // SỬA: tìm theo productId từ shoesData lấy từ localStorage
  const product = shoesData.find(item => item.productId === Number(id)) || {};

  // SỬA: lấy mảng ảnh từ productDetailImg và thêm productImage vào đầu mảng (nếu có)
  const images = product.productImage
    ? [product.productImage, ...(product.productDetailImg || [])]
    : product.productDetailImg || [];

  const [mainImg, setMainImg] = useState(product.productImage);
  const [imgIdx, setImgIdx] = useState(0);
  const [descOpen, setDescOpen] = useState(false);
  // SỬA: Lưu selectedSize là object { sizeNumber, sizeId }
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const autoSlideRef = useRef();

  // Lấy user, token, favorites từ local/session
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");
  const [favorites, setFavorites] = useState(() =>
    JSON.parse(sessionStorage.getItem("favorites") || "[]")
  );

  // SỬA: cập nhật lại mainImg, isFavorite khi đổi sản phẩm
  useEffect(() => {
    setMainImg(product.productImage);
    setImgIdx(0);
    setIsFavorite(favorites.includes(product.productId));
  }, [product?.productId]);

  // Tự động chuyển ảnh mỗi 3 giây nếu có nhiều hơn 1 ảnh
  useEffect(() => {
    // Xoá interval cũ nếu có
    if (autoSlideRef.current) clearInterval(autoSlideRef.current);

    if (images.length > 1) {
      autoSlideRef.current = setInterval(() => {
        setImgIdx(prevIdx => {
          const nextIdx = (prevIdx + 1) % images.length;
          setMainImg(images[nextIdx]);
          return nextIdx;
        });
      }, 3000);
    }

    // Cleanup khi unmount hoặc đổi images
    return () => {
      if (autoSlideRef.current) clearInterval(autoSlideRef.current);
    };
  }, [images]);

  // Xử lý thêm/xoá yêu thích giống Productpage
  const handleFavorite = async (productId) => {
    if (!user?.userId || !token) {
      message.error("Bạn cần đăng nhập!");
      navigate("/login");
      return;
    }
    let fav = [...favorites];
    let newFav;
    if (fav.includes(productId)) {
      // Đã có trong favorite, gọi API xoá
      const result = await deleteFavoriteByProductId({ userId: user.userId, productId, token });
      if (result.ok) {
        newFav = fav.filter(fid => fid !== productId);
        setIsFavorite(false);
        setFavorites(newFav);
        sessionStorage.setItem("favorites", JSON.stringify(newFav));
        message.success("Đã xoá khỏi yêu thích!");
      } else {
        message.error(result.data.message || "Thao tác thất bại!");
      }
    } else {
      // Chưa có, gọi API thêm
      const result = await addProductToFavorite({ userId: user.userId, productId, token });
      if (result.ok) {
        newFav = [...fav, productId];
        setIsFavorite(true);
        setFavorites(newFav);
        sessionStorage.setItem("favorites", JSON.stringify(newFav));
        message.success("Đã thêm vào yêu thích!");
      } else {
        message.error(result.data.message || "Thao tác thất bại!");
      }
    }
  };

  // Xử lý thêm vào giỏ hàng
  const handleAddToCart = async (productId, quantity) => {
    if (!user?.userId || !token) {
      message.error("Bạn cần đăng nhập!");
      navigate("/login");
      return;
    }
    if (!selectedSize) {
      message.error("Vui lòng chọn size!");
      return;
    }
    const sizeId = selectedSize.sizeId;

    const result = await addProductToCart({
      userId: user.userId,
      productId,
      sizeId,
      quantity,
      token
    });
    if (result.ok) {
      // Cập nhật sessionStorage: lưu cả id, sizeId, quantity
      let cart = JSON.parse(sessionStorage.getItem("cart") || "[]");
      const idx = cart.findIndex(item => item.id === productId && item.sizeId === sizeId);
      if (idx > -1) {
        cart[idx].quantity += quantity;
      } else {
        cart.push({ id: productId, sizeId, quantity });
      }
      sessionStorage.setItem("cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("cartChanged"));
      message.success("Đã thêm vào giỏ hàng!");
    } else {
      message.error(result.data.message || "Thêm vào giỏ hàng thất bại!");
    }
  };

  // Lấy danh sách size từ batchDetails
  const sizeOptions = product.batchDetails
    ? product.batchDetails.map(b => ({
        sizeNumber: Number(b.sizes.sizeNumber),
        sizeId: b.sizeId
      }))
    : [];

  const sizes = product.batchDetails ? product.batchDetails.map(b => Number(b.sizes.sizeNumber)) : [];

  const handlePrev = () => {
    if (!images.length) return;
    const newIdx = (imgIdx - 1 + images.length) % images.length;
    setImgIdx(newIdx);
    setMainImg(images[newIdx]);
  };

  const handleNext = () => {
    if (!images.length) return;
    const newIdx = (imgIdx + 1) % images.length;
    setImgIdx(newIdx);
    setMainImg(images[newIdx]);
  };

  return (
    <div
      style={{
        display: 'flex',
        background: '#fff',
        padding: '30px',
        fontFamily: 'Inter, Arial, sans-serif'
      }}
    >
      {/* Ảnh sản phẩm */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          minWidth: 0,
        }}
      >
        <Button
          type="text"
          style={{
            position: 'absolute',
            left: 24,
            top: 24,
            minWidth: 32,
            height: 32,
            borderRadius: '50%',
            background: '#fff',
            boxShadow: '0 2px 8px #eee',
            zIndex: 2,
            padding: 0,
            opacity: 0.5,
          }}
          onClick={() => navigate(-1)}
          icon={<LeftOutlined />}
        />
        <div
          style={{
            width: '100%',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgb(240, 240, 240)',
            borderRadius: 18,
            boxShadow: '0 2px 16px #f3f3f3',
            marginBottom: 32,
          }}
        >
          <Button
            type="text"
            style={{
              position: 'absolute',
              left: 10,
              top: '50%',
              transform: 'translateY(-50%)',
              minWidth: 32,
              height: 32,
              borderRadius: '50%',
              background: '#fff',
              boxShadow: '0 2px 8px #eee',
              zIndex: 2,
              opacity: 0.5,
            }}
            onClick={handlePrev}
            icon={<LeftOutlined />}
          />
          <Image
            src={mainImg}
            alt={product.productName}
            style={{
              width: '100%',
              
              objectFit: 'contain',
              display: 'block',
              margin: '0 auto',
              transition: 'box-shadow 0.3s, transform 0.3s',
              borderRadius: 16,
              boxShadow: '0 4px 24px #e0e0e0',
              background: '#fff',
            }}
          />
          <Button
            type="text"
            style={{
              position: 'absolute',
              right: 10,
              top: '50%',
              transform: 'translateY(-50%)',
              minWidth: 32,
              height: 32,
              borderRadius: '50%',
              background: '#fff',
              boxShadow: '0 2px 8px #eee',
              zIndex: 2,
              opacity: 0.5,
            }}
            onClick={handleNext}
            icon={<RightOutlined />}
          />
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: '8%',
            display: 'flex',
            gap: 18,
            marginTop: 0,
            justifyContent: 'center',
            width: '100%',
            maxWidth: 600,
          }}
        >
          {images.map((img, idx) => (
            <div
              key={idx}
              style={{
                border: mainImg === img && imgIdx === idx ? '2px solid rgb(185, 185, 185)' : '1px solid rgb(219, 219, 219)',
                borderRadius: 12,
                background: mainImg === img && imgIdx === idx ? '#f5faff' : '#fff',
                cursor: 'pointer',
                boxShadow: mainImg === img && imgIdx === idx ? '0 2px 8px #e0f0ff' : 'none',
                transition: 'border 0.1s, background 0.2s',
                width: '100%',
                height: '100%',
                maxWidth: 60,
                maxHeight: 60,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onClick={() => {
                setMainImg(img);
                setImgIdx(idx);
              }}
            >
              <Image
                preview={false}
                src={img}
                alt=""
                style={{
                  width: '100%',
                  height: '100%',
                  maxWidth: 80,
                  maxHeight: 80,
                  objectFit: 'contain',
                  display: 'block',
                  borderRadius: 12,
                  background: '#fff',
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Thông tin sản phẩm */}
      <div style={{
        flex: 1,
        background: '#fff',
        padding: '48px 40px 48px 32px',
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        minWidth: 420,
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ marginBottom: 8, fontWeight: 700, fontSize: 28 }}>{product.productName}</h2>
            <div style={{ color: '#888', marginBottom: 8, fontSize: 15 }}>{Number(product.price).toLocaleString('vi-VN')} ₫</div>
          </div>
          <span
            onClick={e => {
              e.stopPropagation();
              handleFavorite(product.productId);
            }}
            style={{
              cursor: "pointer" ,
              color: favorites.includes(product.productId) ? "#e1306c" : "#bbb",
              fontSize: 28,
              marginTop: 8,
              transition: 'color 0.2s'
            }}
          >
            {favorites.includes(product.productId) ? <HeartFilled /> : <HeartOutlined />}
          </span>
        </div>
        <div>
          <div
            style={{
              fontWeight: 600,
              marginBottom: 8,
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              userSelect: 'none'
            }}
            onClick={() => setDescOpen(open => !open)}
          >
            Description
            <DownOutlined style={{
              marginLeft: 4,
              transition: '0.2s',
              transform: descOpen ? 'rotate(180deg)' : 'rotate(0deg)'
            }} />
          </div>
          {descOpen && (
            <div style={{ color: '#444', marginBottom: 16, fontSize: 15, lineHeight: 1.7 }}>
              {product.description}
            </div>
          )}
        </div>
        <div>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>Select size</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {Array.from({ length: 46 - 32 + 1 }, (_, i) => i + 32).map(size => {
              const found = sizeOptions.find(opt => opt.sizeNumber === size);
              return (
                <Button
                  key={size}
                  size="large"
                  disabled={!found}
                  style={{
                    borderRadius: 6,
                    minWidth: 36,
                    background: selectedSize?.sizeNumber === size
                      ? '#222'
                      : found
                        ? '#fff'
                        : '#fafbfc',
                    color: selectedSize?.sizeNumber === size
                      ? '#fff'
                      : found
                        ? '#222'
                        : '#bbb',
                    border: selectedSize?.sizeNumber === size
                      ? '1px solid #222'
                      : '1px solid #e0e0e0',
                    opacity: found ? 1 : 0.5,
                    fontWeight: 500,
                    transition: 'all 0.2s',
                  }}
                  onClick={() => found && setSelectedSize(found)}
                >
                  {size}
                </Button>
              );
            })}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 8 }}>
          <Button onClick={() => setQuantity(q => Math.max(1, q - 1))} style={{ minWidth: 36, fontSize: 18 }}>-</Button>
          <span style={{ minWidth: 24, textAlign: 'center', fontSize: 16 }}>{quantity}</span>
          <Button onClick={() => setQuantity(q => q + 1)} style={{ minWidth: 36, fontSize: 18 }}>+</Button>
          <Button
            type="primary"
            style={{
              marginLeft: 24,
              background: '#111',
              borderColor: '#111',
              fontWeight: 600,
              minWidth: 120,
              height: 40
            }}
            onClick={() => handleAddToCart(product.productId, quantity)}
          >
            Add to cart
          </Button>
          <Button
            style={{
              marginLeft: 8,
              background: '#fff',
              border: '1px solid #111',
              color: '#111',
              fontWeight: 600,
              minWidth: 80,
              height: 40
            }}
            onClick={() => {
              if (user?.userId) {
                navigate('/cart');
              } else {
                message.error("Bạn cần đăng nhập!");
              }
            }}
          >
            View Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailpage;