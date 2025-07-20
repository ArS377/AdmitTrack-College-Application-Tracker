import { useNavigate } from "react-router-dom";
import { useState } from "react";

export function RegisterUser() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    const userData = {
      fullName: fullName,
      email: email,
      password: password,
    };

    await fetch("http://localhost:3000/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    navigate("/");
  };

  return (
    <div className="register-user-container">
      <h2>Register User</h2>
      {/* Registration form will go here */}
      <p>Please fill in the details to register</p>
      <label>Full Name:</label>
      <input
        type="fullName"
        placeholder="Enter your Full Name"
        required
        onChange={(e) => setFullName(e.target.value)}
      />
      <br />
      <label>Email:</label>
      <input
        type="email"
        placeholder="Enter your email"
        required
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />
      <label>Password:</label>
      <input
        type="password"
        placeholder="Enter your password"
        required
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <button className="btn btn-primary" onClick={handleRegister}>
        Register
      </button>
      <p>
        Already have an account? <a href="/">Login here</a>
      </p>
      <p>
        By registering, you agree to our <a href="/terms">Terms of Service</a>{" "}
        and <a href="/privacy">Privacy Policy</a>. Need help?{" "}
        <a href="/help">Contact support</a>
      </p>
    </div>
  );
}
