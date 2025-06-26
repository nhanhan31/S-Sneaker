import React, { useState } from "react";
import { Input, Button, message, ConfigProvider } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { register } from "../../utils/authApi";
import GoogleLoginButton from "../../components/GoogleLoginButton";

const Registerpage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    // Validation
    if (!firstName.trim()) {
      message.error("Vui lòng nhập họ!");
      return;
    }
    if (!lastName.trim()) {
      message.error("Vui lòng nhập tên!");
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      message.error("Vui lòng nhập email hợp lệ!");
      return;
    }
    
    if (password.length < 6) {
      message.error("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }
    
    if (password !== confirmPassword) {
      message.error("Mật khẩu xác nhận không khớp!");
      return;
    }
    
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(phoneNumber)) {
      message.error("Vui lòng nhập số điện thoại hợp lệ (10-11 số)!");
      return;
    }

    setLoading(true);
    const result = await register({ firstName, lastName, email, password, phoneNumber });
    const { ok, data } = result;
    
    if (ok && data.errCode === 0) {
      message.success("Đăng ký thành công! Vui lòng đăng nhập.");
      navigate("/login");
    } else {
      message.error(data?.errMessage || data?.message || "Đăng ký thất bại!");
    }
    setLoading(false);
  };

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
          Tham gia cộng đồng...
        </div>
        <div style={{ fontSize: 15, color: "#e0e0e0", marginBottom: 32, lineHeight: 1.6 }}>
          Tạo tài khoản để trải nghiệm những sản phẩm giày sneaker tuyệt vời và nhận được những ưu đãi đặc biệt.
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          <span style={{ width: 12, height: 4, background: "#888", borderRadius: 2, display: "inline-block" }} />
          <span style={{ width: 24, height: 4, background: "#fff", borderRadius: 2, display: "inline-block" }} />
          <span style={{ width: 12, height: 4, background: "#888", borderRadius: 2, display: "inline-block" }} />
        </div>
      </div>

      {/* Register form */}
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
          minHeight: 580,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center"
        }}
      >
        <div style={{ fontWeight: 600, color: "#888", marginBottom: 8, fontSize: 13 }}>TẠO TÀI KHOẢN MỚI</div>
        <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 18 }}>Đăng ký tài khoản</div>
        
        <div style={{ marginBottom: 14 }}>
          {/* Họ và Tên */}
          <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 4 }}>Họ</div>
              <Input
                placeholder="Nhập họ"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                size="large"
              />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 4 }}>Tên</div>
              <Input
                placeholder="Nhập tên"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                size="large"
              />
            </div>
          </div>

          {/* Email */}
          <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 4 }}>Email</div>
          <Input
            placeholder="Nhập email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            size="large"
            style={{ marginBottom: 12 }}
          />

          {/* Số điện thoại */}
          <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 4 }}>Số điện thoại</div>
          <Input
            placeholder="Nhập số điện thoại"
            value={phoneNumber}
            onChange={e => setPhoneNumber(e.target.value)}
            size="large"
            style={{ marginBottom: 12 }}
          />

          {/* Mật khẩu */}
          <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 4 }}>Mật khẩu</div>
          <Input.Password
            placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
            value={password}
            onChange={e => setPassword(e.target.value)}
            size="large"
            style={{ marginBottom: 12 }}
          />

          {/* Xác nhận mật khẩu */}
          <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 4 }}>Xác nhận mật khẩu</div>
          <Input.Password
            placeholder="Nhập lại mật khẩu"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            size="large"
          />
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
            height: 40
          }}
          onClick={handleRegister}
        >
          ĐĂNG KÝ
        </Button>
        
        <div style={{ textAlign: "center", color: "#888", margin: "2px 0 18px 0", fontSize: 13 }}>Hoặc</div>
        
        <GoogleLoginButton 
          loading={loading}
          setLoading={setLoading}
          style={{ marginBottom: 18 }}
        >
          Đăng ký với Google
        </GoogleLoginButton>

        <div style={{ textAlign: "center", marginTop: 12, color: "#888", fontSize: 13 }}>
          Đã có tài khoản? <a href="/login" style={{ fontWeight: 600, color: "#111" }}>ĐĂNG NHẬP TẠI ĐÂY</a>
        </div>
      </div>
    </div>
  );
};

export default Registerpage;
