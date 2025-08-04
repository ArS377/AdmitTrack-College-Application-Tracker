const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config({ path: "./config.env" });

const authenticateToken = require("../middleware/authenticationToken");

router.get("/mycolleges", authenticateToken, async (req, res) => {
  console.log("Fetching user colleges for email:", req.user.email);
  try {
    const { email } = req.user;
    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }
    const db = req.db;
    const collection = db.collection("userdata");
    const user = await collection.find({ email: email }).toArray();
    if (user.length > 0) {
      console.log("User found:", user[0]);
      res.status(200).json(user[0].myColleges); // Return the first user found
    } else {
      res.status(404).json({ error: "User not found." });
    }
  } catch (e) {
    console.error("Error fetching user:", e);
    res.status(500).json({ error: "Failed to fetch user." });
  }
});

router.post("/mycolleges", async (req, res) => {
  console.log(req.body);
  const { email, collegeId, collegeName } = req.body;

  const db = req.db; // Get the database instance from the request
  const collection = db.collection("userdata");
  const existingUser = await collection.findOne({ email: email });
  console.log(email);
  if (!existingUser) {
    res.status(404).json({ message: "User not found" });
  } else {
    existingUser.myColleges.push({ collegeId, collegeName });

    await collection.findOneAndUpdate(
      { email: email }, //filter by email
      { $set: existingUser }
    );
  }
});

router.post("/mycolleges/delete", async (req, res) => {
  console.log(req.body);
  const { email, collegeId, collegeName } = req.body;

  const db = req.db; // Get the database instance from the request
  const collection = db.collection("userdata");
  const existingUser = await collection.findOne({ email: email });
  console.log(existingUser);
  if (!existingUser) {
    res.status(404).json({ message: "User not found" });
  } else {
    console.log(collegeId);
    await collection.findOneAndUpdate(
      { email: email }, //filter by email
      { $pull: { myColleges: { collegeId, collegeName } } }
    );
  }
});

module.exports = router;
