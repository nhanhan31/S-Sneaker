import React, { useEffect, useState } from "react";
import { Typography, Spin, Button } from "antd";
import { getProvinces, getDistricts, getWards } from "../../utils/ghnApi";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const UserContent = () => {
    const [provinceList, setProvinceList] = useState([]);
    const [districtList, setDistrictList] = useState([]);
    const [wardList, setWardList] = useState([]);
    const [loading, setLoading] = useState(true);

    // Lấy user từ localStorage
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const token = localStorage.getItem("token"); // Thêm dòng này
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLocation = async () => {
            setLoading(true);
            // Lấy danh sách tỉnh
            const provinceRes = await getProvinces();
            if (provinceRes.ok && Array.isArray(provinceRes.data.data)) {
                setProvinceList(provinceRes.data.data);
                // Nếu user có province, lấy district
                if (user?.province) {
                    const districtRes = await getDistricts(Number(user.province));
                    if (districtRes.ok && Array.isArray(districtRes.data.data)) {
                        setDistrictList(districtRes.data.data);
                        // Nếu user có district, lấy ward
                        if (user?.district) {
                            const wardRes = await getWards(Number(user.district));
                            if (wardRes.ok && Array.isArray(wardRes.data.data)) {
                                setWardList(wardRes.data.data);
                            }
                        }
                    }
                }
            }
            setLoading(false);
        };
        fetchLocation();
    }, [user?.province, user?.district]);

    // Hàm lấy tên từ code
    const getProvinceName = (code) =>
        provinceList.find(p => String(p.ProvinceID) === String(code))?.ProvinceName || code;
    const getDistrictName = (code) =>
        districtList.find(d => String(d.DistrictID) === String(code))?.DistrictName || code;
    const getWardName = (code) =>
        wardList.find(w => String(w.WardCode) === String(code))?.WardName || code;

    return (
        <Spin spinning={loading}>
            <div style={{ borderBottom: "1px solid #eee", marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Title level={3} style={{ margin: 0, color: "rgb(0, 0, 0)", fontWeight: 700, fontSize: 32 }}>
                    Quản lý tài khoản
                </Title>
                <Button
                    type="primary"
                    style={{ background: "#111", borderColor: "#111", fontWeight: 600 }}
                    onClick={() => navigate("/user/edit-info")}
                >
                    Chỉnh sửa thông tin
                </Button>
            </div>
            <div style={{ marginBottom: 24, fontSize: 18 }}>
                {user?.email && (
                    <>
                        <Text strong style={{ fontSize: 18 }}>Email :</Text> <Text style={{ fontSize: 18 }}>{user.email}</Text>
                        <br />
                    </>
                )}
            </div>
            <Title level={4} style={{ fontWeight: 700, marginBottom: 24, fontSize: 24 }}>
                {[user?.firstName, user?.lastName].filter(Boolean).join(" ")}
            </Title>
            <div style={{ display: "flex", gap: 64 }}>
                <div style={{ minWidth: 220, fontSize: 18 }}>
                    {user?.firstName && user?.lastName && (
                        <div style={{ marginBottom: 16 }}>
                            <Text type="secondary" style={{ fontSize: 18 }}>Họ và tên</Text>
                            <div style={{ fontSize: 18 }}>{user.firstName} {user.lastName}</div>
                        </div>
                    )}
                    {user?.phoneNumber && (
                        <div style={{ marginBottom: 16 }}>
                            <Text type="secondary" style={{ fontSize: 18 }}>Số điện thoại</Text>
                            <div style={{ fontSize: 18 }}>{user.phoneNumber}</div>
                        </div>
                    )}
                    {user?.bankName && (
                        <div style={{ marginBottom: 16 }}>
                            <Text type="secondary" style={{ fontSize: 18 }}>Ngân hàng</Text>
                            <div style={{ fontSize: 18 }}>{user.bankName}</div>
                        </div>
                    )}
                    {user?.bankAccountNumber && (
                        <div style={{ marginBottom: 16 }}>
                            <Text type="secondary" style={{ fontSize: 18 }}>Số tài khoản</Text>
                            <div style={{ fontSize: 18 }}>{user.bankAccountNumber}</div>
                        </div>
                    )}
                </div>
                <div style={{ minWidth: 220, fontSize: 18 }}>
                    {user?.address && (
                        <div style={{ marginBottom: 16 }}>
                            <Text type="secondary" style={{ fontSize: 18 }}>Địa chỉ</Text>
                            <div style={{ fontSize: 18 }}>{user.address}</div>
                        </div>
                    )}
                    {user?.province && (
                        <div style={{ marginBottom: 16 }}>
                            <Text type="secondary" style={{ fontSize: 18 }}>Tỉnh/Thành phố</Text>
                            <div style={{ fontSize: 18 }}>{getProvinceName(user.province)}</div>
                        </div>
                    )}
                    {user?.district && (
                        <div style={{ marginBottom: 16 }}>
                            <Text type="secondary" style={{ fontSize: 18 }}>Quận/Huyện</Text>
                            <div style={{ fontSize: 18 }}>{getDistrictName(user.district)}</div>
                        </div>
                    )}
                    {user?.wardCode && (
                        <div style={{ marginBottom: 16 }}>
                            <Text type="secondary" style={{ fontSize: 18 }}>Phường/Xã</Text>
                            <div style={{ fontSize: 18 }}>{getWardName(user.wardCode)}</div>
                        </div>
                    )}
                </div>
            </div>
        </Spin>
    );
};

export default UserContent;