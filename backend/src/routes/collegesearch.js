import { Router } from "express";
import {
  retrieveCollegeListBasedOnTestScore,
  retrieveCollegeListByNamePrefix,
  retrieveCollegeInfo,
} from "../utils/college-data-query.js";
import { authenticateToken } from "../middleware/authenticationToken.js";
import { getUserData } from "../utils/user-data.js";

const collegeDataRouter = Router();

// Get college list
collegeDataRouter.get("/collegesearch", authenticateToken, async (req, res) => {
  const { email } = req.user;
  const db = req.db;

  if (!email) {
    return res.status(400).json({ error: "Email is required." });
  }
  const { q } = req.query;
  let result = undefined;
  if (!q) {
    // TODO ignore this.
    const user = getUserData(email, db);
    // TODO retrieve user profile

    const sat = { math: 800, eng: 720 };
    const act = undefined;

    result = await retrieveCollegeListBasedOnTestScore(sat, act);
    console.log("retrieveCollegeListBasedOnTestScore:", result);
  } else {
    console.log("searching college by name prefix");
    result = retrieveCollegeListByNamePrefix(q);
  }
  if (result) {
    if (!result.length) {
      result = [result];
      console.log("Result length: ", result.length);
    }
    console.log("Result length: ", result.length);
    console.log(result);
    res.status(200).json(result);
  } else {
    res.status(200).json([]);
  }
});

// Get logged-in user data
collegeDataRouter.get(
  "/collegesearch/:id",
  authenticateToken,
  async (req, res) => {
    const { id } = req.params;

    const result = await retrieveCollegeInfo(id);
    console.log("retrieveCollegeInfo:", result);
    if (result) {
      console.log(result);
      res.status(200).json(result);
    } else {
      res
        .status(404)
        .json({ error: `College data for unitId:${id}  is not available.` });
    }
  }
);

export default collegeDataRouter;
