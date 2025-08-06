import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./NavBar.css";
import { setAccessToken } from "../User.jsx"; // Adjust the import path as necessary

function NavBar() {
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleSignOut = () => {
    axios.post(
      `${apiUrl}/auth/logout`,
      {},
      { headers: { "Content-Type": "application/json" } }
    );
    setAccessToken(undefined); // Clear the access token
    console.log("User signed out.");
    navigate("/");
  };
  const goToHome = () => {
    navigate("/home");
  };

  const goToAddCollege = () => {
    navigate("/mycolleges");
  };

  const goToMyProfile = () => {
    navigate("/profile");
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
