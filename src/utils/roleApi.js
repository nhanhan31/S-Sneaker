import axios from "axios";

export const getAllRoles = async (token) => {
  try {
    const response = await axios.get("https://api-for-be.onrender.com/api/get-all-roles", {
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