import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;
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

export function logout(bSkipLogoutFromServer = false) {
  if (!bSkipLogoutFromServer) logoutFromServer();
  setAccessToken(undefined); // Clear the access token
  console.log("User logged out.");
  window.location.href = "/";
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
  return false;
}

async function getNewAccessToken() {
  const refreshAxios = axios.create();
  let response = undefined;
  try {
    response = await refreshAxios.post(
      `${apiUrl}/auth/accesstoken`,
      {},
      { withCredentials: true }
    );
    if (response?.status === 200) {
      console.log("Access token refreshed successfully:", response.data);
      setAccessToken(response.data?.accessToken); // Update the access token in UserStore
      return response.data?.accessToken;
    }
  } catch (error) {
    console.error("Error in refreshing access token:", error);
  }
  console.error("Error in refreshing access token:", response?.statusText);
  return undefined;
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
    if (originalRequest.url.includes("/auth/accesstoken")) {
      return Promise.reject(error);
    }
    if (error.response?.status === 401 && !originalRequest._retry) {
      const newAccessToken = await getNewAccessToken();
      if (newAccessToken) {
        console.log("Successfully refreshed accesstoken!");
        originalRequest._retry = true;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axios(originalRequest);
      }
      // unauthorized and refresh token didn't succeed. so, let us signout.
      logout(true);
    }
    if (error.response?.status === 403) {
      // access prohibited
      // no need to signout. the user still can access the functionality that they have
      // been authorized to.
      console.warn("Forbidden - not signing out");
    }
    return Promise.reject(error);
  }
);
