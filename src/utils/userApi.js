import axios from 'axios';
import { BASE_URL } from './url'; // Thêm dòng này

// Lấy danh sách tất cả users
export const getAllUsers = async (token) => {
    try {
        const response = await axios.get(`${BASE_URL}/api/get-all-users`, {
            headers: {
                "Content-Type": "application/json",
                ...(token && { Authorization: `Bearer ${token}` }),
            },
        });
        return {
            ok: true,
            data: response.data,
        };
    } catch (error) {
        return {
            ok: false,
            data: {
                errMessage: error.response?.data?.errMessage || "Có lỗi xảy ra khi lấy danh sách người dùng!",
            },
        };
    }
};

// Tạo user mới (Admin)
export const createUser = async (userInfo, token) => {
    try {
        const response = await axios.post(
            `${BASE_URL}/api/admin/create-user`,
            userInfo,
            {
                headers: {
                    "Content-Type": "application/json",
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
            }
        );
        return {
            ok: true,
            data: response.data,
        };
    } catch (error) {
        return {
            ok: false,
            data: {
                errMessage: error.response?.data?.errMessage || "Có lỗi xảy ra khi tạo người dùng!",
            },
        };
    }
};

export const getUserDetail = async (id, token) => {
    try {
        const response = await axios.get(`${BASE_URL}/api/get-user-detail/${id}`, {
            headers: {
                "Content-Type": "application/json",
                ...(token && { Authorization: `Bearer ${token}` }),
            },
        });
        return {
            ok: true,
            data: response.data,
        };
    } catch (error) {
        return {
            ok: false,
            data: {
                errMessage: error.response?.data?.errMessage || "Có lỗi xảy ra khi lấy thông tin người dùng!",
            },
        };
    }
};

export const updateUser = async (id, userInfo, token) => {
    try {
        const response = await axios.put(
            `${BASE_URL}/api/update-user/${id}`,
            userInfo,
            {
                headers: {
                    "Content-Type": "application/json",
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
            }
        );
        return {
            ok: true,
            data: response.data,
        };
    } catch (error) {
        return {
            ok: false,
            data: {
                errMessage: error.response?.data?.errMessage || "Có lỗi xảy ra khi cập nhật thông tin!",
            },
        };
    }
};

export const updateUserActiveStatus = async (userId, status, token) => {
    try {
        const response = await axios.put(
            `${BASE_URL}/api/update-user-active-status/${userId}/${status}`,
            {},
            {
                headers: {
                    "Content-Type": "application/json",
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
            }
        );
        return {
            ok: true,
            data: response.data,
        };
    } catch (error) {
        return {
            ok: false,
            data: {
                errMessage: error.response?.data?.errMessage || "Có lỗi xảy ra khi cập nhật trạng thái hoạt động!",
            },
        };
    }
};
