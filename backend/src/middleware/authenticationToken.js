const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "./config.env" });

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>
  if (!token) return res.sendStatus(401); // Unauthorized

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      console.error("Token verification failed:", err.message);
      return res.sendStatus(403); // Forbidden
    }
    req.user = user; // Attach user info to request object
    next(); // token is valid, proceed to the next middleware
  });
}

module.exports = authenticateToken;
