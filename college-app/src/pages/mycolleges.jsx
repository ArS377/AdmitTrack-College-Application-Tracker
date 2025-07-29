import React, { useState, useEffect } from "react";
import "./mycolleges.css";
import SearchBar from "../components/SearchBar";
import SearchResultsList from "../components/SearchResultsList";
import CollegeDetail from "../components/CollegeDetail";
import CollegeList from "../components/CollegeList";
import axios from "axios";
import { getUser } from "../User";

export function MyColleges() {
  const [collegeList, setCollegeList] = useState([]);
  const [results, setResults] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState(null);

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
  }, []);

  const onSelectCollege = (college) => {
    console.log("Selected college:", college); //college printed in console
    setSelectedCollege(college);
    setResults([]); //clear search results list
  };

  const addCollegeToList = async () => {
    const email = getUser().email;
    if (selectedCollege) {
      const isAlreadyAdded = collegeList.some(
        (college) => college._id === selectedCollege._id
      );

      if (isAlreadyAdded) {
        alert(`${selectedCollege.collegeName} is already in your list.`);
        return;
      }
      setCollegeList((prevList) => [...prevList, selectedCollege]);
      setSelectedCollege(null); //clears info box

      /*
      await fetch("http://localhost:3000/api/mycolleges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, collegeId: selectedCollege._id }),
      });
      */

      try {
        console.log("email: ", email);
        const response = await axios({
          method: "post",
          url: "http://localhost:3000/api/mycolleges",
          data: {
            email: email,
            collegeId: selectedCollege._id,
            collegeName: selectedCollege.collegeName,
          },
        });
        /*
        axios.post("http://localhost:3000/api/mycolleges", {
          email: email,
          collegeId: selectedCollege._id,
        });*/
        console.log("College added successfully:", response.data);
      } catch (error) {
        console.error("Error adding college:", error);
      }
    } else {
      alert("Please select a college from the search results first!");
    }
  };

  const deleteCollegeFromList = async (collegeId, collegeName) => {
    const email = getUser().email;

    setCollegeList((prevList) =>
      prevList.filter((college) => college._id !== collegeId)
    );
    setSelectedCollege(null);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/mycolleges/delete",
        {
          email: email,
          collegeId: collegeId,
          collegeName: collegeName,
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
    <div className="container text-center subject">
      <div className="row align-items-start">
        <div className="col num1">
          <h2>Search for Colleges</h2>
          <div className="searchBarContainer">
            <SearchBar setResults={setResults} />
            <SearchResultsList
              results={results}
              onSelectCollege={onSelectCollege}
            />
          </div>
          <CollegeDetail
            selectedCollege={selectedCollege}
            addCollegeToList={() => addCollegeToList()}
          />
        </div>

        <div className="col num2">
          <CollegeList
            collegeList={collegeList}
            deleteCollegeFromList={(collegeId, collegeName) =>
              deleteCollegeFromList(collegeId, collegeName)
            }
          />
        </div>
      </div>
    </div>
  );
}
