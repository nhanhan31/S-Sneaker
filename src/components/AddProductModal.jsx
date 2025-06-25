import React, { useState } from 'react';
import { Modal, Form, Input, InputNumber, Select, Upload, Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { createNewProduct } from '../utils/productApi'; // Adjust the import path as necessary

const { Option } = Select;
const { TextArea } = Input;

const AddProductModal = ({ visible, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [productImage, setProductImage] = useState(null);
  const [productDetailImages, setProductDetailImages] = useState([]);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      
      const productData = {
        ...values,
        productImage: productImage,
        productDetailImg: productDetailImages
      };

      const result = await createNewProduct(productData);
      
      if (result.errCode === 0) {
        message.success('Tạo sản phẩm thành công!');
        form.resetFields();
        setProductImage(null);
        setProductDetailImages([]);
        onSuccess();
        onCancel();
      } else {
        message.error(result.errMessage || 'Có lỗi xảy ra khi tạo sản phẩm');
      }
    } catch (error) {
      message.error('Có lỗi xảy ra khi tạo sản phẩm');
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

  return (
    <Modal
      title="Thêm sản phẩm mới"
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
          <InputNumber style={{ width: '100%' }} placeholder="Nhập ID danh mục" min={1} />
        </Form.Item>

        <Form.Item
          name="brandId"
          label="Thương hiệu"
          rules={[{ required: true, message: 'Vui lòng chọn thương hiệu!' }]}
        >
          <InputNumber style={{ width: '100%' }} placeholder="Nhập ID thương hiệu" min={1} />
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
          label="Ảnh sản phẩm chính"
          required
        >
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
          label="Ảnh chi tiết sản phẩm"
        >
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
              Tạo sản phẩm
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddProductModal;
