const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "./config.env" });

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>
  console.log("Received token for verification:", token);
  if (!token) return res.sendStatus(401); // Unauthorized

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
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

module.exports = authenticateToken;
