import Dropdown2 from "./Dropdown2";
import { getUser } from "../User";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

const CollegeList = ({ collegeList, deleteCollegeFromList }) => {
  return (
    <>
      <h2>My College List</h2>
      <div className="list-group">
        <div className="d-grid gap-3">
          {collegeList.length > 0 ? (
            collegeList.map((college) => (
              <div
                className="p-2 bg-light border d-flex align-items-center mb-2 flex-container"
                key={college._id}
              >
                <span>{college.collegeName}</span>

                <Dropdown2 />

                <button
                  className="btn btn-outline-danger btn-sm ms-auto"
                  onClick={() =>
                    deleteCollegeFromList(college._id, getUser()?.email)
                  }
                >
                  <FontAwesomeIcon icon={faTrashCan} />
                </button>
              </div>
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
