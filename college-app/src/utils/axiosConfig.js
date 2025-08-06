import axios from "axios";
import { getAccessToken, setAccessToken } from "../User.jsx"; // Adjust the import path as necessary

axios.interceptors.request.use((config) => {
  const accessToken = getAccessToken();
  console.log("Setting Authorization header with accessToken:", accessToken);
  config.headers.Authorization =
    !config._retry && accessToken
      ? `Bearer ${accessToken}`
      : config.headers.Authorization;
  return config;
});
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const response = await axios.post(
          "http://localhost:3000/api/auth/accesstoken",
          {},
          { headers: { "Content-Type": "application/json" } }
        );
        if (response && response.status === 200) {
          console.log("Access token refreshed successfully:", response.data);
          setAccessToken(response.data.access_token); // Update the access token in UserStore
          originalRequest.headers.Authorization = `Bearer ${response.data.access_token}`;
          console.log("Retrying original request with new access token");
          return axios(originalRequest);
        } else {
          console.error("Failed to refresh access token:", response.statusText);
          setAccessToken(undefined);
        }

        //TODO need to validate if this is correct way to handle retry
      } catch (refreshError) {
        console.error("Refreshing access_token failed:", refreshError);
        setAccessToken(undefined);
      }
    }
    if (error.response.status === 401) {
      setAccessToken(undefined);
    }
  }
);
