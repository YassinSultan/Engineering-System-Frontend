// src/components/ProtectedRoute.jsx
import { useAuth } from "../hooks/useAuth";
import { Navigate, useLocation } from "react-router";

export default function ProtectedRoute({ children, requirePermission }) {
  const { token, hasPermission } = useAuth();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (requirePermission && !hasPermission(requirePermission)) {
    return <Navigate to="/forbidden" replace />;
  }

  return children;
}
