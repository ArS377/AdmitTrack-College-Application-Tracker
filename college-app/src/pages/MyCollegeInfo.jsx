import FullCollegeDetail from "../components/FullCollegeDetail";
import { useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ApplicationStatus from "../components/ApplicationStatus";
import { addToMyColleges } from "../utils/collegeUtils";
import axios from "axios";

export function MyCollegeInfo() {
  const location = useLocation();
  const navigate = useNavigate();

  const [showAppStatus, setShowAppStatus] = useState(
    location.state?.showAppStatus || true
  );
  const [collegeInMyList, setCollegeInMyList] = useState(
    location.state?.isCollegeInMyList || false
  );

  const [myCollegeStatus, setMyCollegeStatus] = useState();
  const [collegeDetail, setCollegeDetail] = useState();
  const apiUrl = import.meta.env.VITE_API_URL;
  const unitId = location.state?.unitId;
  useLayoutEffect(() => {
    if (!unitId) {
      navigate("/home");
      return;
    }
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
    fetchCollegeDetailById(unitId);
    fetchMyCollegeStatusById(unitId);
  }, []);

  const handleAppStatus = () => {
    setShowAppStatus(true);
  };
  const handleCollegeData = () => {
    setShowAppStatus(false);
  };

  const handleAddCollege = async () => {
    await addToMyColleges(collegeDetail);
    setCollegeInMyList(true);
    //toggleRenderSwitch();
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
            isCollegeInMyList={collegeInMyList}
            collegeDetail={collegeDetail}
            handleAddCollege={handleAddCollege}
          />
        ) : (
          <FullCollegeDetail
            collegeStatus={myCollegeStatus}
            isCollegeInMyList={collegeInMyList}
            collegeDetail={collegeDetail}
            handleAddCollege={handleAddCollege}
          />
        )}
      </div>
    </>
  );
}
