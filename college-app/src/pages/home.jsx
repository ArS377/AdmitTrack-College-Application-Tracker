import ExpandedCollegeList from "../components/ExpandedCollegeList";
import { useState, useEffect } from "react";
import axios from "axios";
import { fetchMyColleges } from "../utils/collegeUtils"; // Assuming you have a utility function to fetch colleges

export function Home() {
  const [collegeList, setCollegeList] = useState([]);
  useEffect(() => {
    const fmc = async () => {
      const colleges = await fetchMyColleges();
      setCollegeList(colleges);
    };
    fmc();
  }, []);

  const deleteCollegeFromList = async (collegeId, collegeName) => {
    setCollegeList((prevList) =>
      prevList.filter(
        (college) =>
          String(college.collegeId || college._id) !== String(collegeId)
      )
    );

    try {
      const response = await axios.post(
        "http://localhost:3000/api/mycolleges/delete",
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
            deleteCollegeFromList={(collegeId, collegeName) =>
              deleteCollegeFromList(collegeId, collegeName)
            }
          />
        </div>
      </div>
    </>
  );
}
