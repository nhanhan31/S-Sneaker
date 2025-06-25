import React, { useEffect, useState } from "react";
import { Table, Typography, Spin, Tag, Collapse, Image } from "antd";
import { getOrdersByUserId } from "../../utils/orderApi";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;
const { Panel } = Collapse;

const OrderPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            console.log("Call getOrdersByUserId", user.userId, token);
            const data = await getOrdersByUserId(user.userId, token);
            setOrders(data);
            setLoading(false);
        };
        if (user?.userId && token) fetchOrders();
    }, [user?.userId, token]);

    const columns = [
        {
            title: "Mã đơn hàng",
            dataIndex: "orderCode",
            key: "orderCode",
        },
        {
            title: "Ngày đặt",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (date) => new Date(date).toLocaleString(),
        },
        {
            title: "Tổng tiền",
            dataIndex: "totalPrice",
            key: "totalPrice",
            render: (total) => `${Number(total).toLocaleString("vi-VN")} ₫`,
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (status, record) => (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Tag
                        style={{
                            border: "1px solid #222",
                            background: "rgb(36, 36, 36)",
                            color: "#fff",
                            fontWeight: 600,
                            borderRadius: 6,
                            padding: "2px 16px",
                            fontSize: 14,
                        }}
                    >
                        {status}
                    </Tag>
                    
                </div>
            ),
        },
        {
            title: "Chi tiết",
            key: "detail",
            render: (_, record) => (
                <Collapse ghost>
                    <Panel header="Xem chi tiết" key="1">
                        {record.orderdetails?.map((item) => (
                            <div key={item.OrderDetailId} style={{ display: "flex", alignItems: "center", marginBottom: 12 }}>
                                <Image
                                    src={item.product?.productImage}
                                    alt={item.product?.productName}
                                    width={60}
                                    height={60}
                                    style={{ objectFit: "cover", borderRadius: 8 }}
                                    preview={false}
                                />
                                <div style={{ flex: 1, marginLeft: 12 }}>
                                    <div style={{ fontWeight: 600 }}>{item.product?.productName}</div>
                                    <div style={{ color: "#888", fontSize: 13 }}>
                                        {item.product?.brand?.brandName} - {item.product?.category?.categoryName}
                                    </div>
                                    <div style={{ fontSize: 13 }}>
                                        Số lượng: {item.quantity} | Đơn giá: {Number(item.unitPrice).toLocaleString("vi-VN")} ₫
                                    </div>
                                </div>
                            </div>
                        ))}
                        {record.status === "Paid" && (
                            <button
                                style={{
                                    background: "#fff",
                                    border: "1px solid #222",
                                    color: "#222",
                                    borderRadius: 6,
                                    padding: "2px 12px",
                                    fontWeight: 600,
                                    cursor: "pointer",
                                    marginTop: 8,
                                }}
                                onClick={() => navigate(`/user/shipping-status/${record.OrderId}`)}
                            >
                                Xem vận chuyển
                            </button>
                        )}
                    </Panel>
                </Collapse>
            ),
        },
    ];

    return (
        <Spin spinning={loading}>
            <div style={{ marginBottom: 24 }}>
                <Title level={3} style={{ fontWeight: 700 }}>Đơn hàng của bạn</Title>
            </div>
            <Table
                columns={columns}
                dataSource={orders}
                rowKey="OrderId"
                pagination={{ pageSize: 8 }}
                locale={{ emptyText: "Không tìm thấy đơn hàng nào" }}
                expandable={false}
            />
        </Spin>
    );
};

export default OrderPage;