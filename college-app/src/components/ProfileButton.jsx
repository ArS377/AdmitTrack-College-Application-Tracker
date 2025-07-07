import { useNavigate } from "react-router-dom";

const ProfileButton = () => {
  const navigate = useNavigate();
  const goToMyProfile = () => {
    navigate("/profile");
  };

  return (
    <button className="btn btn-primary" onClick={goToMyProfile}>
      My Profile
    </button>
  );
};

export default ProfileButton;
