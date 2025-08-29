import FullCollegeDetail from "../components/FullCollegeDetail";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ApplicationStatus from "../components/ApplicationStatus";
import axios from "axios";

export function MyCollegeInfo() {
  const [appStatus, setAppStatus] = useState(true);
  const [myCollegeStatus, setMyCollegeStatus] = useState();
  const [collegeDetail, setCollegeDetail] = useState();
  const apiUrl = import.meta.env.VITE_API_URL;
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCollegeDetailById = async (collegeId) => {
      try {
        const response = await axios.get(
          `${apiUrl}/collegesearch/${collegeId}`
        );
        if (response.status === 200) {
          console.log("College details fetched successfully:", response.data);
          setCollegeDetail(response.data);
        } else {
          console.error("Failed to fetch college details:", response.data);
        }
      } catch (error) {
        console.error("Error fetching college details:", error);
      }
    };
    const fetchMyCollegeStatusById = async (collegeId) => {
      try {
        const response = await axios.get(`${apiUrl}/mycolleges/${collegeId}`, {
          params: { id: collegeId },
        });
        if (response.status === 200) {
          console.log(
            "College status fetched successfully:",
            JSON.stringify(response.data)
          );
          setMyCollegeStatus(response.data);
        } else {
          console.error("Failed to fetch college details:", response.data);
        }
      } catch (error) {
        console.error("Error fetching college details:", error);
      }
    };
    if (location.state?.collegeId) {
      fetchCollegeDetailById(location.state.collegeId);
      fetchMyCollegeStatusById(location.state.collegeId);
    }
  }, [location.state]);

  const handleAppStatus = () => {
    setAppStatus(true);
  };
  const handleCollegeData = () => {
    setAppStatus(false);
  };

  const handleBackToCollegeList = () => {
    navigate("/home");
  };

  return (
    <>
      <div>
        <div>
          <a onClick={handleBackToCollegeList} className="btn btn-link">
            Back to College List
          </a>
          <h2>{collegeDetail?.collegeName}</h2>
          <p>
            {collegeDetail?.info.website && (
              <a
                href={collegeDetail?.info.website}
                target="_blank"
                rel="noopener noreferrer"
              >
                {collegeDetail?.info.website}
              </a>
            )}
          </p>
        </div>
        <br />
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
      <br />
      <div>
        {appStatus ? (
          <ApplicationStatus college={myCollegeStatus} />
        ) : (
          <FullCollegeDetail college={collegeDetail} />
        )}
      </div>
    </>
  );
}
