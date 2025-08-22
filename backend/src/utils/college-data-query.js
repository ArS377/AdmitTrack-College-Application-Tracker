import { readFileSync } from "fs";
import jsonata from "jsonata";

// Parse JSON string into object
const data = readFileSync("data/collegedata.json", "utf8");
const collegeData = JSON.parse(data);
//console.log(collegeData);
console.log(`College Data Loaded. College Count: ${collegeData.length}`);

export async function retrieveCollegeInfo(unitId) {
  /*
  //const expression = jsonata("$.collegeName"); // -- success
  //const expression = jsonata("$.act_scores[math75>30]"); //-- success; returns all act scores with math75 > 30
  //const expression = jsonata("$[act_scores.math75>32].collegeName"); // -- success; returns all colleges with math75 > 32
  const expression = jsonata(
    "$[act_scores.math75 and act_scores.math75>33]^(-act_scores.math75,collegeName).collegeName" // filter+sorting
  ); // -- returns all colleges with math75 > 32, sorted by college name
  */
  const expression = jsonata(
    `$[unitId=${unitId}]` // filter+sorting
  ); // -- returns all colleges with math75 > 32, sorted by college name
  return await expression.evaluate(collegeData);
}

export async function retrieveCollegeListByNamePrefix(namePrefix) {
  /*
  //const expression = jsonata("$.collegeName"); // -- success
  //const expression = jsonata("$.act_scores[math75>30]"); //-- success; returns all act scores with math75 > 30
  //const expression = jsonata("$[act_scores.math75>32].collegeName"); // -- success; returns all colleges with math75 > 32
  const expression = jsonata(
    "$[act_scores.math75 and act_scores.math75>33]^(-act_scores.math75,collegeName).collegeName" // filter+sorting
  ); // -- returns all colleges with math75 > 32, sorted by college name
  */
  namePrefix = namePrefix.toLowerCase();
  const expression = jsonata(
    `$[collegeName and $match($lowercase(collegeName), /\\b${namePrefix}/)].{'unitId':unitId, 'collegeName':collegeName}` // filter+sorting
  ); // -- returns all colleges with math75 > 32, sorted by college name
  return await expression.evaluate(collegeData);
}

export async function retrieveCollegeListBasedOnTestScore(sat, act) {
  let expression;
  /*
  const college_detail =
    "{'name':collegeName, 'website':info.website,\
    'in_tuition':tuition.in-state, 'oos_tuition':tuition.out-of-state \
      'sat_eng25':sat.eng25,'sat_eng50':sat.eng50,'sat_eng75':sat.eng75,\
      'sat_math25':sat.math25,'sat_math50':sat.math50,'sat_math75':sat.math75,\
      'act_composite25':act.composite25,'act_composite50':act.composite50,'act_composite75':act.composite75,\
      'act_eng25':act.eng25,'act_eng50':act.eng50,'act_eng75':act.eng75,\
      'act_math25':act.math25,'act_math50':act.math50,'act_math75':act.math75}";
      */
  if (sat) {
    expression = jsonata(
      `$[sat.math25 and sat.math25<${sat.math} and sat.math75 > ${
        sat.math - 50
      }]` // filter+sorting
    ); // -- returns all colleges with math75 > 32, sorted by college name
  } else if (act) {
    expression = jsonata(
      `$[act.math25 and act.math25<${act.math} and act.math75 > ${
        act.math - 2
      }]` // filter+sorting
    ); // -- returns all colleges with math75 > 32, sorted by college name
  }
  return await expression.evaluate(collegeData);
}

let result = await retrieveCollegeInfo(231624);
//console.log("retrieveCollegeData: ", result);

result = await retrieveCollegeListByNamePrefix("Univers");
console.log("retrieveCollegeData: ", result);

const sat = { math: 800, eng: 720 };
const act = undefined;
result = await retrieveCollegeListBasedOnTestScore(sat, act);
//console.log("retrieveCollegeData: ", result);
