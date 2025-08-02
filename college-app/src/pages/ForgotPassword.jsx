import "../components/FormContainer.css";
export default function ForgotPassword() {
  const handleResetPassword = () => {
    // Logic to handle password reset
    // Here you would typically send a request to your backend to initiate the password reset process
    window.location.href = "/update-password"; // Redirect to update password page
  };
  return (
    <div className="form-container">
      <div className="form-box">
        <h2>Forgot Your Password?</h2>
        <br />
        <p>Please enter your email to reset your password</p>
        <label>Email:</label>
        <input type="email" placeholder="Enter your email" />
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
