import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../utils/axiosConfig";
import "./NavBar.css";

function NavBar() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Home");

  const goToHome = () => { setActiveTab("Home"); navigate("/home"); };
  const goToAddCollege = () => { setActiveTab("Add College"); navigate("/addcollege"); };
  const goToResearch = () => { setActiveTab("Research"); navigate("/research"); };
  const goToMyProfile = () => { setActiveTab("Profile"); navigate("/profile"); };
  const handleSignOut = () => { logout(); navigate("/"); };

  return (
    <nav className="app-navbar">
      <span className="navbar-brand">
        College<span>App</span>
      </span>
      <ul className="navbar-nav">
        <li
          className={`nav-item ${activeTab === "Home" ? "active" : ""}`}
          onClick={goToHome}
        >
          Home
        </li>
        <li
          className={`nav-item ${activeTab === "Add College" ? "active" : ""}`}
          onClick={goToAddCollege}
        >
          Add College
        </li>
        <li
          className={`nav-item ${activeTab === "Research" ? "active" : ""}`}
          onClick={goToResearch}
        >
          Research
        </li>
        <li
          className={`nav-item ${activeTab === "Profile" ? "active" : ""}`}
          onClick={goToMyProfile}
        >
          Profile
        </li>
      </ul>
      <span className="nav-signout" onClick={handleSignOut}>
        Sign Out
      </span>
    </nav>
  );
}

export default NavBar;
