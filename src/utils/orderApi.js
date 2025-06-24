import axios from "axios";

export async function createNewOrder({ userId, cart, token, promotionId = null }) {
  try {
    const res = await axios.post(
      `https://api-for-be.onrender.com/api/create-new-order/${userId}/promotion/${promotionId}`,
      {
        cart: cart.map(item => ({
          productId: item.id,
          quantity: item.quantity
        }))
      },
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