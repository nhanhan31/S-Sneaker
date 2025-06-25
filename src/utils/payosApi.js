import axios from "axios";
import { BASE_URL } from "./url";

export const payosReturn = async ({ status, orderCode, token }) => {
  try {
    const headers = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    const res = await axios.get(`${BASE_URL}/api/payos/return`, {
      params: { status, orderCode },
      headers
    });
    return { ok: true, data: res.data };
  } catch (err) {
    return { ok: false, data: err.response?.data || { message: "Lỗi kết nối payos!" } };
  }
};