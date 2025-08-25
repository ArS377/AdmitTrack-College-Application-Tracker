import { Router } from "express";
import {
  retrieveCollegeListByNamePrefix,
  retrieveCollegeInfo,
} from "../utils/college-data-query.js";
import { authenticateToken } from "../middleware/authenticationToken.js";

const collegeListRouter = Router();

function parseIntOrNull(str, radix = 10) {
  //str = str.trim();
  if (str === "") return null; // handle empty string explicitly
  const n = parseInt(str, radix);
  return isNaN(n) ? null : n;
}

// Get college list
collegeListRouter.get("/collegelist", authenticateToken, async (req, res) => {
  const { email } = req.user;
  const db = req.db;

  if (!email) {
    return res.status(400).json({ error: "Email is required." });
  }
  const { q } = req.query;
  const requestType = parseIntOrNull(q);
  if (!requestType) {
    res.status(400).send();
  }

  /*
  Temporary until we are able to pass the criteria better
  q = 1: popular - colleges. i.e., less than 50% acceptance rate.
  q = 2: in-state colleges with acceptance rate upto 90%
  */
  console.log("collegelist request: q=", q);
  let result = undefined;
  const fields = [
    "unitId",
    "collegeName",
    "applicants.total",
    "admissions.total_pct",
    "act",
    "sat",
    "info.city",
    "info.state",
    "tuition",
  ];
  let criteria = [
    { path: "applicants.total", expr: ">0" },
    { path: "admissions.total_pct", expr: "<25" },
  ];
  if (requestType == 2) {
    criteria = [
      { path: "info.state", expr: "CA" },
      { path: "admissions.total_pct", expr: "<90" },
    ];
  }

  result = retrieveCollegeListByNamePrefix(null, fields, criteria);
  if (result) {
    if (!result.length) {
      result = [result];
      console.log("Result length: ", result.length);
    }
    console.log("Result length: ", result.length);
    //console.log(result);
    res.status(200).json(result);
  } else {
    res.status(200).json([]);
  }
});

// Get logged-in user data
collegeListRouter.get(
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

export default collegeListRouter;
