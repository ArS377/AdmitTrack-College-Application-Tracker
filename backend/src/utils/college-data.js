import { readFileSync } from "fs";

// Parse JSON string into object
const data = readFileSync("data/collegedata-merged.json", "utf8");
const collegeData = JSON.parse(data);
console.log(`College Data Loaded. College Count: ${collegeData.length}`);

export default function getCollegeData() {
  return collegeData;
}
