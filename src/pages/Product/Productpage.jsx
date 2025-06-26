import React, { useState, useEffect, useMemo } from 'react';
import { Row, Col, Card, Checkbox, Slider, Pagination, Button, Input, ConfigProvider, message, Spin } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import './Productpage.css';
import Search from 'antd/es/input/Search';
import { IoOptionsOutline } from "react-icons/io5";
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import { addProductToFavorite, deleteFavoriteByProductId } from "../../utils/favoriteApi";
import { fetchAllProducts } from "../../utils/productApi"; // Sử dụng API
import { payosReturn } from "../../utils/payosApi";
import { deleteOrderByCode } from "../../utils/orderApi";

const brands = ['Nike', 'Jordan', 'Adidas', 'Puma', 'Timberland'];
const categories = ['Sneakers', 'Boots', 'Sandals', 'Loafers'];
const sizes = [35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46];

const PAGE_SIZE = 9;

const Productpage = () => {
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const [selectedBrands, setSelectedBrands] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('selectedBrands') || '[]');
        } catch {
            return [];
        }
    });
    const [selectedCategories, setSelectedCategories] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('selectedCategories') || '[]');
        } catch {
            return [];
        }
    });
    const [selectedSizes, setSelectedSizes] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('selectedSizes') || '[]');
        } catch {
            return [];
        }
    });
    const [priceRange, setPriceRange] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('priceRange') || '[0,6000000]');
        } catch {
            return [0, 6000000];
        }
    });
    const [currentPage, setCurrentPage] = useState(() => {
        try {
            return Number(localStorage.getItem('currentPage')) || 1;
        } catch {
            return 1;
        }
    });
    const [search, setSearch] = useState(() => {
        try {
            return localStorage.getItem('search') || '';
        } catch {
            return '';
        }
    });
    const [favorites, setFavorites] = useState(() => {
        try {
            return JSON.parse(sessionStorage.getItem('favorites') || '[]');
        } catch {
            return [];
        }
    });
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const location = useLocation();
    const type = location.state?.type;

    // Lấy data giày từ API mỗi lần vào trang
    useEffect(() => {
        setLoading(true);
        fetchAllProducts().then((data) => {
            setProducts(Array.isArray(data) ? data : []);
            setLoading(false);
        });
    }, []);

    // Lọc theo type từ state trước (loại bỏ 'newarrival' khỏi type, dùng isArrivals)
    let typeFilteredProducts = products;
    if (type === 'newarrival') {
        typeFilteredProducts = products.filter(item => item.isArrivals);
    } else if (type === 'men') {
        typeFilteredProducts = products.filter(item => item.gender === 'male');
    } else if (type === 'women') {
        typeFilteredProducts = products.filter(item => item.gender === 'female');
    } else if (type === 'kid') {
        typeFilteredProducts = products.filter(item => item.gender === 'kid');
    }

    // Lọc sản phẩm theo filter và search
    const filteredProducts = typeFilteredProducts.filter((item) => {
        // Category filter
        if (selectedCategories.length && !selectedCategories.includes(item.category?.categoryName)) return false;
        // Search filter
        if (search && !item.productName.toLowerCase().includes(search.toLowerCase())) return false;
        // Brand filter
        if (selectedBrands.length && !selectedBrands.includes(item.brand?.brandName)) return false;
        // Size filter
        const itemSizes = item.batchDetails?.map(b => Number(b.sizes.sizeNumber)) || [];
        if (selectedSizes.length && !itemSizes.some(size => selectedSizes.includes(size))) return false;
        // Price filter
        if (Number(item.price) < priceRange[0] || Number(item.price) > priceRange[1]) return false;
        return true;
    });

    // Phân trang
    const pagedProducts = filteredProducts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    // Cập nhật favorites khi vào trang (nếu có thay đổi ở tab khác)
    React.useEffect(() => {
        const syncFavorites = () => {
            setFavorites(JSON.parse(sessionStorage.getItem('favorites') || '[]'));
        };
        window.addEventListener('storage', syncFavorites);
        return () => window.removeEventListener('storage', syncFavorites);
    }, []);

    // Xử lý chọn size
    const handleSizeClick = (size) => {
        setCurrentPage(1);
        setSelectedSizes((prev) =>
            prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
        );
    };

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const token = localStorage.getItem("token");

    // Xử lý click trái tim
    const handleFavorite = async (id) => {
        if (!user?.userId || !token) {
            message.error("Bạn cần đăng nhập!");
            navigate("/login");
            return;
        }
        let fav = [...favorites];
        let newFav;
        if (fav.includes(id)) {
            // Đã có trong favorite, gọi API xoá
            const result = await deleteFavoriteByProductId({ userId: user.userId, productId: id, token });
            if (result.ok) {
                newFav = fav.filter(fid => fid !== id);
                setFavorites(newFav);
                sessionStorage.setItem('favorites', JSON.stringify(newFav));
                message.success("Đã xoá khỏi yêu thích!");
            } else {
                message.error(result.data.message || "Thao tác thất bại!");
            }
        } else {
            // Chưa có, gọi API thêm
            const result = await addProductToFavorite({ userId: user.userId, productId: id, token });
            if (result.ok) {
                newFav = [...fav, id];
                setFavorites(newFav);
                sessionStorage.setItem('favorites', JSON.stringify(newFav));
                message.success("Đã thêm vào yêu thích!");
            } else {
                message.error(result.data.message || "Thao tác thất bại!");
            }
        }
    };

    // Lưu filter vào localStorage mỗi khi thay đổi
    useEffect(() => {
        localStorage.setItem('selectedBrands', JSON.stringify(selectedBrands));
    }, [selectedBrands]);
    useEffect(() => {
        localStorage.setItem('selectedCategories', JSON.stringify(selectedCategories));
    }, [selectedCategories]);
    useEffect(() => {
        localStorage.setItem('selectedSizes', JSON.stringify(selectedSizes));
    }, [selectedSizes]);
    useEffect(() => {
        localStorage.setItem('priceRange', JSON.stringify(priceRange));
    }, [priceRange]);
    useEffect(() => {
        localStorage.setItem('currentPage', currentPage);
    }, [currentPage]);
    useEffect(() => {
        localStorage.setItem('search', search);
    }, [search]);

    // Xử lý payment-cancel
    useEffect(() => {
        if (location.pathname === "/payment-cancel") {
            const params = new URLSearchParams(location.search);
            const status = params.get("status");
            const orderCode = params.get("orderCode");
            if (status && orderCode) {
                // Xử lý hủy thanh toán và xóa order
                const handleCancelPayment = async () => {
                    try {
                        // Gọi API xử lý trạng thái thanh toán
                        await payosReturn({ status, orderCode, token });
                        
                        // Gọi API xóa order
                        const deleteResult = await deleteOrderByCode(orderCode);
                        
                        if (deleteResult.ok) {
                            message.info("Đã hủy thanh toán và xóa đơn hàng");
                        } else {
                            message.warning("Đã hủy thanh toán nhưng không thể xóa đơn hàng");
                        }
                        
                        sessionStorage.removeItem("cart");
                        navigate("/");
                        
                    } catch (error) {
                        console.error("Error handling payment cancel:", error);
                        message.error("Không thể xử lý việc hủy thanh toán!");
                    }
                };
                
                handleCancelPayment();
            }
        }
        // Xử lý payment-success
        if (location.pathname === "/payment-success") {
            const params = new URLSearchParams(location.search);
            const status = params.get("status");
            const orderCode = params.get("orderCode");
            if (status && orderCode) {
                payosReturn({ status, orderCode, token })
                    .then(res => {
                        message.success("Thanh toán thành công!");
                        sessionStorage.removeItem("cart");
                        navigate("/user/order");
                    })
                    .catch(() => {
                        message.error("Không thể xác nhận thanh toán!");
                    });
            }
        }
    }, [location, token, navigate]);

    return (
        <div style={{ background: 'linear-gradient(90deg, #f8fafc 60%, #e3e3e3 100%)', padding: '30px', minHeight: '100vh' }}>
            <Row gutter={32} style={{ maxWidth: 1500, margin: '0 auto' }}>
                {/* Sidebar */}
                {sidebarVisible && (
                    <Col xs={24} sm={24} md={5} lg={5}>
                        <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 16px #f3f3f3' }}>
                            {/* Search box */}
                            <Search
                                placeholder="Tìm kiếm sản phẩm..."
                                value={search}
                                onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
                                style={{ marginBottom: 24, borderRadius: 8 }}
                                allowClear
                            />
                            {/* Category filter */}
                            <div style={{ fontWeight: 700, marginBottom: 16 }}>Danh mục</div>
                            <Checkbox.Group
                                value={selectedCategories}
                                onChange={list => { setSelectedCategories(list); setCurrentPage(1); }}
                                style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}
                            >
                                {categories.map(c => (
                                    <ConfigProvider
                                        theme={{
                                            token: {
                                                colorPrimary: 'rgb(0, 0, 0)',
                                                colorPrimaryHover: 'rgba(46, 46, 46, 0.88)',
                                                colorPrimaryBorder: 'rgba(48, 48, 48, 0.88)',
                                            },
                                        }}
                                    >
                                        <Checkbox key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</Checkbox>
                                    </ConfigProvider>
                                ))}
                            </Checkbox.Group>
                            
                            <div style={{ fontWeight: 700, marginBottom: 16 }}>Thương hiệu</div>
                            <Checkbox.Group
                                value={selectedBrands}
                                onChange={list => { setSelectedBrands(list); setCurrentPage(1); }}
                                style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}
                            >
                                {brands.map(b => (
                                    <ConfigProvider
                                        theme={{
                                            token: {
                                                colorPrimary: 'rgb(0, 0, 0)',
                                                colorPrimaryHover: 'rgba(46, 46, 46, 0.88)',
                                                colorPrimaryBorder: 'rgba(48, 48, 48, 0.88)',
                                            },
                                        }}
                                    >
                                        <Checkbox key={b} value={b}>{b}</Checkbox>
                                    </ConfigProvider>

                                ))}
                            </Checkbox.Group>
                            <div style={{ fontWeight: 700, marginBottom: 8 }}>Khoảng giá</div>
                            <Slider
                                range
                                min={0}
                                max={6000000}
                                step={100000}
                                value={priceRange}
                                onChange={v => { setPriceRange(v); setCurrentPage(1); }}
                                tipFormatter={v => `${v / 1000000}M`}
                                style={{ marginBottom: 24 }}
                            />
                            <div style={{ fontWeight: 700, marginBottom: 8 }}>Kích cỡ</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'flex-start' }}>
                                {sizes.map(size => (
                                    <Button
                                        key={size}
                                        size="large"
                                        style={{
                                            borderRadius: 6,
                                            minWidth: 36,
                                            background: selectedSizes.includes(size) ? 'rgb(0, 0, 0)' : ' #fafbfc',
                                            color: selectedSizes.includes(size) ? '#fff' : '#222',
                                            border: selectedSizes.includes(size) ? '1.5px solid rgb(0, 0, 0)' : '1px solid #e0e0e0',
                                            transition: 'all 0.2s',
                                        }}
                                        onClick={() => handleSizeClick(size)}
                                        onMouseOver={e => {
                                            if (!selectedSizes.includes(size)) {
                                                e.currentTarget.style.background = ' #e6e6e6';
                                            } else {
                                                e.currentTarget.style.background = 'rgb(51, 51, 51)';
                                            }
                                        }}
                                        onMouseOut={e => {
                                            if (!selectedSizes.includes(size)) {
                                                e.currentTarget.style.background = ' #fafbfc';
                                            } else {
                                                e.currentTarget.style.background = 'rgb(0, 0, 0)';
                                            }
                                        }}
                                    >
                                        {size}
                                    </Button>
                                ))}
                            </div>
                            <Button
                                type="default"
                                style={{
                                    width: '100%',
                                    marginTop: 20,
                                    fontWeight: 600,
                                    borderRadius: 8,
                                    borderColor: '#bbb'
                                }}
                                onClick={() => {
                                    setSelectedBrands([]);
                                    setSelectedCategories([]);
                                    setSelectedSizes([]);
                                    setPriceRange([2000000, 4000000]);
                                    setSearch('');
                                    setCurrentPage(1);
                                    localStorage.removeItem('selectedBrands');
                                    localStorage.removeItem('selectedCategories');
                                    localStorage.removeItem('selectedSizes');
                                    localStorage.removeItem('priceRange');
                                    localStorage.removeItem('search');
                                    localStorage.removeItem('currentPage');
                                }}
                            >
                                Xóa bộ lọc
                            </Button>
                        </div>
                    </Col>
                )}
                {/* Main content */}
                <Col xs={24} sm={24} md={sidebarVisible ? 19 : 24} lg={sidebarVisible ? 19 : 24}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ marginBottom: 24, fontWeight: 700, fontSize: 22 }}>
                            {type === 'men' && 'Giày Nam'}
                            {type === 'women' && 'Giày Nữ'}
                            {type === 'kid' && 'Giày Trẻ Em'}
                            {type === 'newarrival' && 'Sản phẩm mới'}
                            {type === 'all' && 'Tất cả sản phẩm'}
                        </div>
                        <IoOptionsOutline
                            style={{ fontSize: 25, cursor: 'pointer' }}
                            onClick={() => setSidebarVisible(v => !v)}
                        />
                    </div>
                    {loading ? (
                        <div style={{ width: "100%", textAlign: "center", padding: "80px 0" }}>
                            <Spin size="large" tip="Đang tải sản phẩm..." />
                        </div>
                    ) : (
                        <>
                            <Row gutter={[24, 24]}>
                                {pagedProducts.length === 0 && (
                                    <Col span={24} style={{ textAlign: 'center', color: '#888', padding: 40 }}>
                                        Không tìm thấy sản phẩm nào.
                                    </Col>
                                )}
                                {pagedProducts.map((item, idx) => (
                                    <Col xs={24} sm={12} md={8} lg={8} key={item.productId}>
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
                                                    <span
                                                        key="fav"
                                                        style={{
                                                            position: 'absolute',
                                                            top: 12,
                                                            right: 12,
                                                            color: favorites.includes(item.productId) ? '#e1306c' : '#bbb',
                                                            fontSize: 22,
                                                            background: 'transparent',
                                                            borderRadius: '50%',
                                                            zIndex: 2,
                                                            cursor: 'pointer'
                                                        }}
                                                        onClick={e => {
                                                            e.stopPropagation();
                                                            handleFavorite(item.productId);
                                                        }}
                                                    >
                                                        {favorites.includes(item.productId)
                                                            ? <HeartFilled />
                                                            : <HeartOutlined />}
                                                    </span>
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
                            <div style={{ marginTop: 32, textAlign: 'center' }}>
                                {filteredProducts.length > PAGE_SIZE && (
                                    <Pagination
                                        style={{ display: 'flex', justifyContent: 'center' }}
                                        current={currentPage}
                                        total={filteredProducts.length}
                                        pageSize={PAGE_SIZE}
                                        onChange={page => setCurrentPage(page)}
                                    />
                                )}
                            </div>
                        </>
                    )}
                </Col>
            </Row>
            
        </div>
    );
};

export default Productpage;

