import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const getRoleFromToken = (token) => {
  try {
    const decodedToken = jwtDecode(token);
    return decodedToken?.[
      "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
    ];
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

const RoleProtectedRoute = ({ allowedRoles, children }) => {
  const token = localStorage.getItem("jwt");
  const role = token ? getRoleFromToken(token) : null;

  if (!token || !allowedRoles.includes(role)) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default RoleProtectedRoute;
