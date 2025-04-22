import React from "react";
import { Navigate } from "react-router-dom";

const AdminProtectedRoutes = ({ children }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role"); // assuming role is stored in localStorage
  const email = localStorage.getItem("email"); // assuming role is stored in localStorage

  // If no token or role is found, redirect to login
  if (!token || !userRole) {
    return <Navigate to="/login" replace />;
  }

  // Check if the user is an admin
  if (userRole !== "Admin" && email != "admin@gmail.com") {
    return <Navigate to="/unauthorized" replace />; // Or any page you want
  }

  return children;
};

export default AdminProtectedRoutes;
