const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const bcrypt = require("bcrypt");
require("dotenv").config({ path: "./config.env" });

const app = express();
const PORT = 3000;
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
const client = new MongoClient(process.env.ATLAS_URI);
let db;

async function connectToDatabase() {
  try {
    await client.connect();
    db = client.db("collegeapp");
    console.log("Connected to MongoDB");
  } catch (e) {
    console.error("MongoDB connection failed:", e);
  }
}

app.get("/api/users", async (req, res) => {
  const { email } = req.query;
  if (!email) {
    return res.status(400).json({ error: "Email is required." });
  }
  try {
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

app.delete("/api/users", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email is required." });
  }
  try {
    const collection = db.collection("userdata");
    const result = await collection.deleteOne({ email: email });
    if (result.deletedCount === 1) {
      res.status(200).json({ message: "User deleted successfully." });
    } else {
      res.status(404).json({ error: "User not found." });
    }
  } catch (e) {
    console.error("Error deleting user:", e);
    res.status(500).json({ error: "Failed to delete user." });
  }
});

app.post("/api/users", async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    const collection = db.collection("userdata");
    const existingUser = await collection.findOne({ email: email });
    if (!existingUser) {
      const myColleges = [];
      hashedPassword = await bcrypt.hash(password, 10); // Hash the password
      const result = await collection.insertOne({
        fullName,
        email,
        hashedPassword,
        myColleges,
      });
      console.log("User created:", result.insertedId);
      res
        .status(200)
        .json({ message: "User created successfully.", id: result.insertedId });
    } else {
      res.status(409).json({ message: "User already exists" }); // User already exists
      console.log("User already exists:");
    }
  } catch (e) {
    res.status(500).json({ error: "Database insert failed" });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const collection = db.collection("userdata");
    const user = await collection.findOne({ email: email });
    if (user) {
      const isPasswordValid = await bcrypt.compare(
        password,
        user.hashedPassword
      );
      if (isPasswordValid) {
        res.status(200).json({ message: "Login successful", user: user });
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

// Route to receive data
app.post("/api/users", async (req, res) => {
  const { name, email } = req.body;

  try {
    const collection = db.collection("userdata");

    const existingUser = await collection.findOne({ email: email });
    if (!existingUser) {
      const myColleges = [];
      const result = await collection.insertOne({ name, email, myColleges });
      res.status(200).json({ message: "User saved", id: result.insertedId });
    } else {
      res.status(200).end();
    }
  } catch (e) {
    res.status(500).json({ error: "Database insert failed" });
  }
});

app.post("/api/mycolleges", async (req, res) => {
  console.log(req.body);
  const { email, collegeId } = req.body;

  const collection = db.collection("userdata");
  const existingUser = await collection.findOne({ email: email });
  console.log(email);
  if (!existingUser) {
    res.status(404).json({ message: "User not found" });
  } else {
    existingUser.myColleges.push(collegeId);

    const result = await collection.findOneAndUpdate(
      { email: email }, //filter by email
      { $set: existingUser }
    );
  }
});

app.post("/api/removemycolleges", async (req, res) => {
  console.log(req.body);
  const { email, collegeId } = req.body;

  const collection = db.collection("userdata");
  const existingUser = await collection.findOne({ email: email });
  console.log(email);
  if (!existingUser) {
    res.status(404).json({ message: "User not found" });
  } else {
    console.log(collegeId);
    const result = await collection.findOneAndUpdate(
      { email: email }, //filter by email
      { $pull: { myColleges: collegeId } }
    );
  }
});

//search component serverside
app.get("/api/colleges", async (req, res) => {
  //get searched query
  const searched = req.query.q;
  if (!searched) {
    return res.status(400).json({ error: "Search query 'q' is required." });
  }
  try {
    const searchPattern = new RegExp(searched, "i");
    const mongoQuery = {
      $or: [
        { collegeName: { $regex: searchPattern } }, //search in the 'name' field
        { location: { $regex: searchPattern } }, //search in the 'description' field}
      ],
    };
    const collection = db.collection("collegeinfo");
    const results = await collection.find(mongoQuery).toArray();
    res.status(200).json(results); //sends to frontend
  } catch (e) {
    console.error("Error during search in /api/search:", e);
    res.status(500).json({ error: "Failed to perform search." });
  }
});

//updating after submitting profile data
app.post("/api/profile", async (req, res) => {
  const { email, firstMajor, secondMajor, satEnglish, satMath, act } = req.body;
  if (!email) {
    return res
      .status(400)
      .json({ message: "Email is required to update the profile." });
  }
  const collection = db.collection("userdata");
  const updateDoc = {
    $set: {
      firstMajor: firstMajor,
      secondMajor: secondMajor,
      satEnglish: satEnglish,
      satMath: satMath,
      act: act,
    },
  };
  try {
    const result = await collection.findOneAndUpdate(
      { email: email }, //filter by email
      updateDoc,
      { returnDocument: "after", upsert: true } //add info after email
    );

    res.status(200).json({
      //to send message back to client side --> response.ok() == true
      message: "Profile data updated successfully!",
      profile: result.value,
    });
  } catch (e) {
    console.error("Error updating profile data:", e);
    res.status(500).json({ error: "Could not update profile data." });
  }
});

async function startServer() {
  // Connet to database
  await connectToDatabase();

  //start server
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
