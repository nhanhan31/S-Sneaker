import React, { useEffect, useState } from "react";
import { Checkbox, Button, ConfigProvider, message, Select, Modal } from "antd";
import { deleteFavoriteByProductId, deleteAllFavoriteByUserId } from "../../utils/favoriteApi";
import { addProductToCart } from "../../utils/cartApi";
import "./Favoritepage.css";

const Favoritepage = () => {
    const [favorites, setFavorites] = useState([]);
    const [selected, setSelected] = useState([]);
    const [sizeModal, setSizeModal] = useState({ open: false, product: null });
    const [selectedSizes, setSelectedSizes] = useState({}); // { [productId]: sizeId }

    // Lấy shoesData từ localStorage
    const shoesData = React.useMemo(() => {
        try {
            return JSON.parse(localStorage.getItem('shoesData') || '[]');
        } catch {
            return [];
        }
    }, []);

    useEffect(() => {
        const favIds = JSON.parse(sessionStorage.getItem("favorites") || "[]");
        setFavorites(favIds);
        setSelected([]);
    }, []);

    const favoriteShoes = shoesData.filter(item => favorites.includes(item.productId));

    const handleCheck = (id, checked) => {
        if (checked) {
            setSelected(prev => [...prev, id]);
        } else {
            setSelected(prev => prev.filter(i => i !== id));
        }
    };

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const token = localStorage.getItem("token");

    const handleDelete = async () => {
        const favIds = JSON.parse(sessionStorage.getItem("favorites") || "[]");
        let newFavs = favIds;

        if (selected.length === favorites.length && favorites.length > 0) {
            const result = await deleteAllFavoriteByUserId({ userId: user.userId, token });
            if (result.ok) {
                newFavs = [];
                message.success("Đã xoá toàn bộ yêu thích!");
            } else {
                message.error(result.data.message || "Xoá thất bại!");
                return;
            }
        } else {
            for (let id of selected) {
                const result = await deleteFavoriteByProductId({ userId: user.userId, productId: id, token });
                if (!result.ok) {
                    message.error(result.data.message || "Xoá thất bại!");
                    return;
                }
            }
            newFavs = favIds.filter(id => !selected.includes(id));
            message.success("Đã xoá sản phẩm khỏi yêu thích!");
        }

        setFavorites(newFavs);
        setSelected([]);
        sessionStorage.setItem("favorites", JSON.stringify(newFavs));
    };

    // Thêm hàm chọn size cho từng sản phẩm
    const handleAddToCart = async () => {
        if (!user?.userId || !token) {
            message.error("Bạn cần đăng nhập!");
            return;
        }
        // Kiểm tra đã chọn size cho từng sản phẩm chưa
        for (const id of selected) {
            const shoe = shoesData.find(s => s.productId === id);
            if (!shoe) continue;
            const batchDetails = shoe.batchDetails || [];
            if (!selectedSizes[id]) {
                // Nếu chưa chọn size, mở modal chọn size
                setSizeModal({ open: true, product: shoe });
                return;
            }
            const result = await addProductToCart({
                userId: user.userId,
                productId: id,
                sizeId: selectedSizes[id],
                quantity: 1,
                token
            });
            if (!result.ok) {
                message.error(result.data.message || "Thêm vào giỏ hàng thất bại!");
                return;
            }
        }
        // Nếu tất cả đều ok, cập nhật cart
        let cart = JSON.parse(sessionStorage.getItem("cart") || "[]");
        for (const id of selected) {
            const sizeId = selectedSizes[id];
            const idx = cart.findIndex(item => item.id === id && item.sizeId === sizeId);
            if (idx > -1) {
                cart[idx].quantity += 1;
            } else {
                cart.push({ id, sizeId, quantity: 1 });
            }
        }
        sessionStorage.setItem("cart", JSON.stringify(cart));
        window.dispatchEvent(new Event("cartChanged"));
        message.success("Đã thêm vào giỏ hàng!");
        setSelected([]);
    };

    // Xử lý chọn size trong modal
    const handleSelectSize = (sizeId) => {
        if (sizeModal.product) {
            setSelectedSizes(prev => ({
                ...prev,
                [sizeModal.product.productId]: sizeId
            }));
        }
    };

    const handleConfirmSize = () => {
        setSizeModal({ open: false, product: null });
    };

    return (
        <div style={{ padding: 32, background: "#fff", minHeight: "100vh" }}>
            <h2 style={{ fontWeight: 700, marginBottom: 32 }}>Sản phẩm yêu thích</h2>
            {favoriteShoes.length > 0 && (
                <div style={{ marginBottom: 10 }}>
                    <ConfigProvider
                        theme={{
                            token: {
                                colorPrimary: 'rgb(0, 0, 0)',
                                colorPrimaryHover: 'rgba(46, 46, 46, 0.88)',
                                colorPrimaryBorder: 'rgba(48, 48, 48, 0.88)',
                            },
                        }}
                    >
                        <Checkbox
                            style={{ fontSize: 16, fontWeight: 600 }}
                            checked={selected.length === favoriteShoes.length && favoriteShoes.length > 0}
                            onChange={e => {
                                if (e.target.checked) {
                                    setSelected(favoriteShoes.map(item => item.productId));
                                } else {
                                    setSelected([]);
                                }
                            }}
                        >
                            Chọn tất cả
                        </Checkbox>
                    </ConfigProvider>
                </div>
            )}
            {favoriteShoes.length === 0 && (
                <div style={{ color: "#888", textAlign: "center", padding: 40 }}>Chưa có sản phẩm yêu thích nào.</div>
            )}
            <div style={{
                background: '#fafafa',
                borderRadius: 10,
            }}>
                {favoriteShoes.map(item => (
                    <div
                        key={item.productId}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            background: "#fafafa",
                            borderRadius: 10,
                            padding: "10px 24px",
                        }}
                    >
                        <ConfigProvider
                            theme={{
                                token: {
                                    colorPrimary: 'rgb(0, 0, 0)',
                                    colorPrimaryHover: 'rgba(46, 46, 46, 0.88)',
                                    colorPrimaryBorder: 'rgba(48, 48, 48, 0.88)',
                                },
                            }}
                        >
                            <Checkbox
                                checked={selected.includes(item.productId)}
                                onChange={e => handleCheck(item.productId, e.target.checked)}
                                style={{ marginRight: 24, marginLeft: 8 }}
                            />
                        </ConfigProvider>
                        <img
                            src={item.productImage}
                            alt={item.productName}
                            style={{
                                width: 80,
                                height: 80,
                                objectFit: "contain",
                                borderRadius: 8,
                                background: "#fff",
                                marginRight: 24,
                            }}
                        />
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 600, fontSize: 18 }}>{item.productName}</div>
                            <div style={{ color: "#888", fontSize: 14, marginTop: 2 }}>{item.code || ""}</div>
                            {/* Chọn size cho từng sản phẩm */}
                            {selected.includes(item.productId) && (
                                <div style={{ marginTop: 8 }}>
                                    <Select
                                        placeholder="Chọn size"
                                        style={{ width: 120 }}
                                        value={selectedSizes[item.productId]}
                                        onChange={sizeId => setSelectedSizes(prev => ({
                                            ...prev,
                                            [item.productId]: sizeId
                                        }))}
                                    >
                                        {(item.batchDetails || []).map(b => (
                                            <Select.Option key={b.sizeId} value={b.sizeId}>
                                                {b.sizes.sizeNumber}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </div>
                            )}
                        </div>
                        <div style={{ fontWeight: 700, fontSize: 20, minWidth: 120, textAlign: "right" }}>
                            {Number(item.price).toLocaleString("vi-VN")} ₫
                        </div>
                    </div>
                ))}
            </div>
            <div style={{ marginTop: 20 }}>
                {selected.length > 0 && (
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button
                            type="primary"
                            style={{
                                background: "#111",
                                borderColor: "#111",
                                fontWeight: 600,
                                minWidth: 140,
                                height: 40,
                                marginRight: 16,
                            }}
                            size="large"
                            onClick={handleDelete}
                        >
                            Xóa
                        </Button>
                        <Button
                            type="primary"
                            style={{
                                background: "#111",
                                borderColor: "#111",
                                fontWeight: 600,
                                minWidth: 140,
                                height: 40,
                            }}
                            size="large"
                            onClick={handleAddToCart}
                        >
                            Thêm vào giỏ
                        </Button>
                    </div>
                )}
            </div>
            {/* Modal chọn size nếu chưa chọn */}
            <Modal
                open={sizeModal.open}
                title="Vui lòng chọn size trước khi thêm vào giỏ hàng"
                onOk={handleConfirmSize}
                onCancel={() => setSizeModal({ open: false, product: null })}
                okText="Xác nhận"
                cancelText="Đóng"
                destroyOnClose
            >
                {sizeModal.product && (
                    <Select
                        placeholder="Chọn size"
                        style={{ width: 180 }}
                        value={selectedSizes[sizeModal.product.productId]}
                        onChange={sizeId => setSelectedSizes(prev => ({
                            ...prev,
                            [sizeModal.product.productId]: sizeId
                        }))}
                    >
                        {(sizeModal.product.batchDetails || []).map(b => (
                            <Select.Option key={b.sizeId} value={b.sizeId}>
                                {b.sizes.sizeNumber}
                            </Select.Option>
                        ))}
                    </Select>
                )}
            </Modal>
        </div>
    );
};

export default Favoritepage;