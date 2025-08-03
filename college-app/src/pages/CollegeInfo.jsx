import FullCollegeDetail from "../components/FullCollegeDetail";
import { useState } from "react";

export function CollegeInfo() {
  const [appStatus, setAppStatus] = useState(true);
  const handleAppStatus = () => {
    setAppStatus(true);
  };
  const handleCollegeData = () => {
    setAppStatus(false);
  };
  return (
    <>
      <div>
        <h2>College Information</h2>
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <a
              className={`nav-link ${appStatus ? "active" : ""}`}
              aria-current="page"
              onClick={handleAppStatus}
            >
              Application Status
            </a>
          </li>
          <li className="nav-item">
            <a
              className={`nav-link ${!appStatus ? "active" : ""}`}
              onClick={handleCollegeData}
            >
              College Data
            </a>
          </li>
        </ul>
      </div>
      <div>
        {appStatus ? (
          <div>
            <h3>Application Status</h3>
            <p>Your application is currently under review.</p>
          </div>
        ) : (
          <FullCollegeDetail selectedCollege={college} />
        )}
      </div>
    </>
  );
}
