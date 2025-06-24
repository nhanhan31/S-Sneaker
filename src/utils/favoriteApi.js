import axios from "axios";
import { BASE_URL } from "./url"; // Thêm dòng này

export async function addProductToFavorite({ userId, productId, token }) {
  try {
    const res = await axios.post(
      `${BASE_URL}/api/add-product-to-favorite/${productId}`,
      { userId },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return { ok: true, data: res.data };
  } catch (err) {
    return {
      ok: false,
      data: { message: err.response?.data?.message || "Lỗi kết nối!" },
    };
  }
}

export async function deleteFavoriteByProductId({ userId, productId, token }) {
  try {
    const res = await axios.delete(
      `${BASE_URL}/api/delete-favorite-item/${productId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: { userId }, // Đúng chuẩn axios DELETE
      }
    );
    return { ok: true, data: res.data };
  } catch (err) {
    return {
      ok: false,
      data: { message: err.response?.data?.message || "Lỗi kết nối!" },
    };
  }
}

export async function getFavoriteByUserId({ userId, token }) {
  try {
    const res = await axios.get(
      `${BASE_URL}/api/get-favorite-item-by-user-id/${userId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return { ok: true, data: res.data };
  } catch (err) {
    return {
      ok: false,
      data: { message: err.response?.data?.message || "Lỗi kết nối!" },
    };
  }
}

export async function deleteAllFavoriteByUserId({ userId, token }) {
  try {
    const res = await axios.delete(
      `${BASE_URL}/api/delete-all-favorite-item/${userId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return { ok: true, data: res.data };
  } catch (err) {
    return {
      ok: false,
      data: { message: err.response?.data?.message || "Lỗi kết nối!" },
    };
  }
}