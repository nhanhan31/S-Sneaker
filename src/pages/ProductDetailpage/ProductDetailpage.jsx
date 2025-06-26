import React, { useState, useEffect, useRef } from "react";
import { Button, Image, message, Spin } from "antd";
import { HeartFilled, HeartOutlined, LeftOutlined, RightOutlined, DownOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { addProductToFavorite, deleteFavoriteByProductId } from "../../utils/favoriteApi";
import { addProductToCart } from "../../utils/cartApi";
import { fetchProductByIdWithQuantity } from "../../utils/productApi"; // Thêm dòng này
import { parseImageArray } from '../../utils/imageUtils';
import "./ProductDetailpage.css";

const ProductDetailpage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Lấy user, token, favorites từ local/session
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");
  const [favorites, setFavorites] = useState(() =>
    JSON.parse(sessionStorage.getItem("favorites") || "[]")
  );

  // Lấy chi tiết sản phẩm từ API
  useEffect(() => {
    setLoading(true);
    fetchProductByIdWithQuantity(id).then((data) => {
      setProduct(data);
      setLoading(false);
    });
  }, [id]);

  // SỬA: Sử dụng utility function
  const detailImages = parseImageArray(product?.productDetailImg);
  const images = product?.productImage
    ? [product.productImage, ...detailImages]
    : detailImages;

  const [mainImg, setMainImg] = useState(product?.productImage);
  const [imgIdx, setImgIdx] = useState(0);
  const [descOpen, setDescOpen] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const autoSlideRef = useRef();

  // Cập nhật lại mainImg, isFavorite khi đổi sản phẩm
  useEffect(() => {
    setMainImg(product?.productImage);
    setImgIdx(0);
    setIsFavorite(product && favorites.includes(product.productId));
  }, [product?.productId, favorites]);

  // Reset quantity khi đổi size
  useEffect(() => {
    setQuantity(1);
  }, [selectedSize?.sizeId]);

  // Tự động chuyển ảnh mỗi 3 giây nếu có nhiều hơn 1 ảnh
  useEffect(() => {
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
    if (selectedSizeQuantity === 0) {
      message.error("Size này đã hết hàng!");
      return;
    }
    if (quantity > selectedSizeQuantity) {
      message.error(`Chỉ còn ${selectedSizeQuantity} sản phẩm cho size này!`);
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
  const sizeOptions = Array.isArray(product?.batchDetails)
    ? product.batchDetails.map(b => ({
        sizeNumber: Number(b.sizes.sizeNumber),
        sizeId: b.sizeId,
        quantity: b.quantity || 0 // Đảm bảo luôn có giá trị quantity
      }))
    : [];

  const sizes = Array.isArray(product?.batchDetails)
    ? product.batchDetails.map(b => Number(b.sizes.sizeNumber))
    : [];

  // Lấy số lượng còn lại của size được chọn
  const selectedSizeQuantity = selectedSize ? (selectedSize.quantity || 0) : 0;
  const isOutOfStock = selectedSizeQuantity === 0;

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

  if (loading || !product) {
    return (
      <div style={{ minHeight: 400, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Spin size="large" tip="Đang tải sản phẩm..." />
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        background: 'linear-gradient(90deg, #f8fafc 60%, #e3e3e3 100%)',
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
              maxWidth: 600,
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
        background: 'linear-gradient(90deg, #f8fafc 60%, #e3e3e3 100%)',
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
            Mô tả sản phẩm
            <DownOutlined 
            style={{
              marginLeft: 4,
              transition: '0.2s',
              transform: descOpen ? 'rotate(180deg)' : 'rotate(0deg)'
            }} />
          </div>
          {descOpen && (
            <div style={{ color: '#444', marginBottom: 16, fontSize: 15, lineHeight: 1.7 }}>
              {product.description
                .split('✔️')
                .map((part, index) => (
                  index === 0 ? part : (
                    <span key={index}>
                      <br />- {part}
                    </span>
                  )
                ))
              }
            </div>
          )}
        </div>
        <div>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>
            Chọn kích cỡ
            {selectedSize && (
              <span style={{ 
                marginLeft: 8, 
                fontSize: 14, 
                color:'rgb(136, 136, 136)',
                fontWeight: 400 
              }}>
                ({selectedSizeQuantity} sản phẩm còn lại)
              </span>
            )}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {Array.from({ length: 46 - 35 + 1 }, (_, i) => i + 35).map(size => {
              const found = sizeOptions.find(opt => opt.sizeNumber === size);
              const isOutOfStockForSize = found && found.quantity === 0;
              return (
                <Button
                  key={size}
                  size="large"
                  disabled={!found || isOutOfStockForSize}
                  style={{
                    borderRadius: 6,
                    minWidth: 36,
                    background: selectedSize?.sizeNumber === size
                      ? isOutOfStockForSize
                        ? '#ff4d4f'
                        : '#222'
                      : found
                        ? isOutOfStockForSize
                          ? '#fff2f0'
                          : '#fff'
                        : '#fafbfc',
                    color: selectedSize?.sizeNumber === size
                      ? '#fff'
                      : found
                        ? isOutOfStockForSize
                          ? '#ff4d4f'
                          : '#222'
                        : '#bbb',
                    border: selectedSize?.sizeNumber === size
                      ? isOutOfStockForSize
                        ? '1px solid #ff4d4f'
                        : '1px solid #222'
                      : isOutOfStockForSize
                        ? '1px solid #ffccc7'
                        : '1px solid #e0e0e0',
                    opacity: found ? 1 : 0.5,
                    fontWeight: 500,
                    transition: 'all 0.2s',
                    position: 'relative',
                  }}
                  onClick={() => found && !isOutOfStockForSize && setSelectedSize(found)}
                >
                  {size}
                  {isOutOfStockForSize && (
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      fontSize: 10,
                      color: '#ff4d4f',
                      fontWeight: 400,
                      marginTop: 8,
                      whiteSpace: 'nowrap'
                    }}>
                      Hết
                    </div>
                  )}
                </Button>
              );
            })}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 8 }}>
          <Button 
            onClick={() => setQuantity(q => Math.max(1, q - 1))} 
            style={{ minWidth: 36, fontSize: 18 }}
          >
            -
          </Button>
          <span style={{ minWidth: 24, textAlign: 'center', fontSize: 16 }}>{quantity}</span>
          <Button 
            onClick={() => setQuantity(q => selectedSizeQuantity > 0 ? Math.min(selectedSizeQuantity, q + 1) : q + 1)} 
            disabled={selectedSizeQuantity > 0 && quantity >= selectedSizeQuantity}
            style={{ minWidth: 36, fontSize: 18 }}
          >
            +
          </Button>
          <Button
            type="primary"
            disabled={isOutOfStock || !selectedSize}
            style={{
              marginLeft: 24,
              background: isOutOfStock || !selectedSize ? '#d9d9d9' : '#111',
              borderColor: isOutOfStock || !selectedSize ? '#d9d9d9' : '#111',
              color: isOutOfStock || !selectedSize ? '#fff' : '#fff',
              fontWeight: 600,
              minWidth: 120,
              height: 40
            }}
            onClick={() => handleAddToCart(product.productId, quantity)}
          >
            {!selectedSize 
              ? 'Chọn size' 
              : isOutOfStock 
                ? 'Hết hàng' 
                : 'Thêm vào giỏ'}
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
            Xem giỏ hàng
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailpage;