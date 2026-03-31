import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import "../components/FormContainer.css";
import WelcomeMessage from "../components/WelcomeMessage";

export function RegisterUser() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const apiUrl = import.meta.env.VITE_API_URL;

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    const userData = {
      fullName: fullName,
      email: email,
      password: password,
    };

    try {
      if (password !== confirmPassword) {
        alert("Passwords do not match. Please try again.");
        return;
      }
      const response = await axios.post(`${apiUrl}/users`, userData, {
        headers: { "Content-Type": "application/json" },
      });
      if (response && response.status === 200) {
        console.log("Registration successful:", response.data);
      } else {
        console.error(
          "Registration failed: ",
          response ? response.data : "No response from server"
        );
        alert((response && response.data.message) || "Registration failed");
      }
    } catch (error) {
      console.error("Error during registration:", error);
    }
    return navigate("/");
  };

  return (
    <>
      <WelcomeMessage />
      <div className="form-container">
        <div className="form-box">
          <h2>Register User</h2>
          {/* Registration form will go here */}
          <p>Please fill in the details to register</p>
          <br />
          <label>Full Name:</label>
          <input
            type="fullName"
            placeholder="Enter your Full Name"
            value={fullName}
            required
            onChange={(e) => setFullName(e.target.value)}
          />
          <br />
          <label>Email:</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          <br />
          <label>Password:</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <label>Confirm password:</label>
          <input
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            required
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <br />
          <br />
          <button className="btn btn-primary" onClick={handleRegister}>
            Register
          </button>
          <br />
          <br />
          <p>
            Already have an account? <a href="/">Login here</a>
          </p>
        </div>
        <p>
          By registering, you agree to our <a href="/terms">Terms of Service</a>{" "}
          and <a href="/privacy">Privacy Policy</a>. Need help?{" "}
          <a href="/help">Contact support</a>
        </p>
      </div>
    </>
  );
}
