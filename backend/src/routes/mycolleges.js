import { Router } from "express";
import { authenticateToken } from "../middleware/authenticationToken.js";
import dotenv from "dotenv";

dotenv.config();

const mycollegeRouter = Router();

mycollegeRouter.get("/mycolleges", authenticateToken, async (req, res) => {
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
      console.log("User found", user[0]);
      res.status(200).json(user[0].myColleges); // Return the first user found
    } else {
      res.status(404).json({ error: "User not found." });
    }
  } catch (e) {
    console.error("Error fetching user:", e);
    res.status(500).json({ error: "Failed to fetch user." });
  }
});

mycollegeRouter.post("/mycolleges", authenticateToken, async (req, res) => {
  console.log(req.body);
  const { email } = req.user; // Get email from authenticated user
  const { collegeId, collegeName } = req.body;

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

mycollegeRouter.post(
  "/mycolleges/delete",
  authenticateToken,
  async (req, res) => {
    console.log(req.body);
    const { email } = req.user; // Get email from authenticated user
    const { collegeId, collegeName } = req.body;

    const db = req.db; // Get the database instance from the request
    const collection = db.collection("userdata");
    const existingUser = await collection.findOne({ email: email });
    console.log("User found. Email:", email);
    if (!existingUser) {
      res.status(404).json({ message: "User not found" });
    } else {
      console.log("deleting college: ", collegeId);
      await collection.findOneAndUpdate(
        { email: email }, //filter by email
        { $pull: { myColleges: { collegeId, collegeName } } }
      );
    }
  }
);

export default mycollegeRouter;
