import "../components/FormContainer.css";
export default function UpdatePassword() {
  const handleUpdatePassword = () => {
    // Logic to handle password update
    // Here you would typically send a request to your backend to update the password
    window.location.href = "/"; // Redirect to home page after updating password
  };
  return (
    <div className="form-container">
      <div className="form-box">
        <h2>Update Password</h2>
        <p>Please enter your email to update your password</p>
        <br />
        <label>Email:</label>
        <input type="email" placeholder="Enter your email" />
        <label>New Password:</label>
        <input type="password" placeholder="Enter your new password" />
        <label>Confirm New Password:</label>
        <input type="password" placeholder="Confirm your new password" />
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
