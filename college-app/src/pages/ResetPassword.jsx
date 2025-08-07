import axios from "axios";
import "../components/FormContainer.css";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [queryParams] = useSearchParams();
  const token = queryParams.get("token");
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    // Logic to verify the token and allow password update

    const verifyToken = async () => {
      // Logic to verify the token and allow password update
      console.log("Verifying token from URL");
      if (!token) {
        console.error("No token provided in the URL.");
        alert("No token provided. Please check the link.");
        return navigate("/"); // Redirect to home if no token is provided
      }
      console.log("Token from URL:", token);
      const response = await axios.post(`${apiUrl}/email/verify-token`, {
        token: token,
      });

      if (response && response.status === 200) {
        console.log("Token is valid, you can update the password.");
        setEmail(response.data.email); // Use the email from the token to update the password
      } else {
        console.error("Invalid token, cannot update password.");
        // Optionally, redirect to an error page or show a message
        return navigate("/"); // Redirect to an error page
      }
    };

    verifyToken();
  }, []);

  const handleUpdatePassword = async () => {
    // Logic to handle password update
    // Here you would typically send a request to your backend to update the password
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match. Please try again.");
      return;
    }
    const response = await axios.put(`${apiUrl}/users/password`, {
      token: token, // Include the token in the request
      newPassword: newPassword,
    });
    if (response && response.status === 200) {
      alert("Password updated successfully!");
      // Optionally, redirect to a different page or clear the input
      navigate("/");
    } else {
      alert("Failed to update password. Please try again.");
    }
    console.log("Password update response:", response);
  };

  return (
    <div className="form-container">
      <div className="form-box">
        <h2>Update Password</h2>
        <p>Please enter your email to update your password</p>
        <br />
        <label>Email:</label>
        <input
          type="email"
          value={email}
          placeholder="Enter your email"
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <label>New Password:</label>
        <input
          type="password"
          value={newPassword}
          required
          placeholder="Enter your new password"
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <label>Confirm New Password:</label>
        <input
          type="password"
          value={confirmPassword}
          required
          placeholder="Confirm your new password"
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <br />
        <br />
        <button className="btn btn-primary" onClick={handleUpdatePassword}>
          Update Password
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
