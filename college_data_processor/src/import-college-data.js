import ExcelJS from "exceljs";
import { createReadStream, writeFile } from "fs";
import csv from "csv-parser";

function applyFormatter(value, formatter) {
  return value === "-" || value === null
    ? undefined
    : formatter
    ? formatter(value)
    : value;
}

function getYearlyData(dataFn, ds) {
  // write code to read the year data from year_data_beginning_column to year_data_ending_column
  // and populate the collegeData[collegeId].admission_trend[metric] object
  const data = {};
  const yearDataBegin = ds.year_data_beginning_column;
  const yearDataEnd = ds.year_data_ending_column;
  for (let i = yearDataBegin; i <= yearDataEnd; i++) {
    if (data !== undefined && data !== null && data !== "") {
      const year = ds.beginning_year + ds.year_increment * (i - yearDataBegin);
      data[year] = applyFormatter(dataFn(i), ds.formatter);
    }
  }
  return data;
}

function readMetricGroupData(
  dataFn,
  metric_group_ds,
  labelNameDict,
  perCollegeData
) {
  const data_label = metric_group_ds.data_label;
  if (!perCollegeData[data_label]) {
    perCollegeData[data_label] = {};
  }
  let metric_group_data = perCollegeData[data_label];

  if (metric_group_ds.classification) {
    // apply classification if present

    let classification_label = dataFn(metric_group_ds.classification.column);
    classification_label = classification_label && classification_label.trim();
    const classification_name = labelNameDict[classification_label];
    if (classification_name === undefined) return;

    metric_group_data[classification_name] = {}; // initialize the object
    metric_group_data = metric_group_data[classification_name];
  }
  metric_group_ds.metrics.forEach((metric) => {
    metric_group_data[metric.name] = applyFormatter(
      dataFn(metric.column),
      metric.formatter
    );
  });
}

function readAnnualData(dataFn, annual_trend, metricNameDict, perCollegeData) {
  const data_label = annual_trend.data_label;
  if (!perCollegeData[data_label]) {
    perCollegeData[data_label] = {};
  }

  let metric_label = dataFn(annual_trend.classification.column);
  metric_label = metric_label && metric_label.trim();
  const metric = metricNameDict[metric_label];
  if (metric === undefined) return;

  perCollegeData[data_label][metric] = getYearlyData(dataFn, annual_trend);
}

function parseDataRow(dataFn, dataStructure, labelNameDict, collegeData) {
  // Skip empty rows
  const id = dataFn(dataStructure.collegeId);
  if (id === undefined || id === "" || id === null) {
    return;
  }
  // check if collegeId is a number
  const collegeId = parseInt(id);
  //console.log("here 2");

  // Create a college object if it doesn't exist
  let perCollegeData = undefined;
  if (collegeData.has(collegeId)) {
    perCollegeData = collegeData.get(collegeId);
  } else {
    perCollegeData = {
      unitId: collegeId,
      collegeName: dataFn(dataStructure.collegeName),
    };
    collegeData.set(collegeId, perCollegeData);
  }

  if (dataStructure.metric_group) {
    dataStructure.metric_group.forEach((metric_group, index) => {
      readMetricGroupData(dataFn, metric_group, labelNameDict, perCollegeData);
    });
  }
  if (dataStructure.annual_trend) {
    // row, annual_trend (ds), metric name mapping dictionary
    readAnnualData(
      dataFn,
      dataStructure.annual_trend,
      labelNameDict,
      perCollegeData
    );
  }
  //console.log(`Row ${rowNumber}:`, collegeData[collegeId]);
}

function initializeLabelNameDict(dataStructure) {
  let labelNameDict = {};

  if (dataStructure.annual_trend && dataStructure.annual_trend.classification) {
    dataStructure.annual_trend.classification.label_mapping.map(
      (metric) => (labelNameDict[metric.label.trim()] = metric.name)
    );
  }
  if (dataStructure.metric_group) {
    dataStructure.metric_group.forEach((metric_group, index) => {
      if (metric_group.classification) {
        metric_group.classification.label_mapping.map(
          (metric) => (labelNameDict[metric.label.trim()] = metric.name)
        );
      }
    });
  }
  return labelNameDict;
}

async function parseCollegeDataCsv(filePath, dataStructure, collegeData) {
  let labelNameDict = initializeLabelNameDict(dataStructure);

  console.log("here 1");
  createReadStream(filePath)
    .pipe(csv({ headers: false, skipLines: 1 }))
    .on("data", (data) =>
      parseDataRow(
        (i) => data[i - 1],
        dataStructure,
        labelNameDict,
        collegeData
      )
    )
    .on("end", () => {
      console.log(`College count: ${collegeData.size}`);
    });
}

async function parseCollegeDataXlsx(filePath, dataStructure, collegeData) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  // find worksheet named 'TableLibrary'
  const worksheet = workbook.getWorksheet(dataStructure.worksheet);
  if (!worksheet) {
    console.error(`Worksheet '${dataStructure.worksheet}' not found.`);
    return;
  }
  let labelNameDict = initializeLabelNameDict(dataStructure);

  worksheet.eachRow((row, rowNumber) => {
    // Skip rows before the data begins
    if (rowNumber < dataStructure.data_beginning_row) {
      return;
    }
    // Skip rows before the data begins
    parseDataRow(
      (i) => row.getCell(i).value,
      dataStructure,
      labelNameDict,
      collegeData
    );
  });
}

const COLLEGE_DS_INFO = {
  worksheet: "TableLibrary",
  data_beginning_row: 6,
  collegeId: 1,
  collegeName: 2,
  metric_group: [
    {
      data_label: "info",
      metrics: [
        { name: "address", column: 7 },
        {
          name: "website",
          column: 8,
          formatter: (value) =>
            // write code to check if value has prefix https:// and if not add the prefix.
            value
              .replace(/^http:\/\//i, "https://")
              .replace(/^(?!https:\/\/)/i, "https://"),
        },
      ],
    },
  ],
};

const COLLEGE_DS_SAT = {
  worksheet: "TableLibrary",
  data_beginning_row: 6,
  collegeId: 1,
  collegeName: 2,
  metric_group: [
    {
      data_label: "sat_scores",
      metrics: [
        { name: "submitted_cnt", column: 7 },
        { name: "submitted_pct", column: 8 },
        { name: "english25", column: 21 },
        { name: "english75", column: 31 },
        { name: "math25", column: 41 },
        { name: "math75", column: 51 },
      ],
    },
  ],
};

const COLLEGE_DS_REQ = {
  collegeId: 1,
  collegeName: 2,
  metric_group: [
    {
      data_label: "tuition",
      metrics: [
        { name: "in-state", column: 3 },
        { name: "out-of-state", column: 4 },
      ],
    },
    {
      data_label: "requirements",
      metrics: [
        {
          name: "gpa",
          column: 6,
        },
        { name: "rank", column: 7 },
        { name: "record", column: 8 },
        { name: "college_prep", column: 9 },
        { name: "reccommendation", column: 10 },
        { name: "formal_competency", column: 11 },
        { name: "work_exp", column: 12 },
        { name: "essay", column: 13 },
        { name: "legacy", column: 14 },
        { name: "test_score", column: 15 },
        { name: "other_test", column: 16 },
        { name: "eng_proficiency", column: 17 },
      ],
    },
    {
      data_label: "applicants",
      metrics: [
        { name: "total", column: 18, formatter: (value) => parseInt(value) },
        { name: "men", column: 19, formatter: (value) => parseInt(value) },
        { name: "women", column: 20, formatter: (value) => parseInt(value) },
        { name: "other", column: 21, formatter: (value) => parseInt(value) },
        { name: "unknown", column: 22, formatter: (value) => parseInt(value) },
      ],
    },
    {
      data_label: "admissions",
      metrics: [
        { name: "total", column: 23, formatter: (value) => parseInt(value) },
        { name: "men", column: 24, formatter: (value) => parseInt(value) },
        { name: "women", column: 25, formatter: (value) => parseInt(value) },
        { name: "other", column: 26, formatter: (value) => parseInt(value) },
        { name: "unknown", column: 27, formatter: (value) => parseInt(value) },
      ],
    },
    {
      data_label: "enrolled",
      metrics: [
        { name: "total", column: 28, formatter: (value) => parseInt(value) },
        { name: "men", column: 29, formatter: (value) => parseInt(value) },
        { name: "women", column: 30, formatter: (value) => parseInt(value) },
        { name: "other", column: 31, formatter: (value) => parseInt(value) },
        { name: "unknown", column: 32, formatter: (value) => parseInt(value) },
      ],
    },
    {
      data_label: "ft",
      metrics: [
        { name: "total", column: 33, formatter: (value) => parseInt(value) },
        { name: "men", column: 34, formatter: (value) => parseInt(value) },
        { name: "women", column: 35, formatter: (value) => parseInt(value) },
        { name: "other", column: 36, formatter: (value) => parseInt(value) },
        { name: "unknown", column: 37, formatter: (value) => parseInt(value) },
      ],
    },
    {
      data_label: "pt",
      metrics: [
        { name: "total", column: 38, formatter: (value) => parseInt(value) },
        { name: "men", column: 39, formatter: (value) => parseInt(value) },
        { name: "women", column: 40, formatter: (value) => parseInt(value) },
        { name: "other", column: 41, formatter: (value) => parseInt(value) },
        { name: "unknown", column: 42, formatter: (value) => parseInt(value) },
      ],
    },
    {
      data_label: "sat",
      metrics: [
        {
          name: "submitted_cnt",
          column: 43,
          formatter: (value) => parseInt(value),
        },
        {
          name: "submitted_pct",
          column: 44,
          formatter: (value) => parseInt(value),
        },
        { name: "eng25", column: 47, formatter: (value) => parseInt(value) },
        { name: "eng50", column: 48, formatter: (value) => parseInt(value) },
        { name: "eng75", column: 49, formatter: (value) => parseInt(value) },
        { name: "math25", column: 50, formatter: (value) => parseInt(value) },
        { name: "math50", column: 51, formatter: (value) => parseInt(value) },
        { name: "math75", column: 52, formatter: (value) => parseInt(value) },
      ],
    },
    {
      data_label: "act",
      metrics: [
        {
          name: "submitted_cnt",
          column: 45,
          formatter: (value) => parseInt(value),
        },
        {
          name: "submitted_pct",
          column: 46,
          formatter: (value) => parseInt(value),
        },
        {
          name: "composite25",
          column: 53,
          formatter: (value) => parseInt(value),
        },
        {
          name: "composite50",
          column: 54,
          formatter: (value) => parseInt(value),
        },
        {
          name: "composite75",
          column: 55,
          formatter: (value) => parseInt(value),
        },
        { name: "eng25", column: 56, formatter: (value) => parseInt(value) },
        { name: "eng50", column: 57, formatter: (value) => parseInt(value) },
        { name: "eng75", column: 58, formatter: (value) => parseInt(value) },
        { name: "math25", column: 59, formatter: (value) => parseInt(value) },
        { name: "math50", column: 60, formatter: (value) => parseInt(value) },
        { name: "math75", column: 61, formatter: (value) => parseInt(value) },
      ],
    },
    {
      data_label: "race",
      metrics: [
        { name: "total", column: 62, formatter: (value) => parseInt(value) },
        { name: "total_m", column: 63, formatter: (value) => parseInt(value) },
        { name: "total_w", column: 64, formatter: (value) => parseInt(value) },
        { name: "native", column: 65, formatter: (value) => parseInt(value) },
        { name: "native_m", column: 66, formatter: (value) => parseInt(value) },
        { name: "native_w", column: 67, formatter: (value) => parseInt(value) },
        { name: "asian", column: 68, formatter: (value) => parseInt(value) },
        { name: "asian_m", column: 69, formatter: (value) => parseInt(value) },
        { name: "aisan_w", column: 70, formatter: (value) => parseInt(value) },
        { name: "black", column: 71, formatter: (value) => parseInt(value) },
        { name: "black_m", column: 72, formatter: (value) => parseInt(value) },
        { name: "black_w", column: 73, formatter: (value) => parseInt(value) },
        { name: "hispanic", column: 74, formatter: (value) => parseInt(value) },
        {
          name: "hispanic_m",
          column: 75,
          formatter: (value) => parseInt(value),
        },
        {
          name: "hispanic_w",
          column: 76,
          formatter: (value) => parseInt(value),
        },
        { name: "hawaiian", column: 77, formatter: (value) => parseInt(value) },
        {
          name: "hawaiian_m",
          column: 78,
          formatter: (value) => parseInt(value),
        },
        {
          name: "hawaiian_w",
          column: 79,
          formatter: (value) => parseInt(value),
        },
        { name: "white", column: 80, formatter: (value) => parseInt(value) },
        { name: "white_m", column: 81, formatter: (value) => parseInt(value) },
        { name: "white_w", column: 82, formatter: (value) => parseInt(value) },
        { name: "blend", column: 83, formatter: (value) => parseInt(value) },
        { name: "blend_m", column: 84, formatter: (value) => parseInt(value) },
        { name: "blend_w", column: 85, formatter: (value) => parseInt(value) },
        { name: "unknown", column: 86, formatter: (value) => parseInt(value) },
        {
          name: "unknown_m",
          column: 87,
          formatter: (value) => parseInt(value),
        },
        {
          name: "unknown_w",
          column: 88,
          formatter: (value) => parseInt(value),
        },
        {
          name: "nonresident",
          column: 89,
          formatter: (value) => parseInt(value),
        },
        {
          name: "nonresident_m",
          column: 90,
          formatter: (value) => parseInt(value),
        },
        {
          name: "nonresident_w",
          column: 91,
          formatter: (value) => parseInt(value),
        },
      ],
    },
  ],
};

const COLLEGE_DS_ACT = {
  worksheet: "TableLibrary",
  data_beginning_row: 6,
  collegeId: 1,
  collegeName: 2,
  metric_group: [
    {
      data_label: "act_scores",
      metrics: [
        { name: "submitted_cnt", column: 9 },
        { name: "submitted_pct", column: 10 },
        { name: "composite25", column: 21 },
        { name: "composite75", column: 31 },
        { name: "english25", column: 41 },
        { name: "english75", column: 51 },
        { name: "math25", column: 61 },
        { name: "math75", column: 71 },
      ],
    },
  ],
};

const COLLEGE_DS_ADMISSION_TREND = {
  worksheet: "TableLibrary",
  data_beginning_row: 6,
  collegeId: 1,
  collegeName: 2,
  annual_trend: {
    data_label: "admission_trend",
    classification: {
      column: 3,
      label_mapping: [
        { label: "Number applicants", name: "applicants" },
        { label: "Number admitted", name: "admitted" },
        { label: "Number admitted who enrolled", name: "enrolled" },
        { label: "Percent applicants admitted", name: "admitted_pct" },
        {
          label: "Percent admitted who enrolled",
          name: "enrolled_pct",
        },
      ],
    },
    year_data_beginning_column: 4,
    year_data_ending_column: 13,
    beginning_year: 2023,
    year_increment: -1,
  },
};

const COLLEGE_DS_RACE_DATA = {
  worksheet: "TableLibrary",
  data_beginning_row: 6,
  collegeId: 1,
  collegeName: 2,
  annual_trend: {
    data_label: "race_data",
    classification: {
      column: 3,
      label_mapping: [
        { label: "American Indian or Alaska Native", name: "native" },
        { label: "Asian", name: "asian" },
        { label: "Black or African American", name: "black_aa" },
        { label: "Hispanic or Latino", name: "hispanic_l" },
        {
          label: "Native Hawaiian or Other Pacific Islander",
          name: "hawaiian_opl",
        },
        { label: "White", name: "white" },
        { label: "Two or more races", name: "blend" },
        { label: "Race/ethnicity unknown", name: "unknown" },
        { label: "U.S. Nonresident", name: "nonresident" },
      ],
    },
    year_data_beginning_column: 5,
    year_data_ending_column: 14,
    beginning_year: 2023,
    year_increment: -1,
  },
};

const COLLEGE_DS_GENDER_DATA = {
  worksheet: "TableLibrary",
  data_beginning_row: 6,
  collegeId: 1,
  collegeName: 2,
  metric_group: [
    {
      data_label: "gender_data",
      classification: {
        column: 3,
        label_mapping: [{ label: "Undergraduate Enrollment", name: "ug" }],
      },
      metrics: [
        { name: "men_ft", column: 6 },
        { name: "women_ft", column: 7 },
        { name: "men_pt", column: 9 },
        { name: "women_pt", column: 10 },
      ],
    },
  ],
};

const ReadData = async (collegeData) => {
  /*
  await parseCollegeDataXlsx(
    "../data/sat_scores.xlsx",
    COLLEGE_DS_SAT,
    collegeData
  );
  await parseCollegeDataXlsx(
    "../data/act_scores.xlsx",
    COLLEGE_DS_ACT,
    collegeData
  );

  await parseCollegeDataXlsx(
    "../data/admission_trends.xlsx",
    COLLEGE_DS_ADMISSION_TREND,
    collegeData
  );
  await parseCollegeDataXlsx(
    "../data/Enrollment_data_gender.xlsx",
    COLLEGE_DS_GENDER_DATA,
    collegeData
  );
  await parseCollegeDataXlsx(
    "../data/Enrollment_data_race.xlsx",
    COLLEGE_DS_RACE_DATA,
    collegeData
  );
  await parseCollegeDataXlsx(
    "../data/Enrollment_data_race.xlsx",
    COLLEGE_DS_RACE_DATA,
    collegeData
  );
*/
  await parseCollegeDataCsv(
    "../data/ipeds_college_data.csv",
    COLLEGE_DS_REQ,
    collegeData
  );

  //TBD: FIX THE forced sequencing: we need time for the CSV parser to finish.
  // Hence parsing the Xlsx at the end.
  await parseCollegeDataXlsx(
    "../data/institution_info.xlsx",
    COLLEGE_DS_INFO,
    collegeData
  );

  console.log(`College count: ${collegeData.size}`);
  console.log(collegeData.get(243744));
  console.log(collegeData.get(105668));

  const jsondata = JSON.stringify(Array.from(collegeData.values()));
  // write the json data into a file.
  //console.log(jsondata);

  console.log("json data length: ", jsondata.length.toLocaleString());

  writeFile("collegedata.json", jsondata, (err) => {
    if (err) {
      console.error("Error writing file:", err);
    } else {
      console.log("College Data is written successfully to collegedata.json!");
    }
  });
  //
};

const collegeData = new Map();
await ReadData(collegeData);
//console.log(initMetricDict(COLLEGE_DS_ADMISSION_TREND.metric));
