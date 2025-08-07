import axios from "axios";
import "../components/FormContainer.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const apiUrl = import.meta.env.VITE_API_URL;

  const navigate = useNavigate();

  useEffect(() => {
    const skipLogin = import.meta.env.VITE_AUTO_FILL_TEST_USER === "true";
    const testUser =
      import.meta.env.VITE_TEST_USER || "soma.ellappan@gmail.com";
    if (skipLogin) {
      setEmail(testUser);
    }
  }, []);

  const handleResetPassword = async () => {
    // Logic to handle password reset
    // Here you would typically send a request to your backend to initiate the password reset process
    const response = await axios.post(`${apiUrl}/email/reset-password`, {
      to: email,
    });
    // Handle the response from the backend
    if (response && response.status === 200) {
      alert("Password reset email sent successfully!");
      // Optionally, redirect to a different page or clear the input
      navigate("/");
    } else {
      alert("Failed to send password reset email. Please try again.");
    }
  };
  return (
    <div className="form-container">
      <div className="form-box">
        <h2>Forgot Your Password?</h2>
        <br />
        <p>Please enter your email to reset your password</p>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          placeholder="Enter your email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <br />
        <br />
        <button className="btn btn-primary" onClick={handleResetPassword}>
          Reset Password
        </button>
        <br />
        <br />
        <p>
          Remembered your password? <a href="/">Login here</a>.
        </p>
      </div>
    </div>
  );
}
