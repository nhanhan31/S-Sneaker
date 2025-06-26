import React, { useEffect, useState } from "react";
import { Card, Image, Tag, Spin, Descriptions, Button } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { fetchProductById } from "../../utils/productApi";
import { useParams, useNavigate } from "react-router-dom";
import EditProductModal from "../../components/EditProductModal";

const AdminProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);

  const loadProduct = () => {
    setLoading(true);
    fetchProductById(id).then((data) => {
      setProduct(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div style={{ minHeight: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Spin size="large" tip="Đang tải sản phẩm..." />
      </div>
    );
  }

  if (!product) {
    return <div style={{ padding: 32 }}>Không tìm thấy sản phẩm.</div>;
  }

  return (
    <div style={{ padding: "0 32px 0 32px", maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ display: 'flex', gap: '12px', marginBottom: 24 }}>
        <Button onClick={() => navigate(-1)}>Quay lại</Button>
        <Button
          type="default"
          icon={<EditOutlined />}
          onClick={() => setShowEditModal(true)}
          style={{ background: "#111", borderColor: "#111", fontWeight: 600 }}
          ghost
        >
          Chỉnh sửa
        </Button>
      </div>
      <Card
        title={<span style={{ fontWeight: 700, fontSize: 22 }}>{product.productName}</span>}
        bordered
      >
        <div style={{ display: "flex", gap: 32 }}>
          <Image
            src={product.productImage}
            width={180}
            height={180}
            style={{ objectFit: "contain", borderRadius: 12, background: "#fff" }}
            alt={product.productName}
          />
          <div style={{ flex: 1 }}>
            <Descriptions column={1} bordered size="middle">
              <Descriptions.Item label="Giá">
                {Number(product.price).toLocaleString("vi-VN")} ₫
              </Descriptions.Item>
              <Descriptions.Item label="Danh mục">
                {product.category?.categoryName || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Thương hiệu">
                {product.brand?.brandName || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Giới tính">
                {product.gender === "male" && <Tag color="blue">Nam</Tag>}
                {product.gender === "female" && <Tag color="pink">Nữ</Tag>}
                {product.gender === "kid" && <Tag color="green">Kid</Tag>}
              </Descriptions.Item>
              <Descriptions.Item label="Arrivals">
                {product.isArrivals ? <Tag color="green">New</Tag> : <Tag color="default">-</Tag>}
              </Descriptions.Item>
              <Descriptions.Item label="Số lượng size">
                {Array.isArray(product.batchDetails) ? product.batchDetails.length : 0}
              </Descriptions.Item>
              <Descriptions.Item label="Mô tả">
                <div style={{ whiteSpace: "pre-line" }}>{product.description}</div>
              </Descriptions.Item>
              <Descriptions.Item label="Ảnh chi tiết">
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {(() => {
                    try {
                      // Parse JSON string to array
                      const detailImages = product.productDetailImg
                        ? (typeof product.productDetailImg === 'string'
                          ? JSON.parse(product.productDetailImg)
                          : product.productDetailImg)
                        : [];

                      if (Array.isArray(detailImages) && detailImages.length > 0) {
                        return detailImages.map((img, idx) => (
                          <Image
                            key={idx}
                            src={img}
                            width={60}
                            height={60}
                            style={{ objectFit: "contain", borderRadius: 8, background: "#fff" }}
                            alt=""
                          />
                        ));
                      }
                      return <span style={{ color: '#999' }}>Chưa có ảnh chi tiết</span>;
                    } catch (error) {
                      console.error('Error parsing productDetailImg:', error);
                      return <span style={{ color: '#f50' }}>Lỗi parse ảnh chi tiết</span>;
                    }
                  })()}
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Các size">
                {Array.isArray(product.batchDetails) && product.batchDetails.length > 0
                  ? product.batchDetails.map(b => b.sizes?.sizeNumber).join(", ")
                  : "-"}
              </Descriptions.Item>
            </Descriptions>
          </div>
        </div>
      </Card>

      <EditProductModal
        visible={showEditModal}
        onCancel={() => setShowEditModal(false)}
        onSuccess={loadProduct}
        product={product}
      />
    </div>
  );
};

export default AdminProductDetailPage;