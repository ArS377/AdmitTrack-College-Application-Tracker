import { readFileSync } from "fs";
import jsonata from "jsonata";
import _ from "lodash";
import getCollegeData from "./college-data.js";
import { pickFields } from "./data-selector.js";

export function retrieveCollegeInfo(unitId) {
  /*
  //const expression = jsonata("$.collegeName"); // -- success
  //const expression = jsonata("$.act_scores[math75>30]"); //-- success; returns all act scores with math75 > 30
  //const expression = jsonata("$[act_scores.math75>32].collegeName"); // -- success; returns all colleges with math75 > 32
  const expression = jsonata(
    "$[act_scores.math75 and act_scores.math75>33]^(-act_scores.math75,collegeName).collegeName" // filter+sorting
  ); // -- returns all colleges with math75 > 32, sorted by college name
  */
  const collegeData = getCollegeData();

  const expression = jsonata(
    `$[unitId=${unitId}]` // filter+sorting
  ); // -- returns all colleges with math75 > 32, sorted by college name
  return expression.evaluate(collegeData);
}

/**
 *
 * @param {*} value
 * @param {*} expr
 * @returns false if expr with value results in false
 */
function evaluateExpression(value, expr) {
  if (!expr) return true; // expr not defined. return true.

  // Trim spaces
  expr = expr.trim();
  //console.log(`value = ${value}, expr=${expr}`);
  // Numeric comparisons (<, <=, >, >=, =)
  const numberMatch = expr.match(/^(<=|>=|<|>|=)?\s*(-?\d+(\.\d+)?)$/);
  if (numberMatch) {
    const operator = numberMatch[1] || "=";
    const num = parseFloat(numberMatch[2]);
    const val = parseFloat(value);

    switch (operator) {
      case "<":
        return val < num;
      case "<=":
        return val <= num;
      case ">":
        return val > num;
      case ">=":
        return val >= num;
      case "=":
        return val === num;
      default:
        return false;
    }
  }

  // String equality (=CA or just CA)
  const stringMatch = expr.match(/^=?(.+)$/);
  if (stringMatch) {
    const expected = stringMatch[1].trim();
    return String(value) === expected;
  }

  //console.error("invalid expression: ", expr);
  return true;
}

function normalizeElement(element) {
  if (typeof element === "string") {
    return { path: element, expr: null };
  } else if (typeof element === "object" && element !== null) {
    const { path, expr = null } = element;
    //console.log(`normalize: ${JSON.stringify(element)}: ${path}${expr}`);
    return { path, expr };
  }
  return { path: null, expr: null };
}

function matchesCriteria(college, criteria) {
  if (!criteria) return true;
  let result = true;
  criteria.forEach((element) => {
    if (result == false) {
      // already failed the previous criteria.
      // no need to evaluate the remaining criteria.
      //console.log("skipping criteria: ", criteria);
      return;
    }
    const { path, expr } = normalizeElement(element);
    /*
    console.log(
      `matchescriteria check: ${college.collegeName}: ${JSON.stringify(
        element
      )} ${path} ${expr}`
    );
    */
    const value = _.get(college, path);
    if (value !== undefined && value != null) {
      if (evaluateExpression(value, expr) === false) {
        // this object doesn't meet the criteria.
        // ignore this object.
        //console.log("did not match: ", { path, value });
        result = false;
      }
    } else {
      result = false;
    }
  });
  return result;
}

export function retrieveCollegeListByNamePrefix(
  namePrefix,
  fields = ["unitId", "collegeName"],
  criteria
) {
  const collegeData = getCollegeData();

  namePrefix =
    namePrefix == null || namePrefix.trim() === "" ? null : namePrefix.trim();
  const searchWords = namePrefix
    ? namePrefix
        .toLowerCase()
        .split(/[ -]/)
        .filter((a) => a != "of" && a != "and" && a != "at")
        .sort()
    : null;

  let exactPrefixMatch = [];
  let keywordMatch = [];
  collegeData.forEach((college) => {
    // check exact prefix match

    // if namePrefix is not null, it must match
    if (
      (namePrefix == null || college.collegeName.startsWith(namePrefix)) &&
      matchesCriteria(college, criteria)
    ) {
      // pick the fields for selected colleges.
      exactPrefixMatch.push(pickFields(college, fields));
    } else {
      // check keyword match
      const matchedKeywords =
        searchWords &&
        searchWords.every((word) => {
          return college.searchWords.some((element) =>
            element.startsWith(word)
          );
        });

      // search words is not null, it has to match keywords
      if (
        (searchWords == null || matchedKeywords) &&
        matchesCriteria(college, criteria)
      ) {
        // pick fields for selected colleges.
        keywordMatch.push(pickFields(college, fields));
      }
    }
  });

  /*
  console.log("============================================================");
  console.log("Exact Prefix Match");
  console.log(exactPrefixMatch);
  console.log("============================================================");
  console.log("Keyword Match");
  console.log(keywordMatch);
  console.log("============================================================");
  console.log("Name prefix use in the search: ", namePrefix);
  console.log("============================================================");
  */

  exactPrefixMatch.push(...keywordMatch);
  return exactPrefixMatch;
}

export function retrieveCollegeListByAcceptanceRate(acceptanceRate) {
  const collegeDetail =
    "{'unitId':unitId, 'collegeName':collegeName, 'info':info, 'sat':sat, 'act':act, \
    'admissions':{'total_pct':admissions.total_pct}}^(collegeName)";
  const collegeData = getCollegeData();
  const expression = jsonata(
    `$[admissions.total_pct and admissions.total_pct < ${acceptanceRate}].${collegeDetail}` // filter+sorting
  );
  return expression.evaluate(collegeData);
}

export function retrieveCollegeListByState(state) {
  const collegeDetail =
    "{'unitId':unitId, 'collegeName':collegeName, 'info':info, 'sat':sat, 'act':act, \
    'admissions':{'total_pct':admissions.total_pct}}^(collegeName)";
  const collegeData = getCollegeData();
  const expression = jsonata(
    `$[info.address and info.state = '${state}'].${collegeDetail}` // filter+sorting
  );
  return expression.evaluate(collegeData);
}

export function retrieveCollegeListBasedOnTestScore(sat, act) {
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
  const collegeData = getCollegeData();
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
  return expression.evaluate(collegeData);
}

let result = undefined;
//result = await retrieveCollegeInfo(231624);
//console.log("retrieveCollegeInfo: ", result);

//result = await retrieveCollegeInfo(243744);
//console.log("retrieveCollegeInfo: ", result);

//result = await retrieveCollegeInfo(236948);
//console.log("retrieveCollegeInfo: ", result);

const criteria = [{ path: "admissions.total_pct", expr: "<90" }];
let fields = undefined;
fields = ["unitId", "collegeName", "admissions.total_pct"];
//fields = ["unitId", "collegeName", "admissions.total_pct", "act", "sat"];

result = retrieveCollegeListByNamePrefix(
  "University of Wisconsin",
  fields,
  criteria
);
result = retrieveCollegeListByNamePrefix("San Jose");
//console.log("retrieveCollegeListByNamePrefix: ", result);

const sat = { math: 800, eng: 720 };
const act = undefined;
//result = await retrieveCollegeListBasedOnTestScore(sat, act);
//console.log("retrieveCollegeListBasedOnTestScore: ", result);

//result = retrieveCollegeListByAcceptanceRate(10);
//console.log("retrieveCollegeListByAcceptanceRate: ", result);

//result = await retrieveCollegeListByState("CA");
//console.log("retrieveCollegeListByState: ", result);
