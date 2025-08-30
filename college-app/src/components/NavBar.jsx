import { useNavigate } from "react-router-dom";
import { logout } from "../utils/axiosConfig";
import "./NavBar.css";

function NavBar() {
  const navigate = useNavigate();

  const goToHome = () => {
    navigate("/home");
  };

  const goToAddCollege = () => {
    navigate("/addcollege");
  };

  const goToResearch = () => {
    navigate("/research");
  };

  const goToMyProfile = () => {
    navigate("/profile");
  };

  const handleSignOut = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1">College App</span>
          <div className="" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item nav-link active" onClick={goToHome}>
                Home
              </li>
              <li className="nav-item nav-link" onClick={goToAddCollege}>
                Add College
              </li>
              <li className="nav-item nav-link" onClick={goToResearch}>
                Research
              </li>
              <li className="nav-item nav-link" onClick={goToMyProfile}>
                Profile
              </li>
              <li className="nav-item nav-link" onClick={handleSignOut}>
                Sign Out
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default NavBar;
