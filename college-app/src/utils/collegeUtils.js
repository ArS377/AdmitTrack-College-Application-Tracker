import axios from "axios";
export const fetchMyColleges = async () => {
  let colleges = [];
  try {
    const response = await axios.get(`http://localhost:3000/api/mycolleges`);
    if (response.status === 200) {
      colleges = response.data;
    } else {
      console.error("Failed to fetch colleges:", response.statusText);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
  console.log("College List: ", colleges);
  return colleges;
};
