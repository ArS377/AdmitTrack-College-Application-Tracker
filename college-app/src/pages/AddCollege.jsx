import { useState, useEffect } from "react";
import "./AddCollege.css";
import SearchBar from "../components/SearchBar";
import SearchResultsList from "../components/SearchResultsList";
import CollegeInfoShort from "../components/CollegeInfoShort";
import ExpandableCollegeList from "../components/ExpandableCollegeList";
import {
  fetchMyColleges,
  addToMyColleges,
  deleteFromMyColleges,
} from "../utils/collegeUtils"; // Assuming you have a utility function to fetch colleges
import axios from "axios";

export function AddCollege() {
  const [collegeList, setCollegeList] = useState([]);
  const [results, setResults] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [alreadyAdded, setAlreadyAdded] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fmc = async () => {
      const colleges = await fetchMyColleges();
      setCollegeList(colleges);
    };
    fmc();
  }, []);

  const onSelectCollege = async (college) => {
    if (!college) {
      setSelectedCollege(null);
      return;
    }
    console.log("Selected college:", college); //college printed in console
    const response = await axios.get(
      `${apiUrl}/collegesearch/${college.unitId}`
    );
    if (response) {
      const flag = collegeList.some(
        (entry) => parseInt(entry.unitId) === college.unitId
      );
      console.log("isAlreadyAdded: ", flag);
      setAlreadyAdded(flag);

      setSelectedCollege(response.data); // set the college data object as the selected college.
    }
    setResults([]); //clear search results list
  };

  const addCollegeToList = async () => {
    if (selectedCollege) {
      const isAlreadyAdded = collegeList.some(
        (college) => parseInt(college.unitId) === selectedCollege.unitId
      );

      if (isAlreadyAdded) {
        alert(`${selectedCollege.collegeName} is already in your list.`);
        return;
      }
      addToMyColleges(selectedCollege);
      setCollegeList((prevList) => [...prevList, selectedCollege]);
      setSelectedCollege(null); //clears info box
    } else {
      alert("Please select a college from the search results first!");
    }
  };

  const deleteCollegeFromList = async (unitId, collegeName) => {
    console.log("Deleting college2:", unitId, collegeName);
    setCollegeList((prevList) =>
      prevList.filter((college) => String(college.unitId) !== String(unitId))
    );

    setSelectedCollege(null);
    deleteFromMyColleges(unitId, collegeName);
  };

  return (
    <div className="container text-center subject">
      <div className="row align-items-start">
        <div className="col-sm-8 num1 col-auto mb-5">
          <h2>Search for Colleges</h2>
          <div className="searchBarContainer">
            <SearchBar setResults={setResults} onSearch={onSelectCollege} />
            <SearchResultsList
              results={results}
              onSelectCollege={onSelectCollege}
            />
          </div>
          {selectedCollege && (
            <CollegeInfoShort
              selectedCollege={selectedCollege}
              addCollegeToList={() => addCollegeToList()}
              alreadyAdded={alreadyAdded}
            />
          )}
        </div>

        <div className="col-sm-4 num2 col-auto">
          <ExpandableCollegeList
            collegeList={collegeList}
            deleteCollegeFromList={deleteCollegeFromList}
            expandedFlag={false}
          />
        </div>
      </div>
    </div>
  );
}
