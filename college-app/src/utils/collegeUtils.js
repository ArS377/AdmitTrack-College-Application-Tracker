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
  } catch (error) {
    console.error("Error fetching data:", error);
  }
  console.log(`My Colleges Count = ${colleges.length}`);
  return colleges;
};

export async function addToMyColleges(college) {
  try {
    const response = await axios({
      method: "post",
      url: `${apiUrl}/mycolleges`,
      data: {
        collegeId: college.unitId,
        collegeName: college.collegeName,
      },
    });
    if (response && response.status === 200) {
      console.log("College added successfully:", response.data);
      return true;
    }
  } catch (error) {
    console.error("Error adding college:", error);
  }
  return false;
}
