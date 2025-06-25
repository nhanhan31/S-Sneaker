import axios from "axios";
import { BASE_URL } from "./url"; // Thêm dòng này

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

export const getOrdersByUserId = async (userId, token) => {
  try {
    const res = await axios.get(
      `${BASE_URL}/api/get-order-by-user-id/${userId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (res.data.errCode === 0 && Array.isArray(res.data.order)) {
      return res.data.order;
    }
    return [];
  } catch {
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