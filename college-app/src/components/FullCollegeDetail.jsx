import CollegeKeyStats from "./CollegeKeyStats";
import { useState, useEffect } from "react";
import { addToMyColleges } from "../utils/collegeUtils";
import { useNavigate } from "react-router-dom";

const FullCollegeDetail = ({
  collegeStatus,
  collegeDetail,
  toggleRenderSwitch,
}) => {
  const navigate = useNavigate();
  const [collegeInMyList, setCollegeInMyList] = useState(false);
  console.log("College in the list? ", collegeInMyList);

  const handleAddCollege = async () => {
    setCollegeInMyList(true);
    await addToMyColleges(collegeDetail);
    toggleRenderSwitch();
  };

  console.log("FullCollegeDetail: .....", collegeDetail);
  useEffect(() => {
    console.log(
      `FullCollegeDetail:UseEffect called: ${collegeInMyList}, ${collegeStatus?.unitId}`
    );
    if (collegeInMyList == false && collegeStatus?.unitId) {
      setCollegeInMyList(true);
    }
  }, [collegeDetail, collegeStatus, collegeInMyList]);
  return (
    collegeDetail && (
      <div className="selected-college-details">
        <CollegeKeyStats selectedCollege={collegeDetail} />
        {!collegeInMyList && (
          <button className="addButton" onClick={handleAddCollege}>
            Add College
          </button>
        )}
        <button className="addButton">What are my chances?</button>
      </div>
    )
  );
};

export default FullCollegeDetail;
