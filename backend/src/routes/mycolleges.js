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

/**
 * get the status of the specific college identified by 'id' from my colleges list
 */
mycollegeRouter.get("/mycolleges/:id", authenticateToken, async (req, res) => {
  const { email } = req.user; // Get email from authenticated user
  const { id } = req.params;
  const collegeId = id ? parseInt(id) : null;

  const db = req.db; // Get the database instance from the request
  const collection = db.collection("userdata");
  const existingUser = await collection.findOne({ email: email });
  console.log(email);
  if (!existingUser) {
    res.status(404).json({ message: "User not found" });
  } else {
    console.log("MyColleges: ", existingUser.myColleges.length);
    console.log(
      `Attempting to retrieve college status for <${id} -> ${collegeId}>`
    );
    const college = existingUser.myColleges.find(
      (college) => college.collegeId === collegeId
    );
    console.log(`sending college status: ${JSON.stringify(college)}`);
    res.status(200).json(college);
  }
});

/**
 * Adds a new college to My Colleges list.
 */
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

function getMyCollegeStatusString(college) {
  return JSON.stringify(college);
}

mycollegeRouter.put("/mycolleges/:id", authenticateToken, async (req, res) => {
  console.log(req.body);
  const { email } = req.user; // Get email from authenticated user
  const { id } = req.params;
  const collegeId = id ? parseInt(id) : null;
  const {
    category,
    appType,
    dueDate,
    essayProgress,
    appSubmissionStatus,
    testScoreStatus,
    apibScoreStatus,
    lorStatus,
    transcriptStatus,
  } = req.body;

  console.log(`college id=${id}, ${typeof id} collegeId=${collegeId}, category=${category}, \
      DueDate = ${dueDate}, Essay=${essayProgress}, App=${appSubmissionStatus}, TestScore=${testScoreStatus} \
      AP/IB=${apibScoreStatus}, LOR=${lorStatus}, Transcript=${transcriptStatus}`);

  const db = req.db; // Get the database instance from the request
  const collection = db.collection("userdata");
  const existingUser = await collection.findOne({ email: email });
  console.log(email);
  if (!existingUser) {
    res.status(404).json({ message: "User not found" });
  } else {
    console.log("MyColleges: ", existingUser.myColleges.length);
    const college = existingUser.myColleges.find(
      (college) => college.collegeId === collegeId
    );
    console.log("college find result: ", college);
    if (college) {
      college.category = category;
      college.appType = appType;
      college.dueDate = dueDate;
      college.essayProgress = essayProgress;
      college.appSubmissionStatus = appSubmissionStatus;
      college.testScoreStatus = testScoreStatus;
      college.apibScoreStatus = apibScoreStatus;
      college.lorStatus = lorStatus;
      college.transcriptStatus = transcriptStatus;
    }

    console.log(
      `college[${collegeId}] in my list: ${getMyCollegeStatusString(college)}`
    );

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
