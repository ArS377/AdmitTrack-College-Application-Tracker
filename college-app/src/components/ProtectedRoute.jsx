// ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  let auth = { token: true }; // Replace with actual authentication logic

  return auth.token ? <Outlet /> : <Navigate to="/" />;
}
