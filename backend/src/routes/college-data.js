const express = require("express");
const router = express.Router();

const data = fs.readFileSync("data/collegedata.json", "utf8");

// Parse JSON string into object
const collegeData = JSON.parse(data);

console.log("json data length: ", jsonData.length.toLocaleString());

function getTopColleges() {
  collegesat_scores.math75 > 700;
}

// Get logged-in user data
router.get(
  "/collegedata",
  authenticator.authenticateToken,
  async (req, res) => {}
);
