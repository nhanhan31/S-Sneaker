import axios from "axios";
import { BASE_URL } from "./url"; // Thêm dòng này
import apiClient from './authApi'; // Sử dụng axios instance đã có

export async function createNewOrder({ userId, cart, token, promotionId = null }) {
  try {
    const res = await axios.post(
      `${BASE_URL}/api/create-new-order/${userId}/promotion/${promotionId}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return { ok: res.data?.errCode === 0, data: res.data };
  } catch (err) {
    return {
      ok: false,
      data: { errMessage: err.response?.data?.errMessage || "Lỗi kết nối!" },
    };
  }
}

// Xóa order theo orderCode
export const deleteOrderByCode = async (orderCode) => {
  try {
    const response = await apiClient.delete(`/api/delete-order-by-code/${orderCode}`);
    return { ok: true, data: response.data };
  } catch (error) {
    if (error.response) {
      return { ok: false, data: error.response.data };
    } else if (error.request) {
      return { ok: false, data: { message: "Network error! Please check your connection." } };
    } else {
      return { ok: false, data: { message: "An unexpected error occurred!" } };
    }
  }
};

// Lấy orders theo userId (nếu chưa có)
export const getOrdersByUserId = async (userId, token) => {
  try {
    const response = await apiClient.get(`/api/orders/user/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data?.order || [];
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
};

export const getOrderShippingStatus = async (shippingCode, token) => {
  try {
    const res = await axios.get(
      `${BASE_URL}/api/ghn/order-status/${shippingCode}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  } catch {
    return null;
  }
};

export const getOrderById = async (orderId, token) => {
  try {
    const res = await axios.get(
      `${BASE_URL}/api/get-order-by-id/${orderId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (res.data.errCode === 0 && res.data.order) {
      return res.data.order;
    }
    return null;
  } catch {
    return null;
  }
};