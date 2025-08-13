const ExcelJS = require("exceljs");

/*
College Data Structure:
: 3
 */
let collegeData = {};
const COLLEGE_DS_SAT = {
  data_beginning_row: 6,
  collegeId: 1,
  collegeName: 2,
  sat: {
    enrolled_submitted_sat_cnt: 7,
    enrolled_submitted_sat_perc: 8,
    sat_verbal_25th_percentile: 21,
    sat_verbal_75th_percentile: 31,
    sat_math_25th_percentile: 41,
    sat_math_75th_percentile: 51,
  },
};

const COLLEGE_DS_ACT = {
  data_beginning_row: 6,
  collegeId: 1,
  collegeName: 2,
  act: {
    enrolled_submitted_act_cnt: 9,
    enrolled_submitted_act_perc: 10,
    act_composite_25th_percentile: 21,
    act_composite_75th_percentile: 31,
    act_english_25th_percentile: 41,
    act_english_75th_percentile: 51,
    act_math_25th_percentile: 61,
    act_math_75th_percentile: 71,
  },
};

async function readSATScore(filePath) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  // find worksheet named 'TableLibrary'
  const worksheet = workbook.getWorksheet("TableLibrary");
  if (!worksheet) {
    console.error("Worksheet 'TableLibrary' not found.");
    return;
  }
  worksheet.eachRow((row, rowNumber) => {
    // Skip rows before the data begins
    if (rowNumber < COLLEGE_DS_SAT.data_beginning_row) {
      return;
    }
    // Skip empty rows
    const collegeId = row.getCell(COLLEGE_DS_SAT.collegeId).value;
    if (collegeId === undefined || collegeId === "" || collegeId === null) {
      return;
    }
    // check if collegeId is a number
    if (typeof collegeId !== "number") {
      return;
    }
    // Create a college object if it doesn't exist
    if (!collegeData[collegeId]) {
      collegeData[collegeId] = {
        collegeName: row.getCell(COLLEGE_DS_SAT.collegeName).value,
        sat: {},
      };
    }
    // Populate SAT data
    collegeData[collegeId].sat.enrolled_submitted_sat_cnt = row.getCell(
      COLLEGE_DS_SAT.sat.enrolled_submitted_sat_cnt
    ).value;
    collegeData[collegeId].sat.enrolled_submitted_sat_perc = row.getCell(
      COLLEGE_DS_SAT.sat.enrolled_submitted_sat_perc
    ).value;
    collegeData[collegeId].sat.sat_verbal_25th_percentile = row.getCell(
      COLLEGE_DS_SAT.sat.sat_verbal_25th_percentile
    ).value;
    collegeData[collegeId].sat.sat_verbal_75th_percentile = row.getCell(
      COLLEGE_DS_SAT.sat.sat_verbal_75th_percentile
    ).value;
    collegeData[collegeId].sat.sat_math_25th_percentile = row.getCell(
      COLLEGE_DS_SAT.sat.sat_math_25th_percentile
    ).value;
    collegeData[collegeId].sat.sat_math_75th_percentile = row.getCell(
      COLLEGE_DS_SAT.sat.sat_math_75th_percentile
    ).value;
    //console.log(`Row ${rowNumber}:`, collegeData[collegeId]);
  });
}

async function readACTScore(filePath) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  // find worksheet named 'TableLibrary'
  const worksheet = workbook.getWorksheet("TableLibrary");
  if (!worksheet) {
    console.error("Worksheet 'TableLibrary' not found.");
    return;
  }
  worksheet.eachRow((row, rowNumber) => {
    // Skip rows before the data begins
    if (rowNumber < COLLEGE_DS_ACT.data_beginning_row) {
      return;
    }
    // Skip empty rows
    const collegeId = row.getCell(COLLEGE_DS_ACT.collegeId).value;
    if (collegeId === undefined || collegeId === "" || collegeId === null) {
      return;
    }
    // check if collegeId is a number
    if (typeof collegeId !== "number") {
      return;
    }
    // Create a college object if it doesn't exist
    if (!collegeData[collegeId]) {
      collegeData[collegeId] = {
        collegeName: row.getCell(COLLEGE_DS_ACT.collegeName).value,
        act: {},
      };
    } else {
      collegeData[collegeId].act = {};
    }
    // Populate ACT data
    collegeData[collegeId].act.enrolled_submitted_act_cnt = row.getCell(
      COLLEGE_DS_ACT.act.enrolled_submitted_act_cnt
    ).value;
    collegeData[collegeId].act.enrolled_submitted_act_perc = row.getCell(
      COLLEGE_DS_ACT.act.enrolled_submitted_act_perc
    ).value;
    collegeData[collegeId].act.act_composite_25th_percentile = row.getCell(
      COLLEGE_DS_ACT.act.act_composite_25th_percentile
    ).value;
    collegeData[collegeId].act.act_composite_75th_percentile = row.getCell(
      COLLEGE_DS_ACT.act.act_composite_75th_percentile
    ).value;
    collegeData[collegeId].act.act_english_25th_percentile = row.getCell(
      COLLEGE_DS_ACT.act.act_english_25th_percentile
    ).value;
    collegeData[collegeId].act.act_english_75th_percentile = row.getCell(
      COLLEGE_DS_ACT.act.act_english_75th_percentile
    ).value;
    collegeData[collegeId].act.act_math_25th_percentile = row.getCell(
      COLLEGE_DS_ACT.act.act_math_25th_percentile
    ).value;
    collegeData[collegeId].act.act_math_75th_percentile = row.getCell(
      COLLEGE_DS_ACT.act.act_math_75th_percentile
    ).value;
    //console.log(`Row ${rowNumber}:`, collegeData[collegeId]);
  });
}

function getYearlyData(row, ds) {
  // write code to read the year data from year_data_beginning_column to year_data_ending_column
  // and populate the collegeData[collegeId].admission_trend[metric] object
  const data = {};
  const yearDataBegin = ds.year_data_beginning_column;
  const yearDataEnd = ds.year_data_ending_column;
  for (let i = yearDataBegin; i <= yearDataEnd; i++) {
    if (data !== undefined && data !== null && data !== "") {
      const year = ds.beginning_year + ds.year_increment * (i - yearDataBegin);
      data[year] = row.getCell(i).value;
    }
  }
  return data;
}

function initMetricDict(mappingArray) {
  let dict = {};
  mappingArray.map((metric) => (dict[metric.label] = metric.name));
  return dict;
}

const COLLEGE_DS_ADMISSION_TREND = {
  data_beginning_row: 6,
  collegeId: 1,
  collegeName: 2,
  admission_trend: {
    metric: 3,
    year_data_beginning_column: 4,
    year_data_ending_column: 13,
    beginning_year: 2023,
    year_increment: -1,
  },
  metric: [
    { label: "Number applicants", name: "applicants" },
    { label: "Number admitted", name: "admitted" },
    { label: "Number admitted who enrolled", name: "enrolled" },
    { label: "Percent applicants admitted", name: "aditted_perc" },
    {
      label: "Percent admitted who enrolled",
      name: "enrolled_perc",
    },
  ],
};

async function readAdmissionTrend(filePath) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  // find worksheet named 'TableLibrary'
  const worksheet = workbook.getWorksheet("TableLibrary");
  if (!worksheet) {
    console.error("Worksheet 'TableLibrary' not found.");
    return;
  }
  worksheet.eachRow((row, rowNumber) => {
    // Skip rows before the data begins
    if (rowNumber < COLLEGE_DS_ADMISSION_TREND.data_beginning_row) {
      return;
    }
    // Skip empty rows
    const collegeId = row.getCell(COLLEGE_DS_ADMISSION_TREND.collegeId).value;
    if (collegeId === undefined || collegeId === "" || collegeId === null) {
      return;
    }
    // check if collegeId is a number
    if (typeof collegeId !== "number") {
      return;
    }
    // Create a college object if it doesn't exist
    if (!collegeData[collegeId]) {
      collegeData[collegeId] = {
        collegeName: row.getCell(COLLEGE_DS_ADMISSION_TREND.collegeName).value,
        act: {},
      };
    }

    if (!collegeData[collegeId].admission_trend) {
      collegeData[collegeId].admission_trend = {};
    }

    const metric_name = row.getCell(
      COLLEGE_DS_ADMISSION_TREND.admission_trend.metric
    ).value;

    // write a javascript switch case to handle metric_name to metric.
    let metric;
    switch (metric_name) {
      case "Number applicants":
        metric = "applicants";
        break;
      case "Number admitted":
        metric = "admitted";
        break;
      case "Number admitted who enrolled":
        metric = "enrolled";
        break;
      case "Percent applicants admitted":
        metric = "admitted_perc";
        break;
      case "Percent admitted who enrolled":
        metric = "enrolled_perc";
        break;
      default:
        return; // Skip this row if the metric is unknown
    }

    // write code to read the year data from year_data_beginning_column to year_data_ending_column
    // and populate the collegeData[collegeId].admission_trend[metric] object
    const yearDataBegin =
      COLLEGE_DS_ADMISSION_TREND.admission_trend.year_data_beginning_column;
    const yearDataEnd =
      COLLEGE_DS_ADMISSION_TREND.admission_trend.year_data_ending_column;
    for (let i = yearDataBegin; i <= yearDataEnd; i++) {
      const data = row.getCell(i).value;
      if (data !== undefined && data !== null && data !== "") {
        const year =
          COLLEGE_DS_ADMISSION_TREND.admission_trend.beginning_year +
          COLLEGE_DS_ADMISSION_TREND.admission_trend.year_increment *
            (i - yearDataBegin);
        if (!collegeData[collegeId].admission_trend[metric]) {
          collegeData[collegeId].admission_trend[metric] = {};
        }
        if (!collegeData[collegeId].admission_trend[metric][year]) {
          collegeData[collegeId].admission_trend[metric][year] = {};
        }
        collegeData[collegeId].admission_trend[metric][year] = data;
      }
    }
    //console.log(`Row ${rowNumber}:`, collegeData[collegeId]);
  });
}

async function readAdmissionTrend2(filePath) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  // find worksheet named 'TableLibrary'
  const worksheet = workbook.getWorksheet("TableLibrary");
  if (!worksheet) {
    console.error("Worksheet 'TableLibrary' not found.");
    return;
  }
  const metricNameDict = initMetricDict(COLLEGE_DS_ADMISSION_TREND.metric);
  worksheet.eachRow((row, rowNumber) => {
    // Skip rows before the data begins
    if (rowNumber < COLLEGE_DS_ADMISSION_TREND.data_beginning_row) {
      return;
    }
    // Skip empty rows
    const collegeId = row.getCell(COLLEGE_DS_ADMISSION_TREND.collegeId).value;
    if (collegeId === undefined || collegeId === "" || collegeId === null) {
      return;
    }
    // check if collegeId is a number
    if (typeof collegeId !== "number") {
      return;
    }
    // Create a college object if it doesn't exist
    if (!collegeData[collegeId]) {
      collegeData[collegeId] = {
        collegeName: row.getCell(COLLEGE_DS_ADMISSION_TREND.collegeName).value,
        act: {},
      };
    }

    if (!collegeData[collegeId].admission_trend) {
      collegeData[collegeId].admission_trend = {};
    }

    const metric_label = row.getCell(
      COLLEGE_DS_ADMISSION_TREND.admission_trend.metric
    ).value;

    const metric = metricNameDict[metric_label];
    if (metric === undefined) return;
    // write a javascript switch case to handle metric_name to metric.

    // write code to read the year data from year_data_beginning_column to year_data_ending_column
    // and populate the collegeData[collegeId].admission_trend[metric] object
    collegeData[collegeId].admission_trend[metric] = getYearlyData(
      row,
      COLLEGE_DS_ADMISSION_TREND.admission_trend
    );

    console.log(`Row ${rowNumber}:`, collegeData[collegeId]);
  });
}

const COLLEGE_DS_RACE_DATA = {
  data_beginning_row: 6,
  collegeId: 1,
  collegeName: 2,
  race_data: {
    metric: 3,
    year_data_beginning_column: 5,
    year_data_ending_column: 14,
    beginning_year: 2023,
    year_increment: -1,
  },
  metric: [
    { label: "American Indian or Alaska Native ", name: "ai_an" },
    { label: "Asian ", name: "asian" },
    { label: "Black or African American   ", name: "black_aa" },
    { label: "Hispanic or Latino", name: "hispanic_l" },
    {
      label: "Native Hawaiian or Other Pacific Islander ",
      name: "hawaiian_opl",
    },
    { label: "White ", name: "white" },
    { label: "Two or more races ", name: "blend" },
    { label: "Race/ethnicity unknown ", name: "unknown" },
    { label: "U.S. Nonresident ", name: "nonresident" },
  ],
};

async function readRaceData(filePath) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  // find worksheet named 'TableLibrary'
  const worksheet = workbook.getWorksheet("TableLibrary");
  if (!worksheet) {
    console.error("Worksheet 'TableLibrary' not found.");
    return;
  }
  worksheet.eachRow((row, rowNumber) => {
    // Skip rows before the data begins
    if (rowNumber < COLLEGE_DS_RACE_DATA.data_beginning_row) {
      return;
    }
    // Skip empty rows
    const collegeId = row.getCell(COLLEGE_DS_RACE_DATA.collegeId).value;
    if (collegeId === undefined || collegeId === "" || collegeId === null) {
      return;
    }
    // check if collegeId is a number
    if (typeof collegeId !== "number") {
      return;
    }
    // Create a college object if it doesn't exist
    if (!collegeData[collegeId]) {
      collegeData[collegeId] = {
        collegeName: row.getCell(COLLEGE_DS_RACE_DATA.collegeName).value,
        act: {},
      };
    }

    if (!collegeData[collegeId].race_data) {
      collegeData[collegeId].race_data = {};
    }

    const metric_name = row.getCell(
      COLLEGE_DS_RACE_DATA.race_data.metric
    ).value;

    // write a javascript switch case to handle metric_name to metric.
    let metric;
    switch (metric_name) {
      case "American Indian or Alaska Native ":
        metric = "ai_an";
        break;
      case "Asian ":
        metric = "asian";
        break;
      case "Black or African American ":
        metric = "black_aa";
        break;
      case "Hispanic or Latino":
        metric = "hispanic_l";
        break;
      case "Native Hawaiian or Other Pacific Islander ":
        metric = "hawaii_pi";
        break;
      case "White ":
        metric = "white";
        break;
      case "Two or more races ":
        metric = "blend";
        break;
      case "Race/ethnicity unknown ":
        metric = "unknown";
        break;
      case "U.S. Nonresident ":
        metric = "nonresident";
        break;
      default:
        return; // Skip this row if the metric is unknown
    }

    // write code to read the year data from year_data_beginning_column to year_data_ending_column
    // and populate the collegeData[collegeId].admission_trend[metric] object
    const yearDataBegin =
      COLLEGE_DS_RACE_DATA.race_data.year_data_beginning_column;
    const yearDataEnd = COLLEGE_DS_RACE_DATA.race_data.year_data_ending_column;
    for (let i = yearDataBegin; i <= yearDataEnd; i++) {
      const data = row.getCell(i).value;
      if (data !== undefined && data !== null && data !== "") {
        const year =
          COLLEGE_DS_RACE_DATA.race_data.beginning_year +
          COLLEGE_DS_RACE_DATA.race_data.year_increment * (i - yearDataBegin);
        if (!collegeData[collegeId].race_data[metric]) {
          collegeData[collegeId].race_data[metric] = {};
        }
        if (!collegeData[collegeId].race_data[metric][year]) {
          collegeData[collegeId].race_data[metric][year] = {};
        }
        collegeData[collegeId].race_data[metric][year] = data;
      }
    }
    console.log(`Row ${rowNumber}:`, collegeData[collegeId]);
  });
}

const ReadData = async () => {
  //await readSATScore("../data/sat_scores.xlsx");
  //await readACTScore("../data/act_scores.xlsx");
  await readAdmissionTrend2("../data/admission_trends.xlsx");
  //await readRaceData("../data/Enrollment_data_race.xlsx");
};
ReadData();
//console.log(initMetricDict(COLLEGE_DS_ADMISSION_TREND.metric));
