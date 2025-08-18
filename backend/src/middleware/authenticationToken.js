import pkg from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>
  console.log("Received token for verification:", token);
  if (!token) return res.sendStatus(401); // Unauthorized

  const { verify } = pkg;
  verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      console.error(
        `Token verification failed: ${err.message}, for token: ${token}`
      );
      return res.sendStatus(403); // Forbidden
    }
    req.user = user; // Attach user info to request object
    console.log("Token verified successfully:", user);
    next(); // token is valid, proceed to the next middleware
  });
}

// Middleware to authenticate EmailToken
export function authenticateEmailToken(req, res, next) {
  const { token } = req.body;
  if (!token) {
    console.error("Email token is required for verification.");
    return res.status(400).json({ message: "Email token is required." });
  }
  verify(token, process.env.EMAIL_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.error("Email token verification failed:", err.message);
      return res
        .status(403)
        .json({ message: "Invalid or expired email token." });
    }
    console.log("Email token is valid for email:", decoded.email);
    req.email = decoded.email; // Attach email to request object
    next(); // email token is valid, proceed to the next middleware
  });
}
