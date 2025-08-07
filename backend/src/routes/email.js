const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

const nodemailer = require("nodemailer");
require("dotenv").config();

// Send the email
router.post("/email/reset-password", (req, res) => {
  // Define mail options
  const forgotPassword = {
    subject: "Reset Your Password",
    text: "Hello, please click the link below to reset your password.\n\nhttp://localhost:5173/reset-password?token=",
  };

  const { to } = req.body;

  const emailToken = jwt.sign({ email: to }, process.env.EMAIL_TOKEN_SECRET, {
    expiresIn: process.env.EMAIL_TOKEN_EXPIRY,
  });

  const transporter = nodemailer.createTransport({
    service: "gmail", // or 'SMTP' if your using a different provider
    auth: {
      user: process.env.EMAIL_APP_USER, // Your Gmail address
      pass: process.env.EMAIL_APP_PASSWORD, // The 16-character app password
    },
  });

  const mailOptions = {
    from: "soma.ellappan.1@gmail.com",
    to: to,
    subject: forgotPassword.subject,
    text: forgotPassword.text + emailToken, // Assuming token is passed in the request body
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      return res.status(500).send("Error sending email");
    }
    console.log("Email sent:", info.response);
    res.status(200).send("Email sent successfully");
  });
});

router.post("/email/verify-token", (req, res) => {
  const { token } = req.body;
  console.log("Verifying token:", token);
  if (!token) {
    return res.status(400).json({ message: "Token is required" });
  }
  jwt.verify(token, process.env.EMAIL_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.error("Token verification failed:", err.message);
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    console.log("Token is valid for email:", decoded.email);
    res.status(200).json({ email: decoded.email });
  });
});

module.exports = router;
