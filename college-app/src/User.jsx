// UserStore.js
import axios from "axios";

let user = { name: "", email: "", accessToken: undefined };

export function setUser(newUser) {
  user = newUser;
  console.log("setUser accessToken:", user.accessToken);
}

export function getUser() {
  console.log("getUser accessToken:", user.accessToken);
  return user;
}

const isAccessTokenValid = async (token) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  try {
    const response = await axios.post(
      `${apiUrl}/auth/validate`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response && response.status === 200) {
      return true;
    } else {
      response &&
        console.warn("Access token is invalid: ", response.statusText);
      return false;
    }
  } catch (error) {
    console.error("Access token validation failed:", error);
    return false;
  }
};

export const getAccessToken = () => {
  if (!user.accessToken) {
    // accessToken is not set, try to get it from session storage
    const sessionAccessToken = sessionStorage.getItem("accessToken");
    console.log(
      "getAccessToken: Retrieving accessToken from session:",
      sessionAccessToken
    );
    if (sessionAccessToken) {
      try {
        const token = JSON.parse(sessionAccessToken);
        console.log("getAccessToken: Parsed accessToken:", token);
        setAccessToken(isAccessTokenValid(token) ? token : undefined);
      } catch (error) {
        console.error("Error parsing accessToken from session storage:", error);
        setAccessToken(undefined); // Clear if parsing fails
      }
    } else {
      console.warn("No accessToken found in session storage.");
      // setAccessToken(undefined); // Clear if no token is found
    }
  }
  return user.accessToken;
};

export function setAccessToken(token) {
  user.accessToken = token;
  console.log("setAccessToken:", token);
  if (!token) {
    sessionStorage.removeItem("accessToken"); // Clear the access token from session storage
    console.log("Access token cleared from session storage.");
    return;
  } else {
    sessionStorage.setItem("accessToken", JSON.stringify(token));
  }
}
