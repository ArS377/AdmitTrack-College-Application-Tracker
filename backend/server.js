const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
require("dotenv").config({ path: "./config.env" });

const app = express();
const PORT = 3000;

// Middleware
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// MongoDB connection setup
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
    const result = await collection.insertOne({ name, email });
    res.status(200).json({ message: "User saved", id: result.insertedId });
  } catch (e) {
    res.status(500).json({ error: "Database insert failed" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  connectToDatabase();
});


//search component serverside
app.get('/api/search', async (req, res) => {
  //get searched query
  const searched = req.query.q
  if (!searched) {
    return res.status(400).json({ error: "Search query 'q' is required." });
  }

  const searchPattern = new RegExp(searched, 'i');
  const mongoQuery = {
    $or: [
      { name: { $regex: searchPattern } },//search in the 'name' field
      { description: { $regex: searchPattern } }//search in the 'description' field}
    ]
  };
  const collection = db.collection('collegeinfo');
  const results = await collection.find(mongoQuery).toArray();
  res.status(200).json(results); //sends to frontend
});