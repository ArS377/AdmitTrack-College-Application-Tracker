import { addToMyColleges } from "../utils/collegeUtils";
export default function AddThisCollege({ college, toggleRenderSwitch }) {
  console.log("AddThisCollege: ", JSON.stringify(college?.unitId));
  async function handleAddCollege(college) {
    const result = await addToMyColleges(college);
    result && toggleRenderSwitch();
    // TODO the parent component is not refreshing.
    // hence forcing a refresh
    location.reload();
  }
  return (
    <div>
      <h4>
        You have not added this college to your list. If you would like to apply
        for this college and track the application status here, please add the
        college to your list of colleges
      </h4>
      <button
        className="btn btn-sm btn-outline-primary"
        onClick={() => handleAddCollege(college)}
      >
        Add
      </button>
    </div>
  );
}
