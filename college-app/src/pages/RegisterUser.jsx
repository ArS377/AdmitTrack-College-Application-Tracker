import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { setAccessToken } from "../utils/axiosConfig";
import "../components/FormContainer.css";

export function RegisterUser() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match. Please try again.");
      return;
    }
    try {
      const response = await axios.post(
        `${apiUrl}/users`,
        { fullName, email, password },
        { headers: { "Content-Type": "application/json" } }
      );
      if (response && response.status === 200) {
        // Auto-login after successful registration
        const loginResponse = await axios.post(
          `${apiUrl}/auth/login`,
          { email, password },
          { headers: { "Content-Type": "application/json" } }
        );
        if (loginResponse && loginResponse.status === 200) {
          setAccessToken(loginResponse.data.accessToken);
          navigate("/home");
          return;
        }
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Registration failed. Please try again.";
      alert(message);
    }
    navigate("/");
  };

  return (
    <div className="form-container">
      <div className="form-box">
        <h2>Create Account</h2>
        <p>Sign up to start your college application journey.</p>
        <form onSubmit={handleRegister}>
          <label>Full Name</label>
          <input
            type="text"
            placeholder="Your full name"
            value={fullName}
            required
            onChange={(e) => setFullName(e.target.value)}
            autoComplete="name"
          />
          <label>Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          <label>Password</label>
          <input
            type="password"
            placeholder="Create a password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
          <label>Confirm Password</label>
          <input
            type="password"
            placeholder="Repeat your password"
            value={confirmPassword}
            required
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
          />
          <br />
          <button className="btn btn-primary" type="submit">
            Create Account
          </button>
        </form>
        <p style={{ textAlign: "center", marginTop: "16px", color: "var(--grey-mid)" }}>
          Already have an account?{" "}
          <a href="/" style={{ fontWeight: 600 }}>
            Sign in here
          </a>
        </p>
      </div>
    </div>
  );
}
