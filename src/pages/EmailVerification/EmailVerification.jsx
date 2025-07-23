import React, { useEffect, useState } from "react";
import { Result, Button, Spin, Typography } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined, MailOutlined } from "@ant-design/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import { verifyEmail } from "../../utils/authApi";

const { Title, Paragraph } = Typography;

const EmailVerification = () => {
  const [loading, setLoading] = useState(true);
  const [verificationResult, setVerificationResult] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const token = searchParams.get('token');

  useEffect(() => {
    const handleVerifyEmail = async () => {
      if (!token) {
        setVerificationResult({
          success: false,
          message: "Token không hợp lệ hoặc không tồn tại"
        });
        setLoading(false);
        return;
      }

      try {
        const result = await verifyEmail(token);
        
        if (result.ok) {
          setVerificationResult({
            success: true,
            message: result.data.message || "Email đã được xác minh thành công!"
          });
        } else {
          setVerificationResult({
            success: false,
            message: result.data.message || "Xác minh email thất bại!"
          });
        }
      } catch (error) {
        console.error("Email verification error:", error);
        setVerificationResult({
          success: false,
          message: "Có lỗi xảy ra khi xác minh email"
        });
      } finally {
        setLoading(false);
      }
    };

    handleVerifyEmail();
  }, [token]);

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        fontFamily: "Inter, Arial, sans-serif"
      }}>
        <div style={{
          background: "#fff",
          borderRadius: 16,
          padding: "60px 40px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
          textAlign: "center",
          maxWidth: 400,
          width: "90%"
        }}>
          <Spin size="large" />
          <Title level={4} style={{ marginTop: 24, color: "#333" }}>
            Đang xác minh email...
          </Title>
          <Paragraph style={{ color: "#666", margin: 0 }}>
            Vui lòng đợi trong giây lát
          </Paragraph>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: verificationResult?.success 
        ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        : "linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)",
      fontFamily: "Inter, Arial, sans-serif",
      padding: 20
    }}>
      <div style={{
        background: "#fff",
        borderRadius: 16,
        padding: "40px",
        boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
        textAlign: "center",
        maxWidth: 500,
        width: "100%"
      }}>
        <Result
          icon={verificationResult?.success ? 
            <CheckCircleOutlined style={{ color: "#52c41a", fontSize: 72 }} /> :
            <CloseCircleOutlined style={{ color: "#ff4d4f", fontSize: 72 }} />
          }
          title={
            <Title level={2} style={{ 
              color: verificationResult?.success ? "#52c41a" : "#ff4d4f",
              marginBottom: 16
            }}>
              {verificationResult?.success ? "Xác minh thành công!" : "Xác minh thất bại!"}
            </Title>
          }
          subTitle={
            <Paragraph style={{ 
              fontSize: 16, 
              color: "#666",
              lineHeight: 1.6,
              marginBottom: 32
            }}>
              {verificationResult?.message}
            </Paragraph>
          }
          extra={[
            <div key="actions" style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              {verificationResult?.success ? (
                <>
                  <Button
                    type="primary"
                    size="large"
                    icon={<MailOutlined />}
                    onClick={() => navigate("/login")}
                    style={{
                      background: "#52c41a",
                      borderColor: "#52c41a",
                      height: 44,
                      borderRadius: 8,
                      fontWeight: 600,
                      minWidth: 140
                    }}
                  >
                    Đăng nhập ngay
                  </Button>
                  <Button
                    size="large"
                    onClick={() => navigate("/")}
                    style={{
                      height: 44,
                      borderRadius: 8,
                      fontWeight: 600,
                      minWidth: 120
                    }}
                  >
                    Về trang chủ
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    type="primary"
                    size="large"
                    onClick={() => navigate("/register")}
                    style={{
                      background: "#ff4d4f",
                      borderColor: "#ff4d4f",
                      height: 44,
                      borderRadius: 8,
                      fontWeight: 600,
                      minWidth: 140
                    }}
                  >
                    Đăng ký lại
                  </Button>
                  <Button
                    size="large"
                    onClick={() => navigate("/")}
                    style={{
                      height: 44,
                      borderRadius: 8,
                      fontWeight: 600,
                      minWidth: 120
                    }}
                  >
                    Về trang chủ
                  </Button>
                </>
              )}
            </div>
          ]}
        />
      </div>
    </div>
  );
};

export default EmailVerification;