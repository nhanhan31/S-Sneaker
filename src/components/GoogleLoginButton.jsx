import React from 'react';
import { Button, message } from 'antd';
import { GoogleOutlined } from '@ant-design/icons';
import { useGoogleLogin } from '@react-oauth/google';
import { googleLogin } from '../utils/authApi';
import { useNavigate } from 'react-router-dom';

const GoogleLoginButton = ({
    loading,
    setLoading,
    block = true,
    style = {},
    children = "Đăng nhập với Google"
}) => {
    const navigate = useNavigate();

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                setLoading && setLoading(true);

                // Gọi API Google để lấy thông tin user
                const googleUserRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
                    headers: {
                        Authorization: `Bearer ${tokenResponse.access_token}`,
                    },
                });

                if (!googleUserRes.ok) {
                    throw new Error('Failed to fetch Google user info');
                }

                const googleUser = await googleUserRes.json();

                // Gửi access token tới backend
                const result = await googleLogin({ tokenId: tokenResponse.access_token });
                const { ok, data } = result;

                if (ok && data.errCode === 0) {
                    message.success("Đăng nhập Google thành công!");
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("user", JSON.stringify(data.user));

                    // Chuyển hướng dựa trên role
                    if ([1, 4, 5].includes(data.user.roleId)) {
                        navigate("/", { replace: true });
                    } else if ([2, 3].includes(data.user.roleId)) {
                        navigate("/admin/dashboard", { replace: true });
                    } else {
                        navigate("/", { replace: true });
                    }
                } else {
                    message.error(data?.errMessage || data?.message || "Đăng nhập Google thất bại!");
                }
            } catch (error) {
                console.error('Google login error:', error);
                message.error("Có lỗi xảy ra khi đăng nhập Google!");
            } finally {
                setLoading && setLoading(false);
            }
        },
        onError: (error) => {
            console.error('Google login error:', error);
            message.error("Đăng nhập Google thất bại!");
            setLoading && setLoading(false);
        },
    });

    return (
        <Button
            type="primary"
            block={block}
            icon={<GoogleOutlined style={{ color: "rgb(66, 133, 244)" }} />}
            style={{
                background: "#fff",
                border: "1px solid #dadce0",
                fontWeight: 500,
                borderRadius: 6,
                height: 38,
                color: "#3c4043",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                transition: "all 0.2s ease",
                ...style
            }}
            onClick={handleGoogleLogin}
            loading={loading}
        >
            {children}
        </Button>
    );
};

export default GoogleLoginButton;
