import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getAllRoles } from "../utils/roleApi";

const PrivateRoute = ({ children, allowedRoles }) => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchRoles = async () => {
      const res = await getAllRoles(token);
      // SỬA: lấy từ res.data.role thay vì res.data.roles
      if (res.ok && res.data && Array.isArray(res.data.role)) {
        setRoles(res.data.role);
      }
      setLoading(false);
    };
    fetchRoles();
  }, []);

  if (loading) return null; // hoặc spinner

  // allowedRoles là mảng roleId, ví dụ: [1, 2]
  if (!user?.roleId || (allowedRoles && !allowedRoles.includes(user.roleId))) {
    return <Navigate to="/login" replace />;
  }

  // Bạn có thể dùng biến roles ở đây nếu cần hiển thị hoặc kiểm tra thêm
  return children;
};

export default PrivateRoute;