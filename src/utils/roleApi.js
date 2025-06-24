import axios from "axios";
import { BASE_URL } from "./url"; // Thêm dòng này

export const getAllRoles = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/get-all-roles`, {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    return {
      ok: response.status === 200,
      data: response.data,
    };
  } catch (error) {
    return {
      ok: false,
      data: { errMessage: "Có lỗi xảy ra khi lấy danh sách role!" },
    };
  }
};