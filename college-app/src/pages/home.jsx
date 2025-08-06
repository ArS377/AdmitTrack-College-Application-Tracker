import ExpandedCollegeList from "../components/ExpandedCollegeList";
import { useState, useEffect } from "react";
import axios from "axios";
import { fetchMyColleges } from "../utils/collegeUtils"; // Assuming you have a utility function to fetch colleges

export function Home() {
  const [collegeList, setCollegeList] = useState([]);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fmc = async () => {
      const colleges = await fetchMyColleges();
      setCollegeList(colleges);
    };
    fmc();
  }, []);

  const deleteCollegeFromList = async (collegeId, collegeName) => {
    console.log("Deleting college2:", collegeId, collegeName);
    setCollegeList((prevList) =>
      prevList.filter(
        (college) => String(college.collegeId) !== String(collegeId)
      )
    );

    try {
      const response = await axios.post(
        `${apiUrl}/mycolleges/delete`,
        {
          collegeId,
          collegeName,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log("College deleted successfully:", response.data);
    } catch (error) {
      console.error("Error deleting college:", error);
    }
  };
  return (
    <>
      <div>
        <h2>Welcome!</h2>
        <div>
          <ExpandedCollegeList
            collegeList={collegeList}
            deleteCollegeFromList={deleteCollegeFromList}
          />
        </div>
      </div>
    </>
  );
}
