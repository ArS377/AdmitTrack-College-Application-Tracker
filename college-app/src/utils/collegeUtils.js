import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;
export const fetchMyColleges = async () => {
  let colleges = [];

  try {
    const response = await axios.get(`${apiUrl}/mycolleges`);
    if (response && response.status === 200) {
      colleges = response.data;
    } else {
      response &&
        console.error("Failed to fetch colleges:", response.statusText);
    }
    console.log(`My Colleges Count = ${colleges.length}`);
    return colleges;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export async function addToMyColleges(college) {
  try {
    const response = await axios({
      method: "post",
      url: `${apiUrl}/mycolleges`,
      data: {
        unitId: college.unitId,
        collegeName: college.collegeName,
      },
    });
    if (response && response.status === 200) {
      console.log("College added successfully:", response.data);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error adding college:", error);
    throw error;
  }
}

export async function deleteFromMyColleges(unitId, collegeName) {
  try {
    console.log("Deleting college:", unitId, collegeName);
    const response = await axios.post(
      `${apiUrl}/mycolleges/delete`,
      {
        unitId,
        collegeName,
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    console.log("College deleted successfully:", response.data);
    if (response && response.status === 200) {
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error deleting college:", error);
    throw error;
  }
}

function getMyCollegeStatusString(college) {
  return JSON.stringify(college);
}
export async function updateMyCollegeDetail(college) {
  try {
    console.log(
      `updating college detail: ${getMyCollegeStatusString(college)} `
    );
    const response = await axios({
      method: "put",
      url: `${apiUrl}/mycolleges/${college.unitId}`,
      data: {
        ...college,
      },
    });
    if (response && response.status === 200) {
      console.log("College updated successfully:", response.data);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error adding college:", error);
    throw error;
  }
}

export async function updateCollegeCategory(college, category) {
  college = { ...college, category };
  return updateMyCollegeDetail(college);
}

export async function updateCollegeAppType(college, appType) {
  college = { ...college, appType };
  return updateMyCollegeDetail(college);
}
export async function updateEssayProgress(college, essayProgress) {
  college = { ...college, essayProgress };
  return updateMyCollegeDetail(college);
}
export async function updateAppSubmissionStatus(college, appSubmissionStatus) {
  college = { ...college, appSubmissionStatus };
  return updateMyCollegeDetail(college);
}
export async function updateTestScoreStatus(college, testScoreStatus) {
  college = { ...college, testScoreStatus };
  return updateMyCollegeDetail(college);
}
export async function updateApibScoreStatus(college, apibScoreStatus) {
  college = { ...college, apibScoreStatus };
  return updateMyCollegeDetail(college);
}
export async function updateLorStatus(college, lorStatus) {
  college = { ...college, lorStatus };
  return updateMyCollegeDetail(college);
}
export async function updateTranscriptStatus(college, transcriptStatus) {
  college = { ...college, transcriptStatus };
  return updateMyCollegeDetail(college);
}
