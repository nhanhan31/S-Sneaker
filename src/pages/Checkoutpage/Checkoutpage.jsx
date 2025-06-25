import React, { useState, useEffect } from "react";
import { Input, Checkbox, Select, Button, Divider, Form, message, Spin, Modal, ConfigProvider } from "antd";
import { useLocation } from "react-router-dom";
import axios from "axios";
// XÓA DÒNG NÀY: import shoesData from "../../components/shoesData";
import { createNewOrder } from "../../utils/orderApi";
import { getUserDetail, updateUser } from "../../utils/userApi";
import { getProvinces, getDistricts, getWards } from "../../utils/ghnApi";
import { payosReturn } from "../../utils/payosApi";
import "./Checkoutpage.css";

const { Option } = Select;

const Checkoutpage = () => {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const [form] = Form.useForm();
    const [provinceList, setProvinceList] = useState([]);
    const [districtList, setDistrictList] = useState([]);
    const [wardList, setWardList] = useState([]);
    const [provinceId, setProvinceId] = useState(null);
    const [districtId, setDistrictId] = useState(null);
    const [wardId, setWardId] = useState(null);
    const [wardCode, setWardCode] = useState(null);
    const [initialUserInfo, setInitialUserInfo] = useState({});
    const [isChanged, setIsChanged] = useState(false);

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const token = localStorage.getItem("token");
    const location = useLocation();

    // Lấy shoesData từ localStorage thay vì import file js
    const shoesData = React.useMemo(() => {
        try {
            return JSON.parse(localStorage.getItem('shoesData') || '[]');
        } catch {
            return [];
        }
    }, []);

    useEffect(() => {
        const cartData = JSON.parse(sessionStorage.getItem("cart") || "[]");
        const cartWithDetail = cartData.map(item => {
            const detail = shoesData.find(s => s.productId === item.id);
            return detail
                ? {
                    ...item,
                    productId: detail.productId,
                    productName: detail.productName,
                    productImage: detail.productImage,
                    price: Number(detail.price),
                }
                : item;
        });
        setCart(cartWithDetail);
    }, [shoesData]);

    // Lấy thông tin user và điền vào form
    useEffect(() => {
        const fetchUser = async () => {
            if (!user?.userId || !token) return;
            setFormLoading(true); // Bắt đầu loading
            const res = await getUserDetail(user.userId, token);
            if (res.ok && res.data && res.data.user) {
                const u = res.data.user;
                const info = {
                    firstName: u.firstName,
                    lastName: u.lastName,
                    phoneNumber: u.phoneNumber,
                    address: u.address,
                    wardCode: u.wardCode ? String(u.wardCode) : undefined,
                    district: Number(u.district) || undefined,
                    province: Number(u.province) || undefined,
                };
                setInitialUserInfo(info);
                form.setFieldsValue({
                    contact: u.email,
                    ...info,
                });
                setProvinceId(Number(u.province) || null);
                setDistrictId(Number(u.district) || null);
                setWardId(Number(u.wardCode) || null);
                setWardCode(u.wardCode ? String(u.wardCode) : null);
            } else {
                message.error("Không lấy được thông tin người dùng!");
            }
            setFormLoading(false); // Kết thúc loading
        };
        fetchUser();
    }, [user?.userId, token, form]);

    // Khi lấy provinces
    useEffect(() => {
        getProvinces().then(res => {
            if (res.ok && Array.isArray(res.data.data)) {
                setProvinceList(res.data.data);

                // Nếu user đã có provinceId thì set luôn và gọi API lấy district
                if (user?.province) {
                    const provinceNum = Number(user.province);
                    setProvinceId(provinceNum);
                    form.setFieldsValue({ province: provinceNum });
                    getDistricts(provinceNum).then(res2 => {
                        if (res2.ok && Array.isArray(res2.data.data)) {
                            setDistrictList(res2.data.data);
                            if (user?.district) {
                                const districtNum = Number(user.district);
                                setDistrictId(districtNum);
                                form.setFieldsValue({ district: districtNum });
                                getWards(districtNum).then(res3 => {
                                    if (res3.ok && Array.isArray(res3.data.data)) {
                                        setWardList(res3.data.data);
                                        // Đảm bảo wardCode là string nếu value của Select.Option là string
                                        if (user?.wardCode) {
                                            form.setFieldsValue({ wardCode: String(user.wardCode) });
                                            setWardCode(String(user.wardCode));
                                        }
                                    }
                                });
                            }
                        }
                    });
                }
            }
        });
    }, []);

    // Khi chọn province
    const handleProvinceChange = (value) => {
        const id = Number(value);
        setProvinceId(id);
        form.setFieldsValue({ province: id, district: undefined, wardCode: undefined });
        setDistrictList([]);
        setWardList([]);
        setDistrictId(null);
        setFormLoading(true);
        getDistricts(id).then(res => {
            if (res.ok && Array.isArray(res.data.data)) {
                setDistrictList(res.data.data);
            }
            setFormLoading(false);
        }).catch(() => setFormLoading(false));
    };

    // Khi chọn district
    const handleDistrictChange = (value) => {
        const id = Number(value);
        setDistrictId(id);
        form.setFieldsValue({ district: id, wardCode: undefined });
        setWardList([]);
        setFormLoading(true);
        getWards(id).then(res => {
            if (res.ok && Array.isArray(res.data.data)) {
                setWardList(res.data.data);
                // Nếu user đã có wardCode và district trùng, set lại ward
                if (user?.wardCode && id === Number(user.district)) {
                    form.setFieldsValue({ wardCode: String(user.wardCode) });
                    setWardCode(String(user.wardCode));
                }
            }
            setFormLoading(false);
        }).catch(() => setFormLoading(false));
    };

    const handleCheckout = async () => {
        try {
            // Xác thực tất cả trường bắt buộc
            const values = await form.validateFields([
                "firstName",
                "lastName",
                "phoneNumber",
                "address",
                "province",
                "district",
                "wardCode"
            ]);
            // Kiểm tra số điện thoại Việt Nam (10 số, bắt đầu bằng 0)
            const phoneRegex = /^(0[0-9]{9})$/;
            if (!phoneRegex.test(values.phoneNumber)) {
                message.error("Vui lòng nhập số điện thoại hợp lệ!");
                return;
            }
            if (!user?.userId || !token) {
                alert("Bạn cần đăng nhập!");
                return;
            }
            setLoading(true);
            const result = await createNewOrder({
                userId: user.userId,
                token,
                promotionId: null
            });
            setLoading(false);
            if (result.ok && result.data.paymentUrl) {
                window.location.href = result.data.paymentUrl;
            } else {
                alert(result.data.errMessage || "Đặt hàng thất bại, vui lòng thử lại sau!");
            }
        } catch (err) {
            // Nếu validateFields lỗi sẽ vào đây
            message.error("Vui lòng điền đầy đủ và đúng thông tin giao hàng!");
        }
    };

    const handleSaveInfo = (checked) => {
        if (checked) {
            Modal.confirm({
                title: "Xác nhận lưu thông tin?",
                content: "Bạn có chắc muốn lưu thông tin giao hàng này cho lần sau?",
                okText: "Có",
                cancelText: "Không",
                onOk: async () => {
                    // Lấy đúng trường từ form
                    const userInfo = form.getFieldsValue([
                        "firstName",
                        "lastName",
                        "phoneNumber",
                        "address",
                        "wardCode",
                        "district",
                        "province"
                    ]);
                    try {
                        // Gửi lên backend với trường wardCode
                        await updateUser(user.userId, { ...userInfo }, token);
                        // Cập nhật lại user trong localStorage
                        const userLocal = JSON.parse(localStorage.getItem("user") || "{}");
                        localStorage.setItem("user", JSON.stringify({
                            ...userLocal,
                            ...userInfo
                        }));
                        // Sau khi lưu thành công
                        message.success("Đã lưu thông tin giao hàng!");
                        form.setFieldsValue({ saveInfo: false });
                        setIsChanged(false); // Nếu bạn dùng isChanged để điều khiển disabled
                        form.resetFields(['saveInfo']); // Đảm bảo checkbox bỏ check
                    } catch {
                        message.error("Lưu thông tin thất bại!");
                    }
                },
                onCancel: () => {
                    // Nếu không xác nhận thì bỏ check
                    form.setFieldsValue({ saveInfo: false });
                }
            });
        }
    };

    // Lấy thông tin user từ form
    const userInfo = form.getFieldsValue([
        "firstName",
        "lastName",
        "phoneNumber",
        "address",
        "wardCode",
        "district",
        "province"
    ]);

    useEffect(() => {
        const unsubscribe = form.subscribe?.(() => {
            const current = form.getFieldsValue([
                "firstName",
                "lastName",
                "phoneNumber",
                "address",
                "wardCode",
                "district",
                "province"
            ]);
            // So sánh từng trường
            const changed = Object.keys(initialUserInfo).some(
                key => current[key] !== initialUserInfo[key]
            );
            setIsChanged(changed);
        });
        return unsubscribe;
    }, [form, initialUserInfo]);

    // Hàm lấy tên phường từ code
    const getWardName = (wardCode) => {
        const found = wardList.find(w => String(w.WardCode) === String(wardCode));
        return found ? found.WardName : wardCode;
    };

    useEffect(() => {
        if (location.pathname === "/payment-cancel") {
            const params = new URLSearchParams(location.search);
            const status = params.get("status");
            const orderCode = params.get("orderCode");
            if (status && orderCode) {
                payosReturn({ status, orderCode, token })
                    .then(res => {
                        message.info("Đã huỷ thanh toán" );
                    })
                    .catch(() => {
                        message.error("Không thể xử lý trạng thái thanh toán!");
                    });
                    sessionStorage.removeItem("cart"); 
            }
        }
    }, [location]);

    return (
        <div style={{ display: "flex", gap: 32, padding: 32, background: "#fff", minHeight: "70vh" }}>
            {/* Left: Form */}
            <div style={{ flex: 2, maxWidth: 800 }}>
                <Spin spinning={formLoading}>
                    <Form
                        layout="vertical"
                        form={form}
                        onValuesChange={() => {
                            const current = form.getFieldsValue([
                                "firstName",
                                "lastName",
                                "phoneNumber", // Đổi từ phone -> phoneNumber
                                "address",
                                "wardCode",
                                "district",
                                "province"
                            ]);
                            const changed = Object.keys(initialUserInfo).some(
                                key => current[key] !== initialUserInfo[key]
                            );
                            setIsChanged(changed);
                        }}
                    >
                        <h2 style={{ fontWeight: 700 }}>Liên hệ</h2>
                        <Form.Item name="contact" rules={[{ required: true, message: "Vui lòng nhập email hoặc số điện thoại" }]}>
                            <Input
                                placeholder="Email hoặc số điện thoại"
                                size="large"
                                style={{ background: "#fff" }}
                                disabled
                            />
                        </Form.Item>

                        <h2 style={{ fontWeight: 700 }}>Giao hàng</h2>
                        <div style={{ display: "flex", gap: 8 }}>
                            <Form.Item name="firstName" style={{ flex: 1 }}>
                                <Input placeholder="Tên (không bắt buộc)" size="large" style={{ background: "#fff" }} />
                            </Form.Item>
                            <Form.Item name="lastName" style={{ flex: 1 }}>
                                <Input placeholder="Họ" size="large" style={{ background: "#fff" }} />
                            </Form.Item>
                        </div>
                        <Form.Item name="phoneNumber">
                            <Input placeholder="Số điện thoại" size="large" style={{ background: "#fff" }} />
                        </Form.Item>
                        <Form.Item name="address">
                            <Input placeholder="Địa chỉ" size="large" style={{ background: "#fff" }} />
                        </Form.Item>
                        <Form.Item name="province" label="Tỉnh/Thành phố" rules={[{ required: true, message: "Chọn tỉnh/thành phố" }]}>
                            <Select
                                showSearch
                                placeholder="Chọn tỉnh/thành phố"
                                onChange={handleProvinceChange}
                                loading={provinceList.length === 0}
                                value={provinceId || undefined}
                                optionFilterProp="children"
                            >
                                {provinceList.map(item => (
                                    <Select.Option key={item.ProvinceID} value={item.ProvinceID}>
                                        {item.ProvinceName}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item name="district" label="Quận/Huyện" rules={[{ required: true, message: "Chọn quận/huyện" }]}>
                            <Select
                                showSearch
                                placeholder="Chọn quận/huyện"
                                onChange={handleDistrictChange}
                                loading={provinceId && districtList.length === 0}
                                value={districtId}
                                disabled={!provinceId}
                                optionFilterProp="children"
                            >
                               
                                {districtList.map(item => (
                                    <Select.Option key={item.DistrictID} value={item.DistrictID}>
                                        {item.DistrictName}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item name="wardCode" label="Phường/Xã" rules={[{ required: true, message: "Chọn phường/xã" }]}>
                            <Select
                                showSearch
                                placeholder="Chọn phường/xã"
                                loading={districtId && wardList.length === 0}
                                disabled={!districtId}
                                value={wardCode || undefined}
                                optionFilterProp="children"
                                onChange={value => setWardCode(value)}
                            >
                                
                                {wardList.map(item => (
                                    <Select.Option key={item.WardCode} value={String(item.WardCode)}>
                                        {item.WardName}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <div>
                         
                        </div>
                        <Form.Item name="saveInfo" valuePropName="checked" style={{ marginBottom: 24 }}>
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
                                    onChange={e => handleSaveInfo(e.target.checked)}
                                    disabled={!isChanged}
                                >
                                    Lưu thông tin này cho lần sau
                                </Checkbox>
                            </ConfigProvider>

                        </Form.Item>

                    </Form>
                </Spin>
            </div>

            {/* Right: Order summary */}
            <div style={{ flex: 1, minWidth: 440 }}>
                {/* Danh sách sản phẩm trong cart */}
                <div style={{ background: "#fafafa", borderRadius: 8, padding: 24, marginBottom: 24 }}>
                    {cart.map((item, idx) => (
                        <div key={item.productId} style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 16,
                            marginBottom: 16
                        }}>
                            {item.productImage && (
                                <img
                                    src={item.productImage}
                                    alt={item.productName}
                                    style={{ width: 60, height: 60, objectFit: "contain", borderRadius: 8, background: "#fff" }}
                                />
                            )}
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 600 }}>{item.productName}</div>
                                <div style={{ color: "#888", fontSize: 13 }}>{Number(item.price).toLocaleString('vi-VN')} ₫</div>
                            </div>
                            <div style={{
                                display: "flex",
                                alignItems: "center",
                                border: "none",
                                borderRadius: 8,
                                background: "#fafafa",
                                minWidth: 90,
                                justifyContent: "center",
                                padding: "0 12px"
                            }}>
                                <span style={{
                                    minWidth: 24,
                                    textAlign: "center",
                                    fontWeight: 500,
                                    fontSize: 16
                                }}>{item.quantity}</span>
                            </div>
                            <div style={{ fontWeight: 700, fontSize: 18, minWidth: 80, textAlign: "right" }}>
                                {(Number(item.price) * item.quantity).toLocaleString("vi-VN")} ₫
                            </div>
                        </div>
                    ))}
                </div>
                {/* Tổng kết đơn hàng */}
                <div style={{ background: "#fff", borderRadius: 8, padding: 24, width: "60%", position: "relative", float: "right" }}>
                    <div style={{ marginBottom: 12 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, marginBottom: 10 }}>
                            <span>Tạm tính</span>
                            <span style={{ fontWeight: 600 }}>
                                {cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0).toLocaleString("vi-VN")} ₫
                            </span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, marginBottom: 10 }}>
                            <span>Phí vận chuyển</span>
                            <span style={{ fontWeight: 600 }}>0 ₫</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15 }}>
                            <span>Tổng phụ</span>
                            <span style={{ fontWeight: 600 }}>
                                {cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0).toLocaleString("vi-VN")} ₫
                            </span>
                        </div>
                    </div>
                    <Divider />
                    <div style={{ display: "flex", justifyContent: "flex-end", fontWeight: 700, fontSize: 20, marginBottom: 16 }}>
                        {cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0).toLocaleString("vi-VN")} ₫
                    </div>
                    <Button
                        type="primary"
                        style={{
                            width: "100%",
                            background: "#111",
                            borderColor: "#111",
                            fontWeight: 600,
                            height: 40
                        }}
                        size="large"
                        loading={loading}
                        onClick={handleCheckout}
                    >
                        Mua ngay
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Checkoutpage;