import axios from "axios";
export const fetchMyColleges = async () => {
  let colleges = [];
  const apiUrl = import.meta.env.VITE_API_URL;

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
  console.log("College List: ", colleges);
  return colleges;
};
