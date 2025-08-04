import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, Upload, Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { updateProduct, getAllCategories, getAllBrands } from '../utils/productApi';

const { Option } = Select;
const { TextArea } = Input;

const EditProductModal = ({ visible, onCancel, onSuccess, product }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [productImage, setProductImage] = useState(null);
  const [productDetailImages, setProductDetailImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    if (visible && product) {
      loadCategoriesAndBrands();
      
      console.log('Setting form values:', product);
      form.setFieldsValue({
        productName: product.productName,
        description: product.description,
        price: product.price,
        categoryId: product.categoryId,
        brandId: product.brandId,
        isArrivals: product.isArrivals,
        gender: product.gender,
        weight: product.weight
      });
      
      setProductImage(null);
      setProductDetailImages([]);
    }
  }, [visible, product, form]);

  const loadCategoriesAndBrands = async () => {
    try {
      const [categoriesResult, brandsResult] = await Promise.all([
        getAllCategories(),
        getAllBrands()
      ]);

      if (categoriesResult.ok) {
        setCategories(categoriesResult.data.category || []);
      }

      if (brandsResult.ok) {
        setBrands(brandsResult.data.brands || []);
      }
    } catch (error) {
      console.error('Error loading categories and brands:', error);
    }
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      
      if (!productDetailImages || productDetailImages.length === 0) {
        message.error('Vui lòng chọn ít nhất 1 ảnh chi tiết mới để cập nhật!');
        setLoading(false);
        return;
      }
      
      const productData = {
        ...values,
        productImage: productImage,
        productDetailImg: productDetailImages
      };

      const result = await updateProduct(product.productId, productData);
      
      if (result.errCode === 0) {
        message.success('Cập nhật sản phẩm thành công!');
        onSuccess();
        onCancel();
      } else {
        message.error(result.errMessage || 'Có lỗi xảy ra khi cập nhật sản phẩm');
      }
    } catch (error) {
      message.error('Có lỗi xảy ra khi cập nhật sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const handleProductImageChange = ({ file }) => {
    if (file.status !== 'uploading') {
      setProductImage(file.originFileObj || file);
    }
  };

  const handleDetailImagesChange = ({ fileList }) => {
    const files = fileList.map(file => file.originFileObj || file).filter(Boolean);
    setProductDetailImages(files);
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('Chỉ có thể upload file JPG/PNG!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Kích thước ảnh phải nhỏ hơn 2MB!');
    }
    return false; // Prevent automatic upload
  };

  if (!product) return null;

  return (
    <Modal
      title="Chỉnh sửa sản phẩm"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="productName"
          label="Tên sản phẩm"
          rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
        >
          <Input placeholder="Nhập tên sản phẩm" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Mô tả"
        >
          <TextArea rows={3} placeholder="Nhập mô tả sản phẩm" />
        </Form.Item>

        <Form.Item
          name="price"
          label="Giá"
          rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}
        >
          <InputNumber
            style={{ width: '100%' }}
            placeholder="Nhập giá sản phẩm"
            min={0}
            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          />
        </Form.Item>

        <Form.Item
          name="categoryId"
          label="Danh mục"
          rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
        >
          <Select placeholder="Chọn danh mục" style={{ width: '100%' }}>
            {categories.map((category) => (
              <Option key={category.CategoryId} value={category.CategoryId}>
                {category.description}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="brandId"
          label="Thương hiệu"
          rules={[{ required: true, message: 'Vui lòng chọn thương hiệu!' }]}
        >
          <Select placeholder="Chọn thương hiệu" style={{ width: '100%' }}>
            {brands.map((brand) => (
              <Option key={brand.brandId} value={brand.brandId}>
                {brand.brandName}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="isArrivals"
          label="New Arrivals"
          rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
        >
          <Select placeholder="Chọn trạng thái">
            <Option value={true}>Có</Option>
            <Option value={false}>Không</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="gender"
          label="Giới tính"
        >
          <Select placeholder="Chọn giới tính">
            <Option value="male">Nam</Option>
            <Option value="female">Nữ</Option>
            <Option value="kid">Kid</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="weight"
          label="Cân nặng (kg)"
        >
          <InputNumber
            style={{ width: '100%' }}
            placeholder="Nhập cân nặng"
            min={0}
            step={0.1}
          />
        </Form.Item>

        <Form.Item
          label="Ảnh sản phẩm chính (nếu muốn thay đổi)"
        >
          <div style={{ marginBottom: 8, fontSize: 12, color: '#666' }}>
            Ảnh hiện tại: {product.productImage && <img src={product.productImage} alt="current" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }} />}
          </div>
          <Upload
            listType="picture-card"
            beforeUpload={beforeUpload}
            onChange={handleProductImageChange}
            maxCount={1}
          >
            {!productImage && (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            )}
          </Upload>
        </Form.Item>

        <Form.Item
          label="Ảnh chi tiết sản phẩm (nếu muốn thay đổi)"
        >
          <div style={{ marginBottom: 8, fontSize: 12, color: '#666' }}>
            Ảnh hiện tại: {(() => {
              try {
                const detailImages = product.productDetailImg 
                  ? (typeof product.productDetailImg === 'string' 
                      ? JSON.parse(product.productDetailImg) 
                      : product.productDetailImg)
                  : [];
                
                if (Array.isArray(detailImages) && detailImages.length > 0) {
                  return (
                    <div style={{ display: 'flex', gap: 4 }}>
                      {detailImages.slice(0, 3).map((img, idx) => (
                        <img key={idx} src={img} alt="current" style={{ width: 30, height: 30, objectFit: 'cover', borderRadius: 4 }} />
                      ))}
                      {detailImages.length > 3 && <span>+{detailImages.length - 3} ảnh</span>}
                    </div>
                  );
                }
                return "Chưa có ảnh chi tiết";
              } catch (error) {
                console.error('Error parsing productDetailImg:', error);
                return "Lỗi parse ảnh chi tiết";
              }
            })()}
          </div>
          <Upload
            listType="picture-card"
            beforeUpload={beforeUpload}
            onChange={handleDetailImagesChange}
            multiple
          >
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          </Upload>
        </Form.Item>

        <Form.Item>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <Button onClick={onCancel}>
              Hủy
            </Button>
            <Button type="primary" style={{ background: "#111", borderColor: "#111", fontWeight: 600 }} htmlType="submit" loading={loading}>
              Cập nhật sản phẩm
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditProductModal;
