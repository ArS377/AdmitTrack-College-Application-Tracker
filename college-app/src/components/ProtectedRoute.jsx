// ProtectedRoute.jsx
import { useEffect, useLayoutEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";
import { getUser } from "../User.jsx"; // Adjust the import path as necessary

export default function ProtectedRoute() {
  let accessToken = getUser().accessToken;
  console.log("Access Token in ProtectedRoute:", accessToken);
  useEffect(() => {
    // This effect can be used to check authentication status or perform any side effects
    // For example, you could check if the user is authenticated and update the auth state accordingly
    const authInterceptor = axios.interceptors.request.use((config) => {
      config.headers.Authorization =
        !config._retry && getUser().accessToken
          ? `Bearer ${getUser().accessToken}`
          : config.headers.Authorization;
      return config;
    });
  }, []);

  useLayoutEffect(() => {
    const refreshAccessToken = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          if (
            error.response.status === 403 &&
            error.response.data.message === "Unauthorized"
          ) {
            try {
              const response = await axios.post(
                "http://localhost:3000/api/auth/accesstoken",
                {},
                { headers: { "Content-Type": "application/json" } }
              );
              accessToken = response.data.access_token;
              getUser().accessToken = accessToken; // Update the access token in UserStore
              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
              return axios(originalRequest);
            } catch (refreshError) {
              console.error("Refreshing access_token failed:", refreshError);
            }
          }
        }
      }
    );
  }, []);
  return getUser().accessToken ? <Outlet /> : <Navigate to="/" />;
}
