import CollegeKeyStats from "./CollegeKeyStats";

const FullCollegeDetail = ({
  collegeStatus,
  isCollegeInMyList,
  collegeDetail,
  handleAddCollege,
}) => {
  console.log("FullCollegeDetail: .....", collegeDetail);
  return (
    collegeDetail && (
      <div className="selected-college-details">
        <CollegeKeyStats selectedCollege={collegeDetail} />
        {!isCollegeInMyList && (
          <button className="addButton" onClick={handleAddCollege}>
            Add College
          </button>
        )}
        <button className="addButton">What are my chances?</button>
      </div>
    )
  );
};

export default FullCollegeDetail;
