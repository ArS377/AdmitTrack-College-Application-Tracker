import { readFileSync } from "fs";
import jsonata from "jsonata";

// Parse JSON string into object

export async function retrieveCollegeData() {
  const data = readFileSync("data/collegedata.json", "utf8");
  const collegeData = JSON.parse(data);
  /*
  //const expression = jsonata("$.collegeName"); // -- success
  //const expression = jsonata("$.act_scores[math75>30]"); //-- success; returns all act scores with math75 > 30
  //const expression = jsonata("$[act_scores.math75>32].collegeName"); // -- success; returns all colleges with math75 > 32
  const expression = jsonata(
    "$[act_scores.math75 and act_scores.math75>33]^(-act_scores.math75,collegeName).collegeName" // filter+sorting
  ); // -- returns all colleges with math75 > 32, sorted by college name
  */
  const expression = jsonata(
    "$[act_scores.math75 and act_scores.math75>33]^(-act_scores.math75,collegeName).{'name':collegeName, 'website':info.website,'math75':act_scores.math75}" // filter+sorting
  ); // -- returns all colleges with math75 > 32, sorted by college name
  return await expression.evaluate(collegeData);
}
const collegeData = await retrieveCollegeData();
console.log(collegeData);

export default retrieveCollegeData;
