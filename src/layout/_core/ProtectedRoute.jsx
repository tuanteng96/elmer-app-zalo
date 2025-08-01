import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useLayout } from "../../layout/LayoutProvider";

const ProtectedRoute = ({ children }) => {
  const { AccessToken } = useLayout();
  const { pathname } = useLocation();

  if (!AccessToken) {
    return <Navigate to={`/?fromProtected=${pathname}`} replace />;
  }

  return children;
};

export default ProtectedRoute;
