import axios from 'axios';
import { BASE_URL } from './url'; // Thêm dòng này

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
