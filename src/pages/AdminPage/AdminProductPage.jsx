import React, { useEffect, useState } from "react";
import { Table, Button, Image, Tag, Spin, Space } from "antd";
import { PlusOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { fetchAllProducts } from "../../utils/productApi";
import { useNavigate } from "react-router-dom";
import AddProductModal from "../../components/AddProductModal";
import EditProductModal from "../../components/EditProductModal";

const AdminProductPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();

  const loadProducts = () => {
    setLoading(true);
    fetchAllProducts().then((data) => {
      setProducts(Array.isArray(data) ? data : []);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const columns = [
    {
      title: "Ảnh",
      dataIndex: "productImage",
      key: "productImage",
      render: (img) => <Image src={img} width={60} height={60} style={{ objectFit: "contain", borderRadius: 8, background: "#fff" }} />,
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "productName",
      key: "productName",
      render: (text, record) => (
        <span style={{ fontWeight: 600 }}>{text}</span>
      ),
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price) => Number(price).toLocaleString("vi-VN") + " ₫",
    },
    {
      title: "Danh mục",
      dataIndex: ["category", "categoryName"],
      key: "category",
      render: (_, record) => record.category?.categoryName || "-",
    },
    {
      title: "Thương hiệu",
      dataIndex: ["brand", "brandName"],
      key: "brand",
      render: (_, record) => record.brand?.brandName || "-",
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      render: (gender) => {
        if (gender === "male") return <Tag color="blue">Nam</Tag>;
        if (gender === "female") return <Tag color="pink">Nữ</Tag>;
        if (gender === "kid") return <Tag color="green">Kid</Tag>;
        return "-";
      },
    },
    {
      title: "Arrivals",
      dataIndex: "isArrivals",
      key: "isArrivals",
      render: (isArrivals) =>
        isArrivals ? <Tag color="green">New</Tag> : <Tag color="default">-</Tag>,
    },
    {
      title: "Số lượng size",
      dataIndex: "batchDetails",
      key: "batchDetails",
      render: (batchDetails) =>
        Array.isArray(batchDetails) ? batchDetails.length : 0,
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/admin/product/${record.productId}`)}
          >
            Xem
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => {
              setSelectedProduct(record);
              setShowEditModal(true);
            }}
          >
            Sửa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ fontWeight: 700, fontSize: 28, margin: 0 }}>Quản lý sản phẩm</h2>
        <Button 
          type="primary" 
          style={{ background: "#111", borderColor: "#111", fontWeight: 600 }}
          icon={<PlusOutlined />}
          onClick={() => setShowAddModal(true)}
          size="large"
        >
          Thêm sản phẩm
        </Button>
      </div>
      
      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={products.map((item) => ({ ...item, key: item.productId }))}
          pagination={{ pageSize: 10 }}
          bordered
        />
      </Spin>

      <AddProductModal
        visible={showAddModal}
        onCancel={() => setShowAddModal(false)}
        onSuccess={loadProducts}
      />

      <EditProductModal
        visible={showEditModal}
        onCancel={() => {
          setShowEditModal(false);
          setSelectedProduct(null);
        }}
        onSuccess={loadProducts}
        product={selectedProduct}
      />
    </div>
  );
};

export default AdminProductPage;