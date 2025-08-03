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
  const goToCollegeInfo = ({ college }) => {
    navigate("/collegeinfo", { state: college });
  };
  return (
    <>
      <h2>My College List</h2>
      <br></br>

      {collegeList.length > 0 ? (
        <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col">College Name</th>
              <th scope="col">Due Date</th>
              <th scope="col">Progress</th>
              <th scope="col">Classification</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {collegeList.map((college) => (
              <tr key={college._id}>
                <td
                  onClick={({ college }) => goToCollegeInfo({ college })}
                  style={{ cursor: "pointer" }}
                >
                  {college.collegeName}
                </td>
                <td>No Due Date</td>
                <td>0% Completed</td>
                <td>
                  <Dropdown2 />
                </td>
                <td>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => {
                      console.log("Deleting college:", college);
                      deleteCollegeFromList(college._id, college.collegeName);
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
      <button className="btn btn-primary" onClick={goToColleges}>
        Add More Colleges
      </button>
    </>
  );
};

export default ExpandedCollegeList;
