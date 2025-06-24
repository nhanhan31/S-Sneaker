import axios from 'axios';

export const getUserDetail = async (id, token) => {
    try {
        const response = await axios.get(`https://api-for-be.onrender.com/api/get-user-detail/${id}`, {
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
            `https://api-for-be.onrender.com/api/update-user/${id}`,
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
