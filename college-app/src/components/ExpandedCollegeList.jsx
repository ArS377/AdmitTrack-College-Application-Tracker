import Dropdown2 from "./Dropdown2";
import { getUser } from "../User";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const ExpandedCollegeList = ({ collegeList, deleteCollegeFromList }) => {
  const navigate = useNavigate();
  const goToColleges = () => {
    navigate("/mycolleges");
  };
  return (
    <>
      <h2>My College List</h2>
      <button onClick={goToColleges}>Add More Colleges</button>
      <div className>
        {collegeList.length > 0 ? (
          collegeList.map((college) => (
            <li
              className="p-2 bg-light border d-flex align-items-center mb-2 flex-container"
              key={college._id}
            >
              <span>{college.collegeName}</span>
              <span>No Due Date</span>
              <span>0% Completed</span>

              <Dropdown2 />

              <button
                className="btn btn-outline-danger btn-sm ms-auto"
                onClick={() => {
                  console.log("Deleting college:", college);
                  deleteCollegeFromList(college._id, college.collegeName);
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
    </>
  );
};

export default ExpandedCollegeList;
