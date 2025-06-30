const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
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



// Route to receive data
app.post("/api/save-user", async (req, res) => {
  const { name, email } = req.body;

  try {
    const collection = db.collection("userdata");

    const existingUser = await collection.findOne({ email: email });
    if (existingUser) {
      return res.status(409).json({ error: "User with this email already exists." });
    }

    const result = await collection.insertOne({ name, email });
    res.status(200).json({ message: "User saved", id: result.insertedId });
  } catch (e) {
    res.status(500).json({ error: "Database insert failed" });
  }
});




//search component serverside
app.get('/api/search', async (req, res) => {
  //get searched query
  const searched = req.query.q
  if (!searched) {
    return res.status(400).json({ error: "Search query 'q' is required." });
  }
  try{
    const searchPattern = new RegExp(searched, 'i');
    const mongoQuery = {
      $or: [
        { collegeName: { $regex: searchPattern } },//search in the 'name' field
        { location: { $regex: searchPattern } }//search in the 'description' field}
      ]
    };
    const collection = db.collection('collegeinfo');
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
    return res.status(400).json({ message: "Email is required to update the profile." });
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
      { returnDocument: 'after', upsert: true } //add info after email
    );

    res.status(200).json({ //to send message back to client side --> response.ok() == true
      message: "Profile data updated successfully!",
      profile: result.value
    });

  } catch (e) {
    console.error("Error updating profile data:", e);
    res.status(500).json({ error: "Could not update profile data." });
  }
});



//start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  connectToDatabase();
});
