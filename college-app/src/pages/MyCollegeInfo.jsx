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
    if (!unitId) { navigate("/home"); return; }

    const fetchCollegeDetailById = async (unitId) => {
      try {
        const response = await axios.get(`${apiUrl}/collegesearch/${unitId}`);
        if (response.status === 200) setCollegeDetail(response.data);
      } catch (error) {
        console.error("Error fetching college details:", error);
      }
    };

    const fetchMyCollegeStatusById = async (unitId) => {
      try {
        const response = await axios.get(`${apiUrl}/mycolleges/${unitId}`, {
          params: { id: unitId },
        });
        if (response.status === 200) setMyCollegeStatus(response.data);
      } catch (error) {
        console.error("Failed to fetch college from MyCollegeList.");
      }
    };

    fetchCollegeDetailById(unitId);
    fetchMyCollegeStatusById(unitId);
  }, []);

  const handleAddCollege = async () => {
    await addToMyColleges(collegeDetail);
    setCollegeInMyList(true);
  };

  return (
    <div className="page-content">

      {/* Back link */}
      <button
        onClick={() => navigate(-1)}
        style={{
          background: "none",
          border: "none",
          color: "var(--maroon)",
          cursor: "pointer",
          padding: "0 0 16px 0",
          fontSize: "14px",
          fontWeight: 500,
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}
      >
        ← Back to College List
      </button>

      {/* College header card */}
      <div className="card" style={{ marginBottom: "20px" }}>
        <h2 style={{ margin: "0 0 6px 0", color: "var(--maroon-dark)" }}>
          {collegeDetail?.collegeName || "Loading…"}
        </h2>
        {collegeDetail?.info?.website && (
          <a
            href={collegeDetail.info.website}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: "14px", color: "var(--sandy)", wordBreak: "break-all" }}
          >
            {collegeDetail.info.website}
          </a>
        )}
        <div style={{ marginTop: "10px", fontSize: "13px", color: "var(--grey-mid)" }}>
          {collegeDetail?.info?.city && collegeDetail?.info?.state &&
            `${collegeDetail.info.city}, ${collegeDetail.info.state}`}
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: "flex",
        gap: "4px",
        marginBottom: "20px",
        borderBottom: "2px solid var(--sandy-light)",
        paddingBottom: "0",
      }}>
        {[
          { label: "Application Status", active: showAppStatus, onClick: () => setShowAppStatus(true) },
          { label: "College Data",       active: !showAppStatus, onClick: () => setShowAppStatus(false) },
        ].map(({ label, active, onClick }) => (
          <button
            key={label}
            onClick={onClick}
            style={{
              background: "none",
              border: "none",
              borderBottom: active ? "3px solid var(--maroon)" : "3px solid transparent",
              padding: "10px 20px",
              cursor: "pointer",
              fontWeight: active ? 600 : 400,
              color: active ? "var(--maroon)" : "var(--grey-mid)",
              fontSize: "15px",
              fontFamily: "var(--font)",
              transition: "color 0.15s ease",
              marginBottom: "-2px",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
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

    </div>
  );
}
