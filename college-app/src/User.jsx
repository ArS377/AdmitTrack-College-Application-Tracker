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

const validatedAccessToken = async (token) => {
  try {
    const response = await axios.post(
      "http://localhost:3000/api/auth/validate",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.status === 200) {
      console.log("Access token is valid.");
      return token;
    }
  } catch (error) {
    console.error("Access token validation failed:", error);
    return undefined;
  }
};

export function getAccessToken() {
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
        user.accessToken = validatedAccessToken(token);
        console.log("getAccessToken: Parsed accessToken:", token);
      } catch (error) {
        console.error("Error parsing accessToken from session storage:", error);
        user.accessToken = undefined; // Clear if parsing fails
        sessionStorage.removeItem("accessToken"); // Clear invalid token
      }
    }
  }
  console.log("getAccessToken returning:", user.accessToken);
  return user.accessToken;
}

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
