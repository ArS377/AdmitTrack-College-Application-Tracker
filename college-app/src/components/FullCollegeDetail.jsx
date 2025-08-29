import CollegeKeyStats from "./CollegeKeyStats";

const FullCollegeDetail = ({ college }) => {
  console.log("FullCollegeDetail: .....", college);
  return (
    college && (
      <div className="selected-college-details">
        <CollegeKeyStats selectedCollege={college} />
        <button className="addButton">What are my chances?</button>
      </div>
    )
  );
};

export default FullCollegeDetail;
