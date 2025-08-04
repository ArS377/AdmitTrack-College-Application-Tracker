import ToDo from "../components/ToDoList.jsx";
import ExpandedCollegeList from "../components/ExpandedCollegeList.jsx";
import React, { useState, useEffect } from "react";
import { getUser } from "../User";
import axios from "axios";

export function Home() {
  const [collegeList, setCollegeList] = useState([]);

  useEffect(() => {
    const fetchMyColleges = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/mycolleges`
        );
        const colleges = response ? response.data : [];
        console.log(colleges);
        setCollegeList(colleges); // Update state with fetched data
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchMyColleges();
  }, [getUser()]);

  const deleteCollegeFromList = async (collegeId, collegeName) => {
    const email = getUser().email;

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
          email,
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
