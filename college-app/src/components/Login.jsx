import "./Login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setUser } from "../User.jsx";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const userData = {
      email: email,
      password: password,
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        userData,
        { headers: { "Content-Type": "application/json" } }
      );

      /*
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log("Login successful:", data);
        navigate("/home");
      } else {
        const errorData = await response.json();
        console.error("Login failed:", errorData);
        alert(errorData.message || "Login failed");
      }
      */
      if (response.status === 200) {
        console.log("Login successful:", response.data);
        setUser({ email });
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

  return (
    <div className="login-container">
      <h2>Login</h2>
      <p>Please enter your credentials to log in</p>
      <br />
      <label>Email:</label>
      <input
        type="text"
        placeholder="Enter your email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />
      <label>Password:</label>
      <input
        type="password"
        placeholder="Enter your password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <button className="btn btn-primary" onClick={handleLogin}>
        Login
      </button>
      <p>
        Don't have an account? <a href="/register">Register here</a>
      </p>
      <p>
        Forgot your password? <a href="/reset-password">Reset it here</a>
      </p>
      <p>
        Or sign in with:
        <button className="btn btn-secondary">Google</button>
        <button className="btn btn-secondary">Facebook</button>
        <button className="btn btn-secondary">Twitter</button>
      </p>
      <p>
        By logging in, you agree to our <a href="/terms">Terms of Service</a>{" "}
        and <a href="/privacy">Privacy Policy</a>. Need help?{" "}
        <a href="/help">Contact support</a>
        Check out our <a href="/features">Features</a> and{" "}
        <a href="/pricing">Pricing</a>. Follow us on{" "}
        <a href="/social-media">Social Media</a> for updates. Read our{" "}
        <a href="/blog">Blog</a> for tips and news. Join our community on{" "}
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
