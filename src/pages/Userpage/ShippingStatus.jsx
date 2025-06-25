import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Typography, Spin, Tag, Button, Divider, Row, Col, Steps } from "antd";
import { getOrderById, getOrderShippingStatus } from "../../utils/orderApi";

const { Title, Text } = Typography;

// Map GHN status to step index
const ghnStatusToStep = (status) => {
  switch (status) {
    case "ready_to_pick":
    case "Paid":
    case "confirmed":
      return 0;
    case "picked":
    case "shipped":
      return 1;
    case "delivering":
      return 2;
    case "delivered":
      return 3;
    default:
      return 0;
  }
};

const ShippingStatus = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [shipping, setShipping] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      const foundOrder = await getOrderById(orderId, token);
      setOrder(foundOrder);
      if (foundOrder?.shippingCode) {
        const shipRes = await getOrderShippingStatus(orderId, token);
        if (shipRes?.errCode === 0) setShipping(shipRes.data);
      }
      setLoading(false);
    };
    if (orderId && token) fetchOrder();
  }, [orderId, token]);

  if (loading) return <Spin style={{ marginTop: 40 }} />;

  if (!order)
    return (
      <Card style={{ margin: 40 }}>
        <Title level={4}>Không tìm thấy đơn hàng</Title>
        <Button onClick={() => navigate(-1)}>Quay lại</Button>
      </Card>
    );

  // Ưu tiên trạng thái GHN nếu có, nếu không lấy trạng thái đơn hàng
  const stepIndex = shipping
    ? ghnStatusToStep(shipping.status)
    : ghnStatusToStep(order.status);

  return (
    <Card style={{ maxWidth: 2000, margin: "40px auto", padding: 32, boxShadow: "0 4px 32px #f3f3f3" }}>
      <Row gutter={32}>
        <Col xs={24} md={16}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Title level={4} style={{ marginBottom: 0 }}>
              Mã đơn hàng: {order.orderCode}
            </Title>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, margin: "8px 0 16px 0" }}>
            <Text style={{ color: "#888" }}>
              Ngày đặt hàng: {new Date(order.createdAt).toLocaleDateString()}
            </Text>
            {shipping?.leadtime && (
              <Tag color="green" style={{ fontWeight: 600 }}>
                Dự kiến giao hàng: {new Date(shipping.leadtime).toLocaleDateString()}
              </Tag>
            )}
          </div>
          <Steps
            current={stepIndex}
            style={{ margin: "24px 0 32px 0" }}
            responsive
            items={[
              {
                title: "Đã xác nhận đơn hàng",
                description: order.createdAt && (
                  <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                ),
              },
              {
                title: "Đã vận chuyển",
                description: shipping?.pickup_time && (
                  <span>{new Date(shipping.pickup_time).toLocaleDateString()}</span>
                ),
              },
              {
                title: "Đang giao hàng",
                description: shipping?.deliveringAt && (
                  <span>{new Date(shipping.deliveringAt).toLocaleDateString()}</span>
                ),
              },
              {
                title: "Đã giao hàng",
                description: shipping?.finish_date
                  ? <span>Dự kiến vào {new Date(shipping.finish_date).toLocaleDateString()}</span>
                  : "Sắp đến",
              },
            ]}
          />
          <Divider />
          <div>
            {order.orderdetails?.map((item) => (
              <div key={item.OrderDetailId} style={{ display: "flex", alignItems: "center", marginBottom: 18 }}>
                <img
                  src={item.product?.productImage}
                  alt={item.product?.productName}
                  style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 8, marginRight: 16 }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 16 }}>{item.product?.productName}</div>
                  <div style={{ color: "#888", fontSize: 13 }}>
                    {item.product?.brand?.brandName} - {item.product?.category?.categoryName}
                  </div>
                </div>
                <div style={{ textAlign: "right", minWidth: 120 }}>
                  <div style={{ fontWeight: 600, fontSize: 16 }}>
                    {Number(item.unitPrice).toLocaleString("vi-VN")} ₫
                  </div>
                  <div style={{ color: "#888", fontSize: 13 }}>Số lượng: {item.quantity}</div>
                </div>
              </div>
            ))}
          </div>
        </Col>
        <Col xs={24} md={8}>
          <div style={{ background: "#fafbfc", borderRadius: 12, padding: 24, marginBottom: 24 }}>
            <Divider style={{ margin: "12px 0" }} />
            <Title level={5} style={{ marginBottom: 12 }}>Thông tin giao hàng</Title>
            <div style={{ color: "#444" }}>
              <div>
                <Text strong>Địa chỉ:</Text> {order.address || shipping?.to_address}
              </div>
              <div>
                <Text strong>Số điện thoại:</Text> {order.phone || shipping?.to_phone}
              </div>
            </div>
          </div>
          <div style={{ background: "#fafbfc", borderRadius: 12, padding: 24 }}>
            <Title level={5} style={{ marginBottom: 12 }}>Tóm tắt đơn hàng</Title>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span>Giảm giá</span>
              <span>{order.discount ? `-${Number(order.discount).toLocaleString("vi-VN")} ₫` : "0₫"}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span>Phí vận chuyển</span>
              <span>{order.deliveryFee ? `${Number(order.deliveryFee).toLocaleString("vi-VN")} ₫` : "0₫"}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span>Thuế</span>
              <span>{order.tax ? `${Number(order.tax).toLocaleString("vi-VN")} ₫` : "+0₫"}</span>
            </div>
            <Divider style={{ margin: "12px 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 18 }}>
              <span>Tổng cộng</span>
              <span>{Number(order.totalPrice).toLocaleString("vi-VN")} ₫</span>
            </div>
          </div>
        </Col>
      </Row>
      <Button style={{ marginTop: 32 }} onClick={() => navigate(-1)}>
        Quay lại
      </Button>
    </Card>
  );
};

export default ShippingStatus;