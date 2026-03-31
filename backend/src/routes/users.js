import { Router } from "express";
import { hash } from "bcrypt";

import {
  authenticateToken,
  authenticateEmailToken,
} from "../middleware/authenticationToken.js";

const userRouter = Router();

// registering a new user
userRouter.post("/users", async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    const db = req.db; // Get the database instance from the request
    const loginCollection = db.collection("logininfo");
    const profileCollection = db.collection("userdata");
    const existingUser = await loginCollection.findOne({ email: email });
    if (!existingUser) {
      const myColleges = [];
      const hashedPassword = await hash(password, 10);
      const loginResult = await loginCollection.insertOne({
        email,
        hashedPassword,
      });
      const profileResult = await profileCollection.insertOne({
        fullName,
        email,
        myColleges,
      });
      res.status(200).json({ message: "User created successfully." });
    } else {
      res.status(409).json({ message: "User already exists" }); // User already exists
      console.log("User already exists:");
    }
  } catch (e) {
    res.status(500).json({ error: "Database insert failed" });
  }
});

// update password
userRouter.put("/users/password", authenticateEmailToken, async (req, res) => {
  const email = req.email; // Get email from authenticated user
  const { newPassword } = req.body;
  console.log("Updating password for email:", req.email, email);
  if (!email) {
    return res
      .status(400)
      .json({ message: "Email is required to update the password." });
  }
  try {
    const db = req.db; // Get the database instance from the request
    const collection = db.collection("logininfo");
    const hashedPassword = await hash(newPassword, 10); // Hash the new password
    const result = await collection.updateOne(
      { email: email },
      { $set: { hashedPassword: hashedPassword } }
    );
    if (result.modifiedCount === 1) {
      res.status(200).json({ message: "Password updated successfully." });
    } else {
      res.status(404).json({ message: "User not found." });
    }
  } catch (e) {
    console.error("Error updating password:", e);
    res.status(500).json({ error: "Failed to update password." });
  }
});

// Get logged-in user data
userRouter.get("/users", authenticateToken, async (req, res) => {
  const { email } = req.user;
  if (!email) {
    return res.status(400).json({ error: "Email is required." });
  }
  try {
    console.log("getting user data for email:", email);
    const db = req.db; // Get the database instance from the request
    const collection = db.collection("userdata");
    const user = await collection.find({ email: email }).toArray();
    if (user.length > 0) {
      console.log("User found:", user[0]);
      res.status(200).json(user[0]); // Return the first user found
    } else {
      res.status(404).json({ error: "User not found." });
    }
  } catch (e) {
    console.error("Error fetching user:", e);
    res.status(500).json({ error: "Failed to fetch user." });
  }
});

// delete user
userRouter.delete("/users", authenticateToken, async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email is required." });
  }
  try {
    const db = req.db; // Get the database instance from the request
    const loginCollection = db.collection("logininfo");
    const profileCollection = db.collection("userdata");
    const loginResult = await loginCollection.deleteOne({ email: email });
    const profileResult = await profileCollection.deleteOne({ email: email });
    if (loginResult.deletedCount === 1 && profileResult.deletedCount === 1) {
      res.status(200).json({ message: "User deleted successfully." });
    } else {
      res.status(404).json({ error: "User not found." });
    }
  } catch (e) {
    console.error("Error deleting user:", e);
    res.status(500).json({ error: "Failed to delete user." });
  }
});

export default userRouter;
