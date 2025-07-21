import React, { useState } from "react";
import "./mycolleges.css";
import SearchBar from "../components/SearchBar";
import SearchResultsList from "../components/SearchResultsList";
import CollegeDetail from "../components/CollegeDetail";
import CollegeList from "../components/CollegeList";

export function MyColleges() {
  const [collegeList, setCollegeList] = useState([]);
  const [results, setResults] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState(null);

  const onSelectCollege = (college) => {
    console.log("Selected college:", college); //college printed in console
    setSelectedCollege(college);
    setResults([]); //clear search results list
  };

  const addCollegeToList = async (email) => {
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

      await fetch("http://localhost:3000/api/mycolleges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, collegeId: selectedCollege._id }),
      });
    } else {
      alert("Please select a college from the search results first!");
    }
  };

  const deleteCollegeFromList = async (collegeId, email) => {
    setCollegeList((prevList) =>
      prevList.filter((college) => college._id !== collegeId)
    );
    setSelectedCollege(null);

    await fetch("http://localhost:3000/api/mycolleges", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, collegeId: collegeId }),
    });
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
            addCollegeToList={addCollegeToList}
          />
        </div>

        <div className="col num2">
          <CollegeList
            collegeList={collegeList}
            deleteCollegeFromList={deleteCollegeFromList}
          />
        </div>
      </div>
    </div>
  );
}
