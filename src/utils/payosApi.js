import axios from "axios";
import { BASE_URL } from "./url";

export const payosReturn = async ({ status, orderCode, token }) => {
  try {
    const headers = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    // URL format: /api/payos/return/{status}/{orderCode}?status={status}&orderCode={orderCode}
    const res = await axios.get(`${BASE_URL}/api/payos/return/${status}/${orderCode}`, {
      params: { status, orderCode }, // Query parameters
      headers
    });
    return { ok: true, data: res.data };
  } catch (err) {
    return { ok: false, data: err.response?.data || { message: "Lỗi kết nối payos!" } };
  }
};
