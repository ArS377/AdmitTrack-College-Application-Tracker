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
} from "../utils/collegeUtils";
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
    if (!college) { setSelectedCollege(null); return; }
    const response = await axios.get(`${apiUrl}/collegesearch/${college.unitId}`);
    if (response) {
      setAlreadyAdded(collegeList.some(
        (entry) => parseInt(entry.unitId) === college.unitId
      ));
      setSelectedCollege(response.data);
    }
    setResults([]);
  };

  const addCollegeToList = async () => {
    if (!selectedCollege) {
      alert("Please select a college from the search results first!");
      return;
    }
    if (collegeList.some((c) => parseInt(c.unitId) === selectedCollege.unitId)) {
      alert(`${selectedCollege.collegeName} is already in your list.`);
      return;
    }
    addToMyColleges(selectedCollege);
    setCollegeList((prev) => [...prev, selectedCollege]);
    setSelectedCollege(null);
  };

  const deleteCollegeFromList = async (unitId, collegeName) => {
    setCollegeList((prev) =>
      prev.filter((college) => String(college.unitId) !== String(unitId))
    );
    setSelectedCollege(null);
    deleteFromMyColleges(unitId, collegeName);
  };

  return (
    <div className="page-content subject">
      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ margin: 0, color: "var(--maroon-dark)" }}>Add Colleges</h2>
        <p style={{ color: "var(--grey-mid)", marginTop: "4px" }}>
          Search for schools and add them to your list.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "24px", alignItems: "start" }}>

        {/* Left: search + selected college */}
        <div>
          <div className="card" style={{ marginBottom: "20px" }}>
            <h3 className="section-title">Search Colleges</h3>
            <div className="searchBarContainer">
              <SearchBar setResults={setResults} onSearch={onSelectCollege} />
              <SearchResultsList results={results} onSelectCollege={onSelectCollege} />
            </div>
          </div>

          {selectedCollege && (
            <div className="card">
              <CollegeInfoShort
                selectedCollege={selectedCollege}
                addCollegeToList={addCollegeToList}
                alreadyAdded={alreadyAdded}
              />
            </div>
          )}
        </div>

        {/* Right: my college list sidebar */}
        <div className="card">
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
