import Dropdown from "./Dropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { updateCollegeCategory } from "../utils/collegeUtils";
import { useNavigate } from "react-router-dom";

const CollegeList = ({ collegeList, deleteCollegeFromList }) => {
  const navigate = useNavigate();
  const goToCollegeInfo = (college) => {
    navigate("/collegeinfo", { state: college });
  };
  return (
    <>
      <h2>My College List</h2>
      <div className="list-group">
        <div className="d-grid gap-3">
          {collegeList.length > 0 ? (
            collegeList.map((college) => (
              <li
                className="p-2 bg-light border d-flex align-items-center mb-2 flex-container"
                key={college.unitId}
                onClick={() => goToCollegeInfo(college)}
                style={{ cursor: "pointer" }}
              >
                <span>{college.collegeName}</span>

                <Dropdown
                  name="category"
                  selected={college.category}
                  options={["Dream", "Reach", "Target", "Safety"]}
                  onChange={updateCollegeCategory}
                />

                <button
                  className="btn btn-outline-danger btn-sm ms-auto"
                  onClick={() => {
                    console.log("Deleting college:", college);
                    deleteCollegeFromList(college.unitId, college.collegeName);
                  }}
                >
                  <FontAwesomeIcon icon={faTrashCan} />
                </button>
              </li>
            ))
          ) : (
            <p>Search for colleges to add them to your list.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default CollegeList;
