import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, allowedRoles }) => {
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchRoles = async () => {
      
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