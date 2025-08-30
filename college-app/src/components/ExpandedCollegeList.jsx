import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import CollegeCategory from "./CollegeCategory";
import { useNavigate } from "react-router-dom";
import { updateCollegeCategory } from "../utils/collegeUtils";

const ExpandedCollegeList = ({ collegeList, deleteCollegeFromList }) => {
  console.log("ExpandedCollegeList collegeList:", collegeList.length);
  const navigate = useNavigate();
  const goToCollegeInfo = (unitId) => {
    navigate("/collegeinfo", { state: { unitId: unitId, appStatus: true } });
  };
  const goToAddCollege = (college) => {
    navigate("/addcollege");
  };
  const changeCollegeCategory = async (college, newCategory) => {
    // TODO change college category in the database.
    console.log(`change ${college.collegeName} to ${newCategory}`);
  };
  return (
    <>
      <h2>My College List</h2>
      <br></br>

      {collegeList.length > 0 ? (
        <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col">UnitId</th>
              <th scope="col">College Name</th>
              <th scope="col">Due Date</th>
              <th scope="col">Progress</th>
              <th scope="col">Classification</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {collegeList.map((college) => (
              <tr key={college.unitId}>
                <td>{college.unitId}</td>
                <td
                  onClick={() => goToCollegeInfo(college.unitId)}
                  style={{ cursor: "pointer" }}
                >
                  {college.collegeName}
                </td>
                <td>{!college.appDueDate && <>No Due Date</>}</td>
                <td>{!college.appProgress && <>0</>}% Completed</td>
                <td>{<CollegeCategory college={college} />}</td>
                <td>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => {
                      console.log("Deleting college:", college);
                      deleteCollegeFromList(
                        college.unitId,
                        college.collegeName
                      );
                    }}
                  >
                    <FontAwesomeIcon icon={faTrashCan} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="mt-3">Search for colleges to add them to your list.</p>
      )}
      <button className="btn btn-primary" onClick={goToAddCollege}>
        Add More Colleges
      </button>
    </>
  );
};

export default ExpandedCollegeList;
