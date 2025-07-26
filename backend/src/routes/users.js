const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const authenticateToken = require("../middleware/authenticationToken");

// registering a new user
router.post("/users", authenticateToken, async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    const db = req.db; // Get the database instance from the request
    const loginCollection = db.collection("logininfo");
    const profileCollection = db.collection("userdata");
    const existingUser = await loginCollection.findOne({ email: email });
    if (!existingUser) {
      const myColleges = [];
      hashedPassword = await bcrypt.hash(password, 10); // Hash the password
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

// Get logged-in user data
router.get("/users", authenticateToken, async (req, res) => {
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
router.delete("/users", async (req, res) => {
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
    if (result.deletedCount === 1 && profileResult.deletedCount === 1) {
      res.status(200).json({ message: "User deleted successfully." });
    } else {
      res.status(404).json({ error: "User not found." });
    }
  } catch (e) {
    console.error("Error deleting user:", e);
    res.status(500).json({ error: "Failed to delete user." });
  }
});

module.exports = router;
