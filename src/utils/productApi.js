import axios from 'axios';
import { BASE_URL } from './url';

export const fetchAllProducts = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/api/get-all-products`);
    // API trả về { errCode, errMessage, product: [...] }
    if (res.data && Array.isArray(res.data.product)) {
      return res.data.product;
    }
    return [];
  } catch (err) {
    return [];
  }
};

export const fetchProductById = async (id) => {
  try {
    const res = await axios.get(`${BASE_URL}/api/get-product-by-productId/${id}`);
    if (res.data && res.data.errCode === 0 && res.data.product) {
      return res.data.product;
    }
    return null;
  } catch {
    return null;
  }
};

export const fetchProductByIdWithQuantity = async (id) => {
  try {
    // Gọi API lấy tất cả sản phẩm và filter theo id để có đầy đủ thông tin quantity
    const allProducts = await fetchAllProducts();
    const product = allProducts.find(p => p.productId === parseInt(id));
    return product || null;
  } catch {
    return null;
  }
};

export const createNewProduct = async (productData) => {
  try {
    const token = localStorage.getItem('token');
    
    // Create FormData for file upload
    const formData = new FormData();
    
    // Add basic product info
    formData.append('productName', productData.productName);
    formData.append('description', productData.description || '');
    formData.append('price', productData.price);
    formData.append('categoryId', productData.categoryId);
    formData.append('brandId', productData.brandId);
    formData.append('isArrivals', productData.isArrivals);
    formData.append('gender', productData.gender || '');
    formData.append('weight', productData.weight || '');
    
    // Add product image
    if (productData.productImage) {
      formData.append('productImage', productData.productImage);
    }
    
    // Add product detail images
    if (productData.productDetailImg && Array.isArray(productData.productDetailImg)) {
      productData.productDetailImg.forEach((file) => {
        formData.append('productDetailImg', file);
      });
    }

    const res = await axios.post(`${BASE_URL}/api/create-new-product`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return res.data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

export const updateProduct = async (productId, productData) => {
  try {
    const token = localStorage.getItem('token');
    
    // Create FormData for file upload
    const formData = new FormData();
    
    // Add basic product info
    formData.append('productName', productData.productName);
    formData.append('description', productData.description || '');
    formData.append('price', productData.price);
    formData.append('categoryId', productData.categoryId);
    formData.append('brandId', productData.brandId);
    formData.append('isArrivals', productData.isArrivals);
    formData.append('gender', productData.gender || '');
    formData.append('weight', productData.weight || '');
    
    // Add product image if provided
    if (productData.productImage) {
      formData.append('productImage', productData.productImage);
    }
    
    // Add product detail images if provided
    if (productData.productDetailImg && Array.isArray(productData.productDetailImg)) {
      productData.productDetailImg.forEach((file) => {
        formData.append('productDetailImg', file);
      });
    }

    const res = await axios.put(`${BASE_URL}/api/update-product/${productId}`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return res.data;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};