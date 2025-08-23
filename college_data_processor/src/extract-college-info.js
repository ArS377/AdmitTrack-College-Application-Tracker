import { readFileSync, writeFileSync } from "fs";
import jsonata from "jsonata";

export async function extractCollegeList() {
  const data = readFileSync("data/collegedata.json", "utf8");
  const collegeData = JSON.parse(data);
  console.log(`College Data Loaded. College Count: ${collegeData.length}`);

  const expression = jsonata(
    `$[collegeName].{'unitId':unitId, 'collegeName':collegeName}^(collegeName)` // filter+sorting
  ); // -- returns all colleges with math75 > 32, sorted by college name
  const result = await expression.evaluate(collegeData);
  writeFileSync("data/collegenames.json", JSON.stringify(result, null, 2));
}

extractCollegeList();
