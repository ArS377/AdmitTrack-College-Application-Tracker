import express, { json } from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import cookieParser from "cookie-parser";
import { authenticateToken } from "./middleware/authenticationToken.js";

import authRouter from "./routes/auth.js";
import mycollegeRouter from "./routes/mycolleges.js";
import userRouter from "./routes/users.js";
import emailRouter from "./routes/email.js";
import collegeSearchRouter from "./routes/collegesearch.js";
import dotenv from "dotenv";
import collegeListRouter from "./routes/collegelist.js";

dotenv.config();

const app = express();
const PORT = 3000;

app.use((req, res, next) => {
  req.db = db; // Attach db instance to request
  next();
});

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(json());
app.use(cookieParser()); // Middleware to parse cookies

app.use("/api", authRouter);
app.use("/api", mycollegeRouter);
app.use("/api", userRouter);
app.use("/api", emailRouter); // Email routes
app.use("/api", collegeSearchRouter);
app.use("/api", collegeListRouter);

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

//search component serverside
app.get("/api/colleges", authenticateToken, async (req, res) => {
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

app.get("/api/colleges/id", authenticateToken, async (req, res) => {
  const unitId = req.query.id;
  if (!unitId) {
    return res.status(400).json({ error: "Unit ID is required." });
  }
  try {
    const collection = db.collection("collegeinfo");
    const result = await collection.findOne({ unitId: unitId });

    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ error: "College not found." });
    }
  } catch (e) {
    console.error("Error fetching college by ID:", e);
    res.status(500).json({ error: "Failed to fetch college by ID." });
  }
});

/*
const getEmailFromAccessToken = (accessToken) => {
  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      console.error("Access token verification failed:", err.message);
      return res.sendStatus(403); // Forbidden
    }
    return user.email; // Return the email from the token
  });
};
*/

//updating after submitting profile data
app.post("/api/profile", authenticateToken, async (req, res) => {
  console.log("Updating profile data with body:", req.body);
  const { email } = req.user; // Get email from authenticated user
  const { firstMajor, secondMajor, sat, act } = req.body;
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
      sat: sat,
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
