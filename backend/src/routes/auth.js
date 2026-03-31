import { Router } from "express";
import pkg from "jsonwebtoken";
import { compare } from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const { sign, verify } = pkg;
const authRouter = Router();

function parseDurationToMs(duration) {
  const match = String(duration).match(/^(\d+)([smhd])$/);
  if (!match) return 0;
  const value = parseInt(match[1]);
  const units = { s: 1000, m: 60000, h: 3600000, d: 86400000 };
  return value * (units[match[2]] || 0);
}

// get access token from refresh token
authRouter.post("/auth/accesstoken", (req, res) => {
  console.log("request received to refresh token.");
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    console.error("request.cookies: ", req.cookies);
    console.error("Refresh token is falsey: ", refreshToken);
    return res.sendStatus(401); // Unauthorized
  }

  //TODO remove console logs in production
  console.log("Refresh token:", refreshToken);
  verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      console.error("Refresh token verification failed:", err.message);
      return res.sendStatus(403); // Forbidden
    }
    const accessToken = sign(
      { email: user.email, id: user.id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
    console.log("New Access token generated:", accessToken);
    res.json({ accessToken });
  });
});

// validate access token
authRouter.post("/auth/validate", (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>
  if (!token) return res.sendStatus(401); // Unauthorized
  verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      console.error("Access token verification failed:", err.message);
      return res.sendStatus(403); // Forbidden
    }
    console.log("Access token is valid for user:", user.email);
    res.status(200).json({ message: "Access token is valid" });
  });
});

// logs user in
authRouter.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log("post /auth/login called");
    const db = req.db; // Get the database instance from the request
    const collection = db.collection("logininfo");
    const user = await collection.findOne({ email: email });
    if (user) {
      const isPasswordValid = await compare(password, user.hashedPassword);
      if (isPasswordValid) {
        const accessToken = sign(
          { email: user.email, id: user._id },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
        );
        const refreshToken = sign(
          { email: user.email, id: user._id },
          process.env.REFRESH_TOKEN_SECRET,
          { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
        );

        // TODO remove console logs in production
        console.log("Access token generated:", typeof accessToken, accessToken);
        console.log(
          "Refresh token generated:",
          typeof refreshToken,
          refreshToken
        );

        // Send refresh token in HttpOnly cookie
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production", // true in production (HTTPS)
          sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // prevent CSRF
          maxAge: parseDurationToMs(process.env.REFRESH_TOKEN_EXPIRY),
        });
        console.log("Login successful. Setting cookies: ", res.cookie);

        res
          .status(200)
          .json({ message: "Login successful", accessToken: accessToken });
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

authRouter.post("/auth/logout", (req, res) => {
  console.log("received logout.");
  res.clearCookie("refreshToken");
  res.status(200).json({ message: "Logged out successfully" });
});

export default authRouter;
