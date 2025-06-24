import React from "react";
import { Layout, Menu, Avatar, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useNavigate, useLocation, Outlet } from "react-router-dom";

const { Sider, Content } = Layout;

const Userpage = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { key: "user", label: "Infomation" },
    { key: "edit", label: "Edit Infomation" },
    { key: "order", label: "Order" },
  ];

  const selectedKey =
    location.pathname.includes("edit")
      ? "edit"
      : location.pathname.includes("order")
      ? "order"
      : "user";

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
            if (key === "edit") navigate("/user/edit-info");
            if (key === "user") navigate("/user");
            if (key === "order") navigate("/user/order");
          }}
        />
      </Sider>
      <Layout>
        <Content style={{ padding: "32px 40px 0 40px", background: "#fff" }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default Userpage;