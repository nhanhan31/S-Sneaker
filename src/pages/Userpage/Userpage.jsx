import React from "react";
import { Layout, Menu, Avatar, Typography, Divider } from "antd";
import { UserOutlined, EditOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";

const { Sider, Content } = Layout;
const { Title, Text } = Typography;

const Userpage = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { key: "user", label: "User" },
    { key: "edit", label: "Edit" },
  ];

  const selectedKey =
    location.pathname.includes("edit") ? "edit" : "user";

  return (
    <Layout style={{ minHeight: "100vh", background: "#fff" }}>
      <Sider
        width={220}
        style={{
          background: "#f5f5f5",
          paddingTop: 40,
          borderRight: "1px solid #eee",
        }}
        breakpoint="lg"
        collapsedWidth="0"
      >
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <Avatar
            src={user?.image || null}
            size={100}
            icon={<UserOutlined />}
            style={{ background: "#222", marginBottom: 16 }}
          />
          <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 8 }}>
            {user?.firstName?.[0] || ""}.{user?.lastName || ""}
          </div>
        </div>
        <Menu
          mode="vertical"
          selectedKeys={[selectedKey]}
          style={{ border: "none", background: "transparent" }}
          items={menuItems}
          onClick={({ key }) => {
            if (key === "edit") navigate("/user-setting");
            if (key === "user") navigate("/user");
          }}
        />
      </Sider>
      <Layout>
        <Content style={{ padding: "32px 40px 0 40px", background: "#fff" }}>
          <div style={{ borderBottom: "1px solid #eee", marginBottom: 24 }}>
            <Title level={3} style={{ margin: 0, color: "#1a237e", fontWeight: 700 }}>
              User Manage
            </Title>
            <div style={{ color: "#888", margin: "8px 0 16px 0" }}>
              Home / User
            </div>
          </div>
          <div style={{ marginBottom: 24 }}>
            <Text strong>Email :</Text>{" "}
            <Text>{user?.email || "N/A"}</Text>
            <br />
            <Text strong>User id :</Text>{" "}
            <Text>{user?.userId || "N/A"}</Text>
          </div>
          <Title level={4} style={{ fontWeight: 700, marginBottom: 24 }}>
            {user?.firstName} {user?.lastName}
          </Title>
          <div style={{ display: "flex", gap: 64 }}>
            <div style={{ minWidth: 220 }}>
              <div style={{ marginBottom: 16 }}>
                <Text type="secondary">Full Name</Text>
                <div>{user?.firstName} {user?.lastName}</div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <Text type="secondary">Gender</Text>
                <div>{user?.gender || "Male"}</div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <Text type="secondary">Language</Text>
                <div>{user?.language || "English"}</div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <Text type="secondary">Phone</Text>
                <div>{user?.phoneNumber || "N/A"}</div>
              </div>
            </div>
            <div style={{ minWidth: 220 }}>
              <div style={{ marginBottom: 16 }}>
                <Text type="secondary">Nick Name</Text>
                <div>{user?.lastName || "N/A"}</div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <Text type="secondary">Country</Text>
                <div>{user?.country || "Viet Nam"}</div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <Text type="secondary">Address</Text>
                <div>{user?.address || "N/A"}</div>
              </div>
            </div>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Userpage;