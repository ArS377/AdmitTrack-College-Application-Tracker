import FullCollegeDetail from "../components/FullCollegeDetail";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import ApplicationStatus from "../components/ApplicationStatus";

export function CollegeInfo() {
  const [appStatus, setAppStatus] = useState(true);
  const handleAppStatus = () => {
    setAppStatus(true);
  };
  const handleCollegeData = () => {
    setAppStatus(false);
  };
  const college = useLocation().state || {};
  console.log("College:", college);
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
          <ApplicationStatus college={college} />
        ) : (
          <FullCollegeDetail selectedCollege={college} />
        )}
      </div>
    </>
  );
}
