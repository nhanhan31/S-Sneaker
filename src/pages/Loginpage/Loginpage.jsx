import React, { useState } from "react";
import { Input, Button, Checkbox, message, ConfigProvider } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { login } from "../../utils/authApi";
import GoogleLoginButton from "../../components/GoogleLoginButton";

const Loginpage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    // Kiểm tra định dạng email trước khi đăng nhập
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      message.error("Vui lòng nhập email hợp lệ!");
      return;
    }
    setLoading(true);
    const result = await login({ email, password });
    const { ok, data } = result;
    if (ok && data.errCode === 0) {
      message.success("Đăng nhập thành công!");
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      if (remember) {
        localStorage.setItem("rememberEmail", email);
      } else {
        localStorage.removeItem("rememberEmail");
      }
      if ([1, 4, 5].includes(data.user.roleId)) {
        navigate("/", { replace: true });
      } else if ([2, 3].includes(data.user.roleId)) {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } else {
      message.error(data?.errMessage || data?.message || "Đăng nhập thất bại!");
    }
    setLoading(false);
  };

  // Khi khởi tạo component:
  React.useEffect(() => {
    const savedEmail = localStorage.getItem("rememberEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRemember(true);
    }
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        background: `url('/assets/login-backgroung.jpeg') center center / cover no-repeat`,
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        position: "relative",
        fontFamily: "Inter, Arial, sans-serif"
      }}
    >
      {/* Home Button */}
      <Button
        type="text"
        icon={<HomeOutlined />}
        onClick={() => navigate("/")}
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          zIndex: 10,
          color: "#fff",
          fontSize: 16,
          height: 40,
          width: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 20,
          background: "rgba(0, 0, 0, 0.3)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          transition: "all 0.3s ease"
        }}
        onMouseEnter={(e) => {
          e.target.style.background = "rgba(0, 0, 0, 0.5)";
          e.target.style.transform = "scale(1.05)";
        }}
        onMouseLeave={(e) => {
          e.target.style.background = "rgba(0, 0, 0, 0.3)";
          e.target.style.transform = "scale(1)";
        }}
      />

      {/* Left info */}
      <div
        style={{
          position: "absolute",
          left: 80,
          top: "40%",
          color: "#fff",
          zIndex: 2,
          maxWidth: 400,
        }}
      >
        <div style={{ fontSize: 48, fontWeight: 700, letterSpacing: 2, marginBottom: 24, fontFamily: "Inter, Arial, sans-serif" }}>
          S-SNEAKER
        </div>
        <div style={{ fontSize: 24, fontWeight: 500, marginBottom: 16 }}>
          Xây dựng tương lai...
        </div>
        <div style={{ fontSize: 15, color: "#e0e0e0", marginBottom: 32, lineHeight: 1.6 }}>
          Chào mừng bạn đến với S-SNEAKER, nơi cung cấp những đôi giày chất lượng cao và phong cách thời trang hiện đại.
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          <span style={{ width: 24, height: 4, background: "#fff", borderRadius: 2, display: "inline-block" }} />
          <span style={{ width: 12, height: 4, background: "#888", borderRadius: 2, display: "inline-block" }} />
          <span style={{ width: 12, height: 4, background: "#888", borderRadius: 2, display: "inline-block" }} />
        </div>
      </div>

      {/* Login form */}
      <div
        style={{
          background: "#fff",
          borderRadius: 8,
          boxShadow: "0 4px 32px rgba(0,0,0,0.18)",
          padding: "32px 40px 40px 40px",
          width: 420,
          zIndex: 3,
          marginLeft: "auto",
          marginRight: "8vw",
          minHeight: 500,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center"
        }}
      >
        <div style={{ fontWeight: 600, color: "#888", marginBottom: 8, fontSize: 13 }}>CHÀO MỪNG TRỞ LẠI</div>
        <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 18 }}>Đăng nhập vào tài khoản</div>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 4 }}>Email</div>
          <Input
            placeholder="Nhập email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            size="large"
            style={{ marginBottom: 12 }}
          />
          <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 4 }}>Mật khẩu</div>
          <Input.Password
            placeholder="Nhập mật khẩu"
            value={password}
            onChange={e => setPassword(e.target.value)}
            size="large"
          />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: 'rgb(0, 0, 0)',
                colorPrimaryHover: 'rgba(46, 46, 46, 0.88)',
                colorPrimaryBorder: 'rgba(48, 48, 48, 0.88)',
              },
            }}
          >
            <Checkbox checked={remember} onChange={e => setRemember(e.target.checked)} style={{ fontSize: 13 }}>
              Ghi nhớ đăng nhập
            </Checkbox>
          </ConfigProvider>

          {/* <a href="#" style={{ color: "#888", fontSize: 13 }}>Quên mật khẩu?</a> */}
        </div>
        <Button
          type="primary"
          block
          size="large"
          loading={loading}
          style={{
            background: "#111",
            borderColor: "#111",
            fontWeight: 600,
            marginBottom: 18,
            borderRadius: 6,
            height: 40,
            transition: "all 0.2s ease",
            border: "1px solid #dadce0",
          }}
          onClick={handleLogin}
        >
          TIẾP TỤC
        </Button>
        <div style={{ textAlign: "center", color: "#888", margin: "2px 0 18px 0", fontSize: 13 }}>Hoặc</div>
        
        <GoogleLoginButton 
          loading={loading}
          setLoading={setLoading}
          style={{ marginBottom: 10 }}
        />

        <div style={{ textAlign: "center", marginTop: 18, color: "#888", fontSize: 13 }}>
          Người dùng mới? <a href="/register" style={{ fontWeight: 600, color: "#111" }}>ĐĂNG KÝ TẠI ĐÂY</a>
        </div>
      </div>
    </div>
  );
};

export default Loginpage;