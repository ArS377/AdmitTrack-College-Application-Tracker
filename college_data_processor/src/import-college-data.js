const ExcelJS = require("exceljs");

function applyFormatter(value, formatter) {
  return formatter ? formatter(value) : value;
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
      data[year] = applyFormatter(row.getCell(i).value, ds.formatter);
    }
  }
  return data;
}

function initLabelNameDict(mappingArray) {
  let dict = {};
  mappingArray.map((metric) => (dict[metric.label.trim()] = metric.name));
  return dict;
}

function readMetricGroupData(
  row,
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

    const classification_label = row
      .getCell(metric_group_ds.classification.column)
      .value.trim();
    const classification_name = labelNameDict[classification_label];
    if (classification_name === undefined) return;

    metric_group_data[classification_name] = {}; // initialize the object
    metric_group_data = metric_group_data[classification_name];
  }
  metric_group_ds.metrics.forEach((metric) => {
    metric_group_data[metric.name] = applyFormatter(
      row.getCell(metric.column).value,
      metric.formatter
    );
  });
}
function readAnnualData(row, annual_trend, metricNameDict, perCollegeData) {
  const data_label = annual_trend.data_label;
  if (!perCollegeData[data_label]) {
    perCollegeData[data_label] = {};
  }

  const metric_label = row
    .getCell(annual_trend.classification.column)
    .value.trim();
  const metric = metricNameDict[metric_label];
  if (metric === undefined) return;

  perCollegeData[data_label][metric] = getYearlyData(row, annual_trend);
}

async function parseCollegeData(filePath, dataStructure, collegeData) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  // find worksheet named 'TableLibrary'
  const worksheet = workbook.getWorksheet(dataStructure.worksheet);
  if (!worksheet) {
    console.error(`Worksheet '${dataStructure.worksheet}' not found.`);
    return;
  }
  let labelNameDict = undefined;
  if (dataStructure.annual_trend && dataStructure.annual_trend.classification) {
    labelNameDict = initLabelNameDict(
      dataStructure.annual_trend.classification.label_mapping
    );
  }
  if (dataStructure.metric_group && dataStructure.metric_group.classification) {
    labelNameDict = initLabelNameDict(
      dataStructure.metric_group.classification.label_mapping
    );
  }

  worksheet.eachRow((row, rowNumber) => {
    // Skip rows before the data begins
    if (rowNumber < dataStructure.data_beginning_row) {
      return;
    }
    // Skip empty rows
    const collegeId = row.getCell(dataStructure.collegeId).value;
    if (collegeId === undefined || collegeId === "" || collegeId === null) {
      return;
    }
    // check if collegeId is a number
    if (typeof collegeId !== "number") {
      return;
    }
    // Create a college object if it doesn't exist
    let perCollegeData = undefined;
    if (collegeData.has(collegeId)) {
      perCollegeData = collegeData.get(collegeId);
    } else {
      perCollegeData = {
        unitId: collegeId,
        collegeName: row.getCell(dataStructure.collegeName).value,
      };
      collegeData.set(collegeId, perCollegeData);
    }

    if (dataStructure.metric_group) {
      readMetricGroupData(
        row,
        dataStructure.metric_group,
        labelNameDict,
        perCollegeData
      );
    }
    if (dataStructure.annual_trend) {
      // row, annual_trend (ds), metric name mapping dictionary
      readAnnualData(
        row,
        dataStructure.annual_trend,
        labelNameDict,
        perCollegeData
      );
    }
    //console.log(`Row ${rowNumber}:`, collegeData[collegeId]);
  });
}

const COLLEGE_DS_INFO = {
  worksheet: "TableLibrary",
  data_beginning_row: 6,
  collegeId: 1,
  collegeName: 2,
  metric_group: {
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
};

const COLLEGE_DS_SAT = {
  worksheet: "TableLibrary",
  data_beginning_row: 6,
  collegeId: 1,
  collegeName: 2,
  metric_group: {
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
};

const COLLEGE_DS_ACT = {
  worksheet: "TableLibrary",
  data_beginning_row: 6,
  collegeId: 1,
  collegeName: 2,
  metric_group: {
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
  metric_group: {
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
};

const ReadData = async (collegeData) => {
  await parseCollegeData(
    "../data/institution_info.xlsx",
    COLLEGE_DS_INFO,
    collegeData
  );

  await parseCollegeData(
    "../data/sat_scores.xlsx",
    COLLEGE_DS_SAT,
    collegeData
  );

  await parseCollegeData(
    "../data/act_scores.xlsx",
    COLLEGE_DS_ACT,
    collegeData
  );

  await parseCollegeData(
    "../data/admission_trends.xlsx",
    COLLEGE_DS_ADMISSION_TREND,
    collegeData
  );

  await parseCollegeData(
    "../data/Enrollment_data_race.xlsx",
    COLLEGE_DS_RACE_DATA,
    collegeData
  );

  await parseCollegeData(
    "../data/Enrollment_data_gender.xlsx",
    COLLEGE_DS_GENDER_DATA,
    collegeData
  );

  console.log(`College count: ${collegeData.size}`);
  console.log(collegeData.get(243744));
  const json = JSON.stringify(Array.from(collegeData.entries()));
  console.log("json data length: ", json.length.toLocaleString());
  //
};

const collegeData = new Map();
ReadData(collegeData);
//console.log(initMetricDict(COLLEGE_DS_ADMISSION_TREND.metric));
