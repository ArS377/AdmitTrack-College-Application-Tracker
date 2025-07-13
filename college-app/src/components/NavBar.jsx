import { useNavigate } from "react-router-dom";
import { googleLogout } from "@react-oauth/google";

function NavBar() {
  const navigate = useNavigate();
  const handleSignOut = () => {
    /*
    if (window.gapi && window.gapi.auth2) {
      var auth2 = window.gapi.auth2.getAuthInstance();
      auth2
        .signOut()
        .then(function () {
          console.log("User signed out.");
        })
        .catch((error) => {
          console.error("Error signing out:", error);
        });
    } else {
      console.warn(
        "Google API client library (gapi) not loaded or initialized. Cannot sign out."
      );
    }
    */
    googleLogout();
    navigate("/login");
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
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
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
