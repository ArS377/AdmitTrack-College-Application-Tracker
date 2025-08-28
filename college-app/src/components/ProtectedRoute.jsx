// ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { getAccessToken } from "../utils/axiosConfig";

export default function ProtectedRoute() {
  return getAccessToken() ? <Outlet /> : <Navigate to="/" />;
}
