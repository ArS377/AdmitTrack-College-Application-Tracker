import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../utils/axiosConfig";
import "./NavBar.css";

function NavBar() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Home");

  console.log("ActiveTab: ", activeTab);
  const goToHome = () => {
    setActiveTab("Home");
    navigate("/home");
  };

  const goToAddCollege = () => {
    setActiveTab("Add College");
    navigate("/addcollege");
  };

  const goToResearch = () => {
    setActiveTab("Research");
    navigate("/research");
  };

  const goToMyProfile = () => {
    setActiveTab("Profile");
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
              <li
                className={`nav-item nav-link ${
                  activeTab === "Home" ? "active" : ""
                }`}
                onClick={goToHome}
              >
                Home
              </li>
              <li
                className={`nav-item nav-link ${
                  activeTab === "Add College" ? "active" : ""
                }`}
                onClick={goToAddCollege}
              >
                Add College
              </li>
              <li
                className={`nav-item nav-link ${
                  activeTab === "Research" ? "active" : ""
                }`}
                onClick={goToResearch}
              >
                Research
              </li>
              <li
                className={`nav-item nav-link ${
                  activeTab === "Profile" ? "active" : ""
                }`}
                onClick={goToMyProfile}
              >
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
