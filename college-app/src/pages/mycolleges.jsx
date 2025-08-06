import { useState, useEffect } from "react";
import "./mycolleges.css";
import SearchBar from "../components/SearchBar";
import SearchResultsList from "../components/SearchResultsList";
import CollegeDetail from "../components/CollegeDetail";
import CollegeList from "../components/CollegeList";
import { fetchMyColleges } from "../utils/collegeUtils"; // Assuming you have a utility function to fetch colleges
import axios from "axios";

export function MyColleges() {
  const [collegeList, setCollegeList] = useState([]);
  const [results, setResults] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fmc = async () => {
      const colleges = await fetchMyColleges();
      setCollegeList(colleges);
    };
    fmc();
  }, []);

  const onSelectCollege = (college) => {
    console.log("Selected college:", college); //college printed in console
    setSelectedCollege(college);
    setResults([]); //clear search results list
  };

  const addCollegeToList = async () => {
    if (selectedCollege) {
      const isAlreadyAdded = collegeList.some(
        (college) => college.unitId === selectedCollege.unitId
      );

      if (isAlreadyAdded) {
        alert(`${selectedCollege.collegeName} is already in your list.`);
        return;
      }
      setCollegeList((prevList) => [...prevList, selectedCollege]);
      setSelectedCollege(null); //clears info box

      try {
        const response = await axios({
          method: "post",
          url: `${apiUrl}/mycolleges`,
          data: {
            collegeId: selectedCollege.unitId,
            collegeName: selectedCollege.collegeName,
          },
        });
        /*
        axios.post(`${apiUrl}/mycolleges`, {
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
    console.log("Deleting college2:", collegeId, collegeName);
    setCollegeList((prevList) =>
      prevList.filter(
        (college) => String(college.collegeId) !== String(collegeId)
      )
    );

    setSelectedCollege(null);

    try {
      console.log("Deleting college:", collegeId, collegeName);
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
            deleteCollegeFromList={deleteCollegeFromList}
          />
        </div>
      </div>
    </div>
  );
}
