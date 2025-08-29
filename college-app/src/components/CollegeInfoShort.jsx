import CollegeKeyStats from "./CollegeKeyStats";
export default function CollegeInfoShort({
  selectedCollege,
  alreadyAdded,
  addCollegeToList,
}) {
  //selectedCollege = null;
  return selectedCollege ? (
    <div className="container">
      <h3>{selectedCollege.collegeName}</h3>
      <p>
        Homepage:
        <a href={selectedCollege.info.website}>
          {selectedCollege.info.website}
        </a>
      </p>
      <CollegeKeyStats selectedCollege={selectedCollege} />
      {!alreadyAdded && (
        <button className="addButton" onClick={() => addCollegeToList()}>
          Add College
        </button>
      )}
      <button className="addButton">What are my chances?</button>
    </div>
  ) : (
    "College not selected"
  );
}
