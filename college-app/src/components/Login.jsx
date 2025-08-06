import "./FormContainer.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setAccessToken } from "../User.jsx";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const skipLogin = import.meta.env.VITE_AUTO_FILL_TEST_USER === "true";
  const apiUrl = import.meta.env.VITE_API_URL;

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e && e.preventDefault();
    const userData = {
      email: email,
      password: password,
    };

    try {
      const response = await axios.post(`${apiUrl}/auth/login`, userData, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200) {
        console.log("Login successful:", response.data);
        console.log("email:", email);
        setAccessToken(response.data.access_token); // Update the access token in UserStore
        navigate("/home");
      } else {
        console.error("Login failed:", response.data);
        alert(response.data.message || "Login failed");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred during login. Please try again.");
    }
  };

  useEffect(() => {
    if (skipLogin) {
      setEmail("soma.ellappan@gmail.com");
      setPassword("password123");
    }
  }, []);

  return (
    <div className="form-container">
      <div className="form-box">
        <h2>Login</h2>
        <p>Please enter your credentials to log in</p>
        <br />
        <label>Email:</label>
        <input
          type="text"
          value={email}
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <label>Password:</label>
        <input
          type="password"
          value={password}
          placeholder="Enter your password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <br />
        <button className="btn btn-primary" onClick={handleLogin}>
          Login
        </button>
        <br />
        <br />
        <p>
          Don't have an account? <a href="/register">Register here</a>.<br />
          Forgot your password? <a href="/forgot-password">
            Reset it here
          </a>.{" "}
        </p>
        <p>
          Or sign in with: <button className="btn btn-secondary">Google</button>{" "}
          <button className="btn btn-secondary">Facebook</button>{" "}
          <button className="btn btn-secondary">Twitter</button>
        </p>
      </div>
      <p>
        By logging in, you agree to our <a href="/terms">Terms of Service</a>{" "}
        and <a href="/privacy">Privacy Policy</a>. Need help?{" "}
        <a href="/help">Contact support</a>. Check out our{" "}
        <a href="/features">Features</a> and <a href="/pricing">Pricing</a>.
        Follow us on <a href="/social-media">Social Media</a> for updates. Read
        our <a href="/blog">Blog</a> for tips and news. Join our community on{" "}
        <a href="/forum">Forum</a>. Subscribe to our{" "}
        <a href="/newsletter">Newsletter</a> for the latest updates. Check out
        our <a href="/faq">FAQ</a> for common questions. Want to learn more?
        Visit our <a href="/about">About Us</a> page. Have feedback?{" "}
        <a href="/feedback">Share your thoughts</a>. Want to collaborate?{" "}
        <a href="/partnerships">Partner with us</a>.
      </p>
    </div>
  );
};

export default Login;
