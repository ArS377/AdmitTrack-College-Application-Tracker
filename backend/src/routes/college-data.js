import { Router } from "express";
import { retrieveCollegeData } from "../utils/college-data-query.js";
import { authenticateToken } from "../middleware/authenticationToken.js";

const collegeDataRouter = Router();

// Get logged-in user data
collegeDataRouter.get("/collegedata", authenticateToken, async (req, res) => {
  const { email } = req.user;
  if (!email) {
    return res.status(400).json({ error: "Email is required." });
  }
  const result = await retrieveCollegeData();
  if (result) {
    console.log(result);
    res.status(200).json(result);
  } else {
    res.status(404).json({ error: "College data is not available." });
  }
});

export default collegeDataRouter;
