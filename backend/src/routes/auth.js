const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

// get access token from refresh token
router.post("/auth/accesstoken", (req, res) => {
  const refreshToken = req.cookies && req.cookies.refresh_token;
  if (!refreshToken) {
    console.error("request.cookies: ", req.cookies);
    return res.sendStatus(401); // Unauthorized
  }

  //TODO remove console logs in production
  console.log("Rrefresh token:", refreshToken);
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      console.error("Refresh token verification failed:", err.message);
      return res.sendStatus(403); // Forbidden
    }
    const access_token = jwt.sign(
      { email: user.email, id: user.id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
    console.log("New Access token generated:", access_token);
    res.json({ access_token });
  });
});

// validate access token
router.post("/auth/validate", (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>
  if (!token) return res.sendStatus(401); // Unauthorized
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      console.error("Access token verification failed:", err.message);
      return res.sendStatus(403); // Forbidden
    }
    console.log("Access token is valid for user:", user.email);
    res.status(200).json({ message: "Access token is valid" });
  });
});

// logs user in
router.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log("post /auth/login called");
    const db = req.db; // Get the database instance from the request
    const collection = db.collection("logininfo");
    const user = await collection.findOne({ email: email });
    if (user) {
      const isPasswordValid = await bcrypt.compare(
        password,
        user.hashedPassword
      );
      if (isPasswordValid) {
        const access_token = jwt.sign(
          { email: user.email, id: user._id },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
        );
        const refresh_token = jwt.sign(
          { email: user.email, id: user._id },
          process.env.REFRESH_TOKEN_SECRET,
          { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
        );

        res.cookie("refresh_token", refresh_token, {
          httpOnly: true,
          maxAge: parseInt(process.env.REFRESH_TOKEN_EXPIRY),
          // TODO
          // secure: process.env.NODE_ENV === "production", // Use secure cookies in production
          // sameSite: "Strict",
        });

        // TODO remove console logs in production
        console.log("Access token generated:", access_token);
        console.log("Refresh token generated:", refresh_token);
        console.log("Login successful. Setting cookies: ", res.cookie);

        res
          .status(200)
          .json({ message: "Login successful", access_token: access_token });
      } else {
        res.status(401).json({ message: "Invalid password" });
      }
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (e) {
    console.error("Error during login:", e);
    res.status(500).json({ error: "Login failed" });
  }
});

router.post("/auth/logout", (req, res) => {
  res.clearCookie("refresh_token"); // Clear the refresh token cookie
  res.status(200).json({ message: "Logged out successfully" });
});

module.exports = router;
