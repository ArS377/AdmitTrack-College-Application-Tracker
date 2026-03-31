import _ from "lodash";
import getCollegeData from "./college-data.js";

/**
 * Extracts specific fields from an object/array using dot-notation paths.
 * Works with nested objects and arrays.
 * @param {Object|Array} obj - The source object or array
 * @param {string[]} fields - Array of field paths (e.g., ["collegeName", "act_scores.math75"])
 * @returns {Object|Array} - New object/array with only the requested fields
 */
export function pickFields(obj, fields) {
  if (Array.isArray(obj)) {
    // Recursively apply to each element of the array
    return obj.map((item) => pickFields(item, fields));
  }

  const result = {};
  fields.forEach((path) => {
    const value = _.get(obj, path);
    if (value !== undefined) {
      _.set(result, path, value);
    }
  });
  return result;
}

/*
function evaluateCriteria(value, criteria) {
  if (!criteria) return true;

  // Trim spaces
  criteria = criteria.trim();

  // Numeric comparisons (<, <=, >, >=, =)
  const numberMatch = criteria.match(/^(<=|>=|<|>|=)?\s*(-?\d+(\.\d+)?)$/);
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
  const stringMatch = criteria.match(/^=?(.+)$/);
  if (stringMatch) {
    const expected = stringMatch[1].trim();
    return String(value) === expected;
  }

  return false;
}

function normalizeElement(element) {
  if (typeof element === "string") {
    return { path: element, criteria: null };
  } else if (typeof element === "object" && element !== null) {
    const { path, criteria = null } = element;
    return { path, criteria };
  }
  return { path: null, criteria: null };
}

export function pickFieldsWithCriteria(obj, fields) {
  if (Array.isArray(obj)) {
    // Recursively apply to each element of the array
    return obj.map((item) => {
      const result = pickFieldsWithCriteria(item, fields);
      console.log("returned result: " + result.unitId);
    });
  }

  const result = {};
  fields.forEach((element) => {
    console.log(`${element} type is ${typeof element}`);
    const { path, criteria } = normalizeElement(element);
    const value = _.get(obj, path);
    if (value !== undefined) {
      if (evaluateCriteria(value, criteria) === false) {
        // this object doesn't meet the criteria.
        // ignore this object.
        console.log("did not match: ", { path, value });
        discard_object = true;
        // TODO - didn't match is not set as empty.
        // We are still getting other fields for this object.
        return {};
      } else {
        //critria is met. pick the field.
        //console.log("match: ", { path, value });
        _.set(result, path, value);
      }
    }
  });
  return result;
}
  */

