import FullCollegeDetail from "../components/FullCollegeDetail";
import { useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ApplicationStatus from "../components/ApplicationStatus";
import axios from "axios";

export function MyCollegeInfo() {
  const location = useLocation();
  const navigate = useNavigate();

  const [renderSwitch, setRenderSwitch] = useState(false);
  const [showAppStatus, setShowAppStatus] = useState(true);
  const [myCollegeStatus, setMyCollegeStatus] = useState();
  const [collegeDetail, setCollegeDetail] = useState();
  const apiUrl = import.meta.env.VITE_API_URL;

  useLayoutEffect(() => {
    const fetchCollegeDetailById = async (unitId) => {
      try {
        const response = await axios.get(`${apiUrl}/collegesearch/${unitId}`);
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
    const fetchMyCollegeStatusById = async (unitId) => {
      try {
        const response = await axios.get(`${apiUrl}/mycolleges/${unitId}`, {
          params: { id: unitId },
        });
        if (response.status === 200) {
          console.log(
            "College status fetched successfully:",
            JSON.stringify(response.data)
          );
          setMyCollegeStatus(response.data);
        } else {
          console.error(
            "Failed to fetch college from MyCollegeList:",
            response.data
          );
        }
      } catch (error) {
        console.error(
          "Failed to fetch college from MyCollegeList. May not be in the list."
        );
      }
    };
    if (location.state) {
      let { unitId, collegeInMyList } = location.state || {};
      setShowAppStatus(collegeInMyList);
      console.log("***MyCollegeInfo.location.state: ", location.state);
      fetchCollegeDetailById(unitId);
      fetchMyCollegeStatusById(unitId);
    } else {
      navigate("/home");
    }
  }, [location.state, renderSwitch]);

  const toggleRenderSwitch = () => {
    console.log("toggleRenderSwitch invoked");
    setRenderSwitch((prev) => !prev);
  };

  const handleAppStatus = () => {
    setShowAppStatus(true);
  };
  const handleCollegeData = () => {
    setShowAppStatus(false);
  };

  const handleBackToCollegeList = () => {
    navigate(-1, { replace: true });
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
              className={`nav-link ${showAppStatus ? "active" : ""}`}
              aria-current="page"
              onClick={handleAppStatus}
            >
              Application Status
            </a>
          </li>
          <li className="nav-item">
            <a
              className={`nav-link ${!showAppStatus ? "active" : ""}`}
              onClick={handleCollegeData}
            >
              College Data
            </a>
          </li>
        </ul>
      </div>
      <br />
      <div>
        {showAppStatus ? (
          <ApplicationStatus
            collegeStatus={myCollegeStatus}
            collegeDetail={collegeDetail}
            toggleRenderSwitch={toggleRenderSwitch}
          />
        ) : (
          <FullCollegeDetail
            collegeStatus={myCollegeStatus}
            collegeDetail={collegeDetail}
            toggleRenderSwitch={toggleRenderSwitch}
          />
        )}
      </div>
    </>
  );
}
