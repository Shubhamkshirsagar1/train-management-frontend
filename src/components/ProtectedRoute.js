import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ auth, isAdmin, adminRoute, children }) => {
  if (!auth) {
    return <Navigate to="/login" />;
  }

  if (adminRoute && !isAdmin) {
    return <Navigate to="/" />;
  }

  if (!adminRoute && isAdmin) {
    return <Navigate to="/admin" />;
  }

  return children;
};

export default ProtectedRoute;
