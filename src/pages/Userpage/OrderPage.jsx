import React, { useEffect, useState } from "react";
import { Table, Typography, Spin, Tag, Collapse, Image, Button } from "antd";
import { CreditCardOutlined, EyeOutlined } from "@ant-design/icons";
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

    // Function để lấy màu tag theo status
    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending':
                return { backgroundColor: 'rgb(0, 0, 0)', color: 'rgb(255, 255, 255)', borderColor: 'rgb(0, 0, 0)' };
            case 'Paid':
                return { backgroundColor: 'rgb(0, 0, 0)', color: 'rgb(255, 255, 255)', borderColor: 'rgb(0, 0, 0)' };
            case 'Failed':
                return { backgroundColor: 'rgb(0, 0, 0)', color: 'rgb(255, 255, 255)', borderColor: 'rgb(0, 0, 0)' };
            default:
                return { backgroundColor: 'rgb(36, 36, 36)', color: '#fff', borderColor: '#222' };
        }
    };

    // Function để xử lý thanh toán lại
    const handleRetryPayment = (paymentUrl) => {
        if (paymentUrl) {
            window.open(paymentUrl, '_blank');
        }
    };

    const columns = [
        {
            title: "Mã đơn hàng",
            dataIndex: "orderCode",
            key: "orderCode",
            render: (orderCode) => (
                <span style={{ fontWeight: 600, color: "#111" }}>#{orderCode}</span>
            ),
        },
        {
            title: "Ngày đặt",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (date) => (
                <div>
                    <div>{new Date(date).toLocaleDateString('vi-VN')}</div>
                    <div style={{ fontSize: 12, color: "#888" }}>
                        {new Date(date).toLocaleTimeString('vi-VN')}
                    </div>
                </div>
            ),
        },
        {
            title: "Tổng tiền",
            dataIndex: "totalPrice",
            key: "totalPrice",
            render: (total) => (
                <span style={{ fontWeight: 600, color: "#111" }}>
                    {Number(total).toLocaleString("vi-VN")} ₫
                </span>
            ),
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (status, record) => {
                const statusStyle = getStatusColor(status);
                return (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <Tag
                            style={{
                                ...statusStyle,
                                fontWeight: 600,
                                borderRadius: 6,
                                padding: "4px 12px",
                                fontSize: 12,
                                border: `1px solid ${statusStyle.borderColor}`,
                            }}
                        >
                            {status === 'Pending' ? 'Chờ thanh toán' : 
                             status === 'Paid' ? 'Đã thanh toán' : 
                             status === 'Failed' ? 'Thất bại' : status}
                        </Tag>
                        
                        {/* Nút thanh toán lại cho order Pending */}
                        
                    </div>
                );
            },
        },
        {
            title: "Chi tiết",
            key: "detail",
            render: (_, record) => (
                <Collapse ghost>
                    <Panel 
                        header={
                            <span style={{ color: "#1890ff", fontWeight: 500 }}>
                                <EyeOutlined style={{ marginRight: 8 }} />
                                Xem chi tiết
                            </span>
                        } 
                        key="1"
                    >
                        <div style={{ background: "#f9f9f9", padding: "12px", borderRadius: "8px" }}>
                            {record.orderdetails?.map((item, index) => (
                                <div key={item.OrderDetailId} style={{ 
                                    display: "flex", 
                                    alignItems: "center", 
                                    marginBottom: index < record.orderdetails.length - 1 ? 16 : 0,
                                    padding: "8px",
                                    background: "#fff",
                                    borderRadius: "6px",
                                    border: "1px solid #f0f0f0"
                                }}>
                                    <Image
                                        src={item.product?.productImage}
                                        alt={item.product?.productName}
                                        width={60}
                                        height={60}
                                        style={{ objectFit: "cover", borderRadius: 8 }}
                                        preview={false}
                                    />
                                    <div style={{ flex: 1, marginLeft: 12 }}>
                                        <div style={{ fontWeight: 600, marginBottom: 4 }}>
                                            {item.product?.productName}
                                        </div>
                                        <div style={{ color: "#888", fontSize: 13, marginBottom: 4 }}>
                                            {item.product?.brand?.brandName} - {item.product?.category?.categoryName}
                                        </div>
                                        <div style={{ fontSize: 13, display: "flex", gap: 16 }}>
                                            <span>Số lượng: <strong>{item.quantity}</strong></span>
                                            <span>Đơn giá: <strong>{Number(item.unitPrice).toLocaleString("vi-VN")} ₫</strong></span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            
                            {/* Các nút action */}
                            <div style={{ marginTop: 16, display: "flex", gap: 8, flexWrap: "wrap" }}>
                                {record.status === "Paid" && (
                                    <Button
                                        type="default"
                                        icon={<EyeOutlined />}
                                        onClick={() => navigate(`/user/shipping-status/${record.OrderId}`)}
                                        style={{
                                            borderColor: "#222",
                                            color: "#222",
                                            fontWeight: 600,
                                            borderRadius: 6,
                                        }}
                                    >
                                        Xem vận chuyển
                                    </Button>
                                )}
                                
                                {record.status === 'Pending' && record.payments && record.payments[0]?.paymentUrl && (
                                    <Button
                                        type="primary"
                                        icon={<CreditCardOutlined />}
                                        onClick={() => handleRetryPayment(record.payments[0].paymentUrl)}
                                        style={{
                                            background: "rgb(0, 0, 0)",
                                            borderColor: "rgb(0, 0, 0)",
                                            fontWeight: 600,
                                            borderRadius: 6,
                                        }}
                                    >
                                        Thanh toán ngay
                                    </Button>
                                )}
                            </div>
                        </div>
                    </Panel>
                </Collapse>
            ),
        },
    ];

    return (
        <Spin spinning={loading}>
            <div style={{ marginBottom: 24 }}>
                <Title level={3} style={{ fontWeight: 700, color: "#111" }}>
                    Đơn hàng của bạn
                </Title>
                <p style={{ color: "#666", marginTop: 8 }}>
                    Quản lý và theo dõi tất cả đơn hàng của bạn
                </p>
            </div>
            <Table
                columns={columns}
                dataSource={orders}
                rowKey="OrderId"
                pagination={{ 
                    pageSize: 8,
                    showSizeChanger: false,
                    showQuickJumper: true,
                    showTotal: (total, range) => 
                        `${range[0]}-${range[1]} của ${total} đơn hàng`
                }}
                locale={{ emptyText: "Chưa có đơn hàng nào" }}
                expandable={false}
                scroll={{ x: 800 }}
                style={{
                    background: "#fff",
                    borderRadius: 8,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
                }}
            />
        </Spin>
    );
};

export default OrderPage;