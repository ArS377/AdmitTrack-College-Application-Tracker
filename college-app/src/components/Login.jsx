import "./FormContainer.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setAccessToken } from "../utils/axiosConfig";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const skipLogin = import.meta.env.VITE_AUTO_FILL_TEST_USER === "true";
  const testUser = import.meta.env.VITE_TEST_USER || "";
  const testPassword = import.meta.env.VITE_TEST_PASSWORD || "";

  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e && e.preventDefault();
    console.log("[Login] Submitting login for:", email);
    try {
      const response = await axios.post(
        `${apiUrl}/auth/login`,
        { email, password },
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );
      console.log("[Login] Response status:", response?.status, "data:", response?.data);
      if (response && response.status === 200) {
        console.log("[Login] Token received:", response.data.accessToken ? "yes" : "NO TOKEN");
        setAccessToken(response.data.accessToken);
        console.log("[Login] Navigating to /home");
        navigate("/home");
      }
    } catch (error) {
      console.error("[Login] Error:", error.response?.status, error.response?.data);
      const message =
        error.response?.data?.message ||
        "An error occurred during login. Please try again.";
      alert(message);
    }
  };

  useEffect(() => {
    if (skipLogin) {
      setEmail(testUser);
      setPassword(testPassword);
    }
  }, []);

  return (
    <div className="form-container">
      <div className="form-box">
        <h2>Sign In</h2>
        <p>Welcome back — enter your credentials to continue.</p>
        <form onSubmit={handleLogin}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            placeholder="you@example.com"
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <label>Password</label>
          <input
            type="password"
            value={password}
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
          <br />
          <button className="btn btn-primary" type="submit">
            Sign In
          </button>
        </form>
        <br />
        <p style={{ textAlign: "center", marginTop: "16px", color: "var(--grey-mid)" }}>
          Don't have an account?{" "}
          <a href="/register" style={{ fontWeight: 600 }}>
            Create one here
          </a>
        </p>
        <p style={{ textAlign: "center", color: "var(--grey-mid)", fontSize: "13px" }}>
          <a href="/forgot-password">Forgot your password?</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
