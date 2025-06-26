import React, { useState } from "react";
import { Input, Button, message, ConfigProvider } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { register } from "../../utils/authApi";
import GoogleLoginButton from "../../components/GoogleLoginButton";
import "../Auth/AuthResponsive.css";

const Registerpage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [screenSize, setScreenSize] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    width: 1200
  });
  const navigate = useNavigate();

  React.useEffect(() => {
    // Handle responsive với nhiều breakpoints
    const handleResize = () => {
      const width = window.innerWidth;
      setScreenSize({
        isMobile: width <= 768,
        isTablet: width > 768 && width <= 1024,
        isDesktop: width > 1024,
        width: width
      });
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
        fontFamily: "Inter, Arial, sans-serif",
        padding: screenSize.isMobile ? "10px" : "20px",
        overflow: screenSize.isMobile ? "auto" : "hidden"
      }}
    >
      {/* Home Button */}
      <Button
        type="text"
        icon={<HomeOutlined />}
        onClick={() => navigate("/")}
        style={{
          position: "absolute",
          top: screenSize.isMobile ? 10 : 20,
          left: screenSize.isMobile ? 10 : 20,
          zIndex: 10,
          color: "#fff",
          fontSize: screenSize.isMobile ? 14 : 16,
          height: screenSize.isMobile ? 36 : 40,
          width: screenSize.isMobile ? 36 : 40,
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
          left: screenSize.isMobile ? "20px" : screenSize.isTablet ? "40px" : "80px",
          top: screenSize.isMobile ? "10%" : screenSize.isTablet ? "30%" : "40%",
          color: "#fff",
          zIndex: 2,
          maxWidth: screenSize.isMobile ? "calc(100% - 40px)" : screenSize.isTablet ? "300px" : "400px",
          display: screenSize.isMobile ? "none" : "block"
        }}
      >
        <div style={{ 
          fontSize: screenSize.isTablet ? 36 : 48, 
          fontWeight: 700, 
          letterSpacing: 2, 
          marginBottom: 24, 
          fontFamily: "Inter, Arial, sans-serif" 
        }}>
          S-SNEAKER
        </div>
        <div style={{ 
          fontSize: screenSize.isTablet ? 20 : 24, 
          fontWeight: 500, 
          marginBottom: 16 
        }}>
          Tham gia cộng đồng...
        </div>
        <div style={{ 
          fontSize: screenSize.isTablet ? 14 : 15, 
          color: "#e0e0e0", 
          marginBottom: 32, 
          lineHeight: 1.6 
        }}>
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
          borderRadius: screenSize.isMobile ? 12 : 8,
          boxShadow: "0 4px 32px rgba(0,0,0,0.18)",
          padding: screenSize.isMobile ? "20px 16px 24px 16px" : screenSize.isTablet ? "28px 32px 32px 32px" : "32px 40px 40px 40px",
          width: screenSize.isMobile ? "calc(100% - 20px)" : screenSize.isTablet ? "380px" : "420px",
          maxWidth: screenSize.isMobile ? "360px" : screenSize.isTablet ? "380px" : "420px",
          zIndex: 3,
          marginLeft: screenSize.isMobile ? "auto" : "auto",
          marginRight: screenSize.isMobile ? "auto" : screenSize.isTablet ? "40px" : "8vw",
          marginTop: screenSize.isMobile ? "60px" : "auto",
          marginBottom: screenSize.isMobile ? "20px" : "auto",
          minHeight: screenSize.isMobile ? "auto" : screenSize.isTablet ? "520px" : "580px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center"
        }}
      >
        <div style={{ fontWeight: 600, color: "#888", marginBottom: 8, fontSize: screenSize.isMobile ? 12 : 13 }}>TẠO TÀI KHOẢN MỚI</div>
        <div style={{ fontWeight: 700, fontSize: screenSize.isMobile ? 18 : 20, marginBottom: screenSize.isMobile ? 16 : 18 }}>Đăng ký tài khoản</div>
        
        <div style={{ marginBottom: screenSize.isMobile ? 20 : screenSize.isTablet ? 32 : 40 }}>
          {/* Họ và Tên */}
          <div style={{ 
            display: "flex", 
            gap: screenSize.isMobile ? 8 : 12, 
            marginBottom: screenSize.isMobile ? 10 : 12, 
            flexDirection: screenSize.isMobile ? "column" : "row" 
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 500, fontSize: screenSize.isMobile ? 13 : 14, marginBottom: 4 }}>Họ</div>
              <Input
                placeholder="Nhập họ"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                size={screenSize.isMobile ? "middle" : "large"}
              />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 500, fontSize: screenSize.isMobile ? 13 : 14, marginBottom: 4 }}>Tên</div>
              <Input
                placeholder="Nhập tên"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                size={screenSize.isMobile ? "middle" : "large"}
              />
            </div>
          </div>

          {/* Email */}
          <div style={{ fontWeight: 500, fontSize: screenSize.isMobile ? 13 : 14, marginBottom: 4 }}>Email</div>
          <Input
            placeholder="Nhập email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            size={screenSize.isMobile ? "middle" : "large"}
            style={{ marginBottom: screenSize.isMobile ? 10 : 12 }}
          />

          {/* Số điện thoại */}
          <div style={{ fontWeight: 500, fontSize: screenSize.isMobile ? 13 : 14, marginBottom: 4 }}>Số điện thoại</div>
          <Input
            placeholder="Nhập số điện thoại"
            value={phoneNumber}
            onChange={e => setPhoneNumber(e.target.value)}
            size={screenSize.isMobile ? "middle" : "large"}
            style={{ marginBottom: screenSize.isMobile ? 10 : 12 }}
          />

          {/* Mật khẩu */}
          <div style={{ fontWeight: 500, fontSize: screenSize.isMobile ? 13 : 14, marginBottom: 4 }}>Mật khẩu</div>
          <Input.Password
            placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
            value={password}
            onChange={e => setPassword(e.target.value)}
            size={screenSize.isMobile ? "middle" : "large"}
            style={{ marginBottom: screenSize.isMobile ? 10 : 12 }}
          />

          {/* Xác nhận mật khẩu */}
          <div style={{ fontWeight: 500, fontSize: screenSize.isMobile ? 13 : 14, marginBottom: 4 }}>Xác nhận mật khẩu</div>
          <Input.Password
            placeholder="Nhập lại mật khẩu"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            size={screenSize.isMobile ? "middle" : "large"}
          />
        </div>

        <Button
          type="primary"
          block
          size={screenSize.isMobile ? "middle" : "large"}
          loading={loading}
          style={{
            background: "#111",
            borderColor: "#111",
            fontWeight: 600,
            marginBottom: screenSize.isMobile ? 14 : 18,
            borderRadius: 6,
            height: screenSize.isMobile ? 36 : 40,
            border: "1px solid #dadce0",
            transition: "all 0.2s ease",
            fontSize: screenSize.isMobile ? 14 : 16
          }}
          onClick={handleRegister}
        >
          ĐĂNG KÝ
        </Button>
        
        <div style={{ textAlign: "center", color: "#888", margin: "2px 0 14px 0", fontSize: screenSize.isMobile ? 12 : 13 }}>Hoặc</div>
        
        <GoogleLoginButton 
          loading={loading}
          setLoading={setLoading}
          style={{ 
            marginBottom: screenSize.isMobile ? 14 : 18,
            height: screenSize.isMobile ? 36 : 38,
            fontSize: screenSize.isMobile ? 14 : 16
          }}
        >
          Đăng ký với Google
        </GoogleLoginButton>

        <div style={{ textAlign: "center", marginTop: screenSize.isMobile ? 8 : 12, color: "#888", fontSize: screenSize.isMobile ? 12 : 13 }}>
          Đã có tài khoản? <a href="/login" style={{ fontWeight: 600, color: "#111" }}>ĐĂNG NHẬP TẠI ĐÂY</a>
        </div>
      </div>
    </div>
  );
};

export default Registerpage;
