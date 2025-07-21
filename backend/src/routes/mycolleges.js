const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config({ path: "./config.env" });

router.post("/mycolleges", async (req, res) => {
  console.log(req.body);
  const { email, collegeId } = req.body;

  const db = req.db; // Get the database instance from the request
  const collection = db.collection("userdata");
  const existingUser = await collection.findOne({ email: email });
  console.log(email);
  if (!existingUser) {
    res.status(404).json({ message: "User not found" });
  } else {
    existingUser.myColleges.push(collegeId);

    await collection.findOneAndUpdate(
      { email: email }, //filter by email
      { $set: existingUser }
    );
  }
});

router.delete("/mycolleges", async (req, res) => {
  console.log(req.body);
  const { email, collegeId } = req.body;

  const db = req.db; // Get the database instance from the request
  const collection = db.collection("userdata");
  const existingUser = await collection.findOne({ email: email });
  console.log(email);
  if (!existingUser) {
    res.status(404).json({ message: "User not found" });
  } else {
    console.log(collegeId);
    await collection.findOneAndUpdate(
      { email: email }, //filter by email
      { $pull: { myColleges: collegeId } }
    );
  }
});

module.exports = router;
