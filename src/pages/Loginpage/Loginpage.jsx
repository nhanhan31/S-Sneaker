import React, { useState } from "react";
import { Input, Button, Checkbox, message } from "antd";
import { GoogleOutlined, FacebookOutlined, AppleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const Loginpage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://api-for-be.onrender.com/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        message.success("Login successful!");
        // Lưu token và user info vào localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        // Xử lý remember me
        if (remember) {
          localStorage.setItem("rememberEmail", email);
        } else {
          localStorage.removeItem("rememberEmail");
        }
        // Chuyển về trang chủ sau khi đăng nhập thành công
        navigate("/", { replace: true });
      } else {
        message.error(data.message || "Login failed!");
      }
    } catch (err) {
      message.error("Network error!");
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
        background: `url('https://images.pexels.com/photos/812875/pexels-photo-812875.jpeg?_gl=1*118e1eh*_ga*MTI2MjQ1NjY3NS4xNzUwMTQzMzA2*_ga_8JE65Q40S6*czE3NTAxNDMzMDUkbzEkZzEkdDE3NTAxNDMzOTkkajQ1JGwwJGgw') center center / cover no-repeat`,
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        position: "relative",
        fontFamily: "Inter, Arial, sans-serif"
      }}
    >
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
          Building the Future...
        </div>
        <div style={{ fontSize: 15, color: "#e0e0e0", marginBottom: 32, lineHeight: 1.6 }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
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
        <div style={{ fontWeight: 600, color: "#888", marginBottom: 8, fontSize: 13 }}>WELCOME BACK</div>
        <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 18 }}>Log In to your Account</div>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 4 }}>Email</div>
          <Input
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            size="large"
            style={{ marginBottom: 12 }}
          />
          <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 4 }}>Password</div>
          <Input.Password
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            size="large"
          />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <Checkbox checked={remember} onChange={e => setRemember(e.target.checked)} style={{ fontSize: 13 }}>
            Remember me
          </Checkbox>
          <a href="#" style={{ color: "#888", fontSize: 13 }}>Forgot Password?</a>
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
          onClick={handleLogin}
        >
          CONTINUE
        </Button>
        <div style={{ textAlign: "center", color: "#888", margin: "2px 0 18px 0", fontSize: 13 }}>Or</div>
        <Button
          block
          icon={<GoogleOutlined style={{ color: "#ea4335" }} />}
          style={{
            marginBottom: 10,
            background: "#fff",
            border: "1px solid #eee",
            fontWeight: 500,
            borderRadius: 6,
            height: 38,
            textAlign: "left"
          }}
        >
          Log in with Google
        </Button>
        <Button
          block
          icon={<FacebookOutlined style={{ color: "#1877f3" }} />}
          style={{
            marginBottom: 10,
            background: "#fff",
            border: "1px solid #eee",
            fontWeight: 500,
            borderRadius: 6,
            height: 38,
            textAlign: "left"
          }}
        >
          Log in with Facebook
        </Button>
        <Button
          block
          icon={<AppleOutlined style={{ color: "#111" }} />}
          style={{
            marginBottom: 10,
            background: "#fff",
            border: "1px solid #eee",
            fontWeight: 500,
            borderRadius: 6,
            height: 38,
            textAlign: "left"
          }}
        >
          Log in with Apple
        </Button>
        <div style={{ textAlign: "center", marginTop: 18, color: "#888", fontSize: 13 }}>
          New User? <a href="#" style={{ fontWeight: 600, color: "#111" }}>SIGN UP HERE</a>
        </div>
      </div>
    </div>
  );
};

export default Loginpage;