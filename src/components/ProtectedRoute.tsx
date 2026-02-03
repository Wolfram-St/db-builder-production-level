// src/components/ProtectedRoute.jsx
// Modified to allow all access - no authentication required
import { Outlet } from "react-router-dom";

export const ProtectedRoute = () => {
  // No authentication - just render the outlet
  return <Outlet />;
};