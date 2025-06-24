import axios from "axios";

export async function addProductToFavorite({ userId, productId, token }) {
  try {
    const res = await axios.post(
      `https://api-for-be.onrender.com/api/add-product-to-favorite/${productId}`,
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
      `https://api-for-be.onrender.com/api/delete-favorite-item/${productId}`,
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
      `https://api-for-be.onrender.com/api/get-favorite-item-by-user-id/${userId}`,
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
      `https://api-for-be.onrender.com/api/delete-all-favorite-item/${userId}`,
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