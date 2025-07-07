import { useNavigate } from "react-router-dom";

const AddCollegeButton = () => {
  const navigate = useNavigate();
  const goToMyColleges = () => {
    navigate("/mycolleges");
  };

  return (
    <button className="btn btn-primary" onClick={goToMyColleges}>
      Add College
    </button>
  );
};

export default AddCollegeButton;
