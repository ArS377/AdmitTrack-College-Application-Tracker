import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;
function logoutFromServer() {
  try {
    axios.post(
      `${apiUrl}/auth/logout`,
      {},
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error encountered in logout: ", error);
  }
}
/**
 *
 * @returns accessToken
 */
export function getAccessToken() {
  /*
   * Read accessToken from sessionStorage and return it.
   */
  // accessToken is not set, try to get it from session storage
  const sessionAccessToken = sessionStorage.getItem("accessToken");
  if (!sessionAccessToken) return null;

  try {
    const token = JSON.parse(sessionAccessToken);
    console.log("getAccessToken: accessToken:", token);
    return token;
  } catch (error) {
    console.error("Error parsing accessToken", error);
    return null;
  }
}

export function setAccessToken(token) {
  console.log("setAccessToken:", token);
  if (!token) {
    // Attempting to set an invalid access token, could be a logout situation.
    // let us remove the access token from the session.
    sessionStorage.removeItem("accessToken"); // Clear the access token from session storage
    console.log("Access token cleared from session storage.");
    return;
  } else {
    sessionStorage.setItem("accessToken", JSON.stringify(token));
  }
}
export function logout(bSkipLogoutFromServer = false) {
  if (!bSkipLogoutFromServer) logoutFromServer();
  setAccessToken(undefined); // Clear the access token
  console.log("User logged out.");
}

export async function validateAccessToken() {
  try {
    const accessToken = getAccessToken();
    const response = await axios.post(
      `${apiUrl}/auth/validate`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (response?.status === 200) {
      return true;
    }
    console.warn("Access token is invalid: ", response?.statusText);
  } catch (error) {
    console.error("Access token validation failed:", error);
  }
  handleSignOut();
}

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
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // ask to refresh the accesstoken
        const response = await axios.post(
          `${apiUrl}/auth/accesstoken`,
          {},
          { headers: { "Content-Type": "application/json" } }
        );
        if (response?.status === 200) {
          console.log("Access token refreshed successfully:", response.data);
          setAccessToken(response.data?.access_token); // Update the access token in UserStore
          originalRequest.headers.Authorization = `Bearer ${response.data.access_token}`;
          console.log("Retrying original request with new access token");
          return axios(originalRequest);
        }
        // refresh access token is denied
        console.error("Failed to refresh access token:", response?.statusText);

        //TODO need to validate if this is correct way to handle retry
      } catch (refreshError) {
        console.error("Refreshing access_token failed:", refreshError);
      }
      // unauthorized and refresh token didn't succeed. so, let us signout.
      handleSignOut(true);
    }
    if (error.response?.status === 403) {
      // access prohibited
      // no need to signout. the user still can access the functionality that they have
      // been authorized to.
    }
  }
);
