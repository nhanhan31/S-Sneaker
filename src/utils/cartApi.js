import axios from "axios";
import { BASE_URL } from "./url";

export async function addProductToCart({ userId, productId, sizeId, quantity, token }) {
  try {
    const res = await axios.post(
      `${BASE_URL}/api/add-new-product-to-cart`,
      { userId, productId, sizeId, quantity },
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

export async function getCartByUserId({ userId, token }) {
  try {
    const res = await axios.get(
      `${BASE_URL}/api/get-cart-by-userid/${userId}`,
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

// PUT: Update product quantity in cart
export async function updateProductQuantityCart({ userId, productId, sizeId, quantity, token }) {
  try {
    const res = await axios.put(
      `${BASE_URL}/api/update-product-quantity-cart/${productId}`,
      { userId, sizeId, quantity },
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

// DELETE: Remove a product from cart by productId
export async function deleteProductFromCart({ userId, productId, token }) {
  try {
    const res = await axios.delete(
      `${BASE_URL}/api/delete-a-product-from-cart/${productId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: { userId },
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

// DELETE: Remove all products from cart by userId
export async function deleteAllProductFromCart({ userId, token }) {
  try {
    const res = await axios.delete(
      `${BASE_URL}/api/delete-all-product-from-cart/${userId}`,
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