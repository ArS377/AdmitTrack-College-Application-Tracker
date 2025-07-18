import Dropdown from "./Dropdown";
import { getUser } from "../User";

const CollegeList = ({ collegeList, deleteCollegeFromList }) => {
  return (
    <>
      <h2>My College List</h2>
      <div>
        {collegeList.length > 0 ? (
          collegeList.map((college) => (
            <div key={college._id}>
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
    </>
  );
};

export default CollegeList;
