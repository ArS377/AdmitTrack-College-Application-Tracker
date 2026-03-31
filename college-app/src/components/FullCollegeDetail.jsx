import CollegeKeyStats from "./CollegeKeyStats";

const FullCollegeDetail = ({ isCollegeInMyList, collegeDetail, handleAddCollege }) => {
  if (!collegeDetail) return null;

  return (
    <div className="card">
      <h3 className="section-title">College Statistics</h3>
      <CollegeKeyStats selectedCollege={collegeDetail} />
      <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
        {!isCollegeInMyList && (
          <button className="btn btn-primary btn-sm" onClick={handleAddCollege}>
            + Add to My List
          </button>
        )}
        <button className="btn btn-secondary btn-sm">
          What are my chances?
        </button>
      </div>
    </div>
  );
};

export default FullCollegeDetail;
