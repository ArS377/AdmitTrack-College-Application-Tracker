import ExpandableCollegeList from "../components/ExpandableCollegeList";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchMyColleges, deleteFromMyColleges } from "../utils/collegeUtils"; // Assuming you have a utility function to fetch colleges

export function Home() {
  const [collegeList, setCollegeList] = useState([]);
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const fmc = async () => {
      const colleges = await fetchMyColleges();
      setCollegeList(colleges);
    };
    fmc();
  }, []);

  const deleteCollegeFromList = async (unitId, collegeName) => {
    console.log("Deleting college2:", unitId, collegeName);
    setCollegeList((prevList) =>
      prevList.filter((college) => String(college.unitId) !== String(unitId))
    );
    deleteFromMyColleges(unitId, collegeName);
  };
  const goToAddCollege = (college) => {
    navigate("/addcollege");
  };

  return (
    <>
      <div>
        <h2>Welcome!</h2>
        <div>
          <ExpandableCollegeList
            collegeList={collegeList}
            deleteCollegeFromList={deleteCollegeFromList}
            expandedFlag="true"
          />
        </div>
        <button className="btn btn-primary" onClick={goToAddCollege}>
          Add More Colleges
        </button>
      </div>
    </>
  );
}
