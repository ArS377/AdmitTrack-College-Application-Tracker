import { addToMyColleges } from "../utils/collegeUtils";
import { useState } from "react";
export default function AddThisCollege({ college, toggleRenderSwitch }) {
  const [collegeInMyList, setCollegeInMyList] = useState(false);
  console.log("AddThisCollege: ", JSON.stringify(college?.unitId));
  async function handleAddCollege(college) {
    setCollegeInMyList(true);
    const result = await addToMyColleges(college);
    result && toggleRenderSwitch();
    // TODO the parent component is not refreshing.
    // hence forcing a refresh
    location.reload();
  }
  return (
    <div>
      {collegeInMyList == false ? (
        <>
          <h4>
            You have not added this college to your list. If you would like to
            apply for this college and track the application status here, please
            add the college to your list of colleges
          </h4>
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => handleAddCollege(college)}
          >
            Add
          </button>
        </>
      ) : (
        <h4>Great! We added this college to your list.</h4>
      )}
    </div>
  );
}
