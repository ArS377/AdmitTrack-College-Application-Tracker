// ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { getAccessToken } from "../User.jsx"; // Adjust the import path as necessary

export default function ProtectedRoute() {
  return getAccessToken() ? <Outlet /> : <Navigate to="/" />;
}
