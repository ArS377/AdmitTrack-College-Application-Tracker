import Dropdown from "./Dropdown";
import { getUser } from "../User";

const CollegeList = ({ collegeList, deleteCollegeFromList }) => {
  return (
    <>
      <h2>My College List</h2>
      <div className="list-group">
        <div class="d-grid gap-3">
          {collegeList.length > 0 ? (
            collegeList.map((college) => (
              <div className="p-2 bg-light border" key={college._id}>
                <p>
                  {college.collegeName}
                  <button
                    className="btn btn-danger"
                    onClick={() =>
                      deleteCollegeFromList(college._id, getUser()?.email)
                    }
                  >
                    X
                  </button>
                </p>
                <div className="dropdown-menu">
                  <Dropdown />
                </div>
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
