import React, { useEffect, useState } from "react";
import { Table, Typography, Spin, Tag, Collapse, Image } from "antd";
import { getOrdersByUserId } from "../../utils/orderApi";

const { Title } = Typography;
const { Panel } = Collapse;

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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
      title: "Order Code",
      dataIndex: "orderCode",
      key: "orderCode",
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: "Total",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (total) => `${Number(total).toLocaleString("vi-VN")} ₫`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "Paid" ? "green" : status === "Pending" ? "orange" : "red"}>
          {status}
        </Tag>
      ),
    },
    {
      title: "Detail",
      key: "detail",
      render: (_, record) => (
        <Collapse ghost>
          <Panel header="View" key="1">
            {record.orderdetails?.map((item) => (
              <div key={item.OrderDetailId} style={{ display: "flex", alignItems: "center", marginBottom: 12 }}>
                <Image
                  src={item.product?.productImage}
                  alt={item.product?.productName}
                  width={60}
                  height={60}
                  style={{ objectFit: "cover", borderRadius: 8, marginRight: 16 }}
                  preview={false}
                />
                <div style={{ flex: 1 }}>
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
          </Panel>
        </Collapse>
      ),
    },
  ];

  return (
    <Spin spinning={loading}>
      <div style={{ marginBottom: 24 }}>
        <Title level={3} style={{ fontWeight: 700 }}>Your Orders</Title>
      </div>
      <Table
        columns={columns}
        dataSource={orders}
        rowKey="OrderId"
        pagination={{ pageSize: 8 }}
        locale={{ emptyText: "No orders found" }}
        expandable={false}
      />
    </Spin>
  );
};

export default OrderPage;