import React, { useEffect, useState } from "react";
import "./profile.css";
import axios from "axios";
import SATScoreInput from "../components/SATScoreInput.jsx";
import ACTScoreInput from "../components/ACTScoreInput.jsx";

export function Profile() {
  const [profileData, setProfileData] = useState({});
  const [profileUpdated, setProfileUpdated] = useState(false);
  const [isSATScoreInputOpen, setIsSATScoreInputOpen] = useState(false);
  const [isACTScoreInputOpen, setIsACTScoreInputOpen] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/users`);
        if (response && response.status === 200) {
          const data = response.data;
          data.sat = data.sat ?? [];
          data.act = data.act ?? [];
          setProfileData(data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchProfileData();
  }, []);

  const deleteSatScore = (testDate) => {
    const sat = profileData.sat?.filter((s) => s.testDate !== testDate);
    setProfileData({ ...profileData, sat });
    setProfileUpdated(true);
  };

  const deleteActScore = (testDate) => {
    const act = profileData.act?.filter((s) => s.testDate !== testDate);
    setProfileData({ ...profileData, act });
    setProfileUpdated(true);
  };

  const handleSaveSATScoreInput = (satScore) => {
    const sat = profileData.sat ? [...profileData.sat, satScore] : [satScore];
    setProfileData({ ...profileData, sat });
    setProfileUpdated(true);
    setIsSATScoreInputOpen(false);
  };

  const handleSaveACTScoreInput = (actScore) => {
    const act = profileData.act ? [...profileData.act, actScore] : [actScore];
    setProfileData({ ...profileData, act });
    setProfileUpdated(true);
    setIsACTScoreInputOpen(false);
  };

  const applyChanges = async () => {
    try {
      await axios.post(`${apiUrl}/profile`, profileData, {
        headers: { "Content-Type": "application/json" },
      });
      setProfileUpdated(false);
    } catch (error) {
      console.error("Updating profile: ", error);
    }
  };

  const InfoRow = ({ label, value }) => (
    <div style={{
      display: "flex",
      padding: "11px 0",
      borderBottom: "1px solid var(--grey-pale)",
    }}>
      <span style={{ width: "160px", color: "var(--grey-mid)", fontSize: "14px", flexShrink: 0 }}>
        {label}
      </span>
      <span style={{ color: "var(--grey-dark)", fontWeight: 500 }}>
        {value || <span style={{ color: "var(--grey-light)", fontStyle: "italic" }}>Not set</span>}
      </span>
    </div>
  );

  return (
    <div className="page-content">

      {/* Page header */}
      <div style={{ marginBottom: "28px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h2 style={{ margin: 0, color: "var(--maroon-dark)" }}>My Profile</h2>
          <p style={{ color: "var(--grey-mid)", marginTop: "4px" }}>
            Your academic profile and test scores.
          </p>
        </div>
        <button
          className="btn btn-primary"
          disabled={!profileUpdated}
          onClick={applyChanges}
          style={{ opacity: profileUpdated ? 1 : 0.45 }}
        >
          Save Changes
        </button>
      </div>

      {/* Primary Info card */}
      <div className="card" style={{ marginBottom: "20px" }}>
        <h3 className="section-title">Personal Information</h3>
        <InfoRow label="Full Name"     value={profileData.fullName} />
        <InfoRow label="Email"         value={profileData.email} />
        <InfoRow label="First Major"   value={profileData.firstMajor} />
        <InfoRow label="Second Major"  value={profileData.secondMajor} />
      </div>

      {/* SAT Scores card */}
      <div className="card" style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h3 className="section-title" style={{ margin: 0, border: 0, paddingBottom: 0 }}>SAT Scores</h3>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setIsSATScoreInputOpen(true)}
          >
            + Add Score
          </button>
        </div>

        {profileData.sat?.length > 0 ? (
          <table className="table" style={{ marginBottom: 0 }}>
            <thead>
              <tr>
                <th>Test Date</th>
                <th>English (EBRW)</th>
                <th>Math</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {profileData.sat.map((score) => (
                <tr key={score.testDate}>
                  <td>{score.testDate}</td>
                  <td>{score.english}</td>
                  <td>{score.math}</td>
                  <td style={{ fontWeight: 600, color: "var(--maroon)" }}>
                    {score.english && score.math ? score.english + score.math : "—"}
                  </td>
                  <td>
                    <button
                      className="btn btn-sm"
                      style={{ background: "none", border: "none", color: "var(--grey-mid)", cursor: "pointer" }}
                      onClick={() => deleteSatScore(score.testDate)}
                      title="Remove"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ color: "var(--grey-mid)", fontStyle: "italic", margin: 0 }}>
            No SAT scores added yet.
          </p>
        )}
      </div>

      {/* ACT Scores card */}
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h3 className="section-title" style={{ margin: 0, border: 0, paddingBottom: 0 }}>ACT Scores</h3>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setIsACTScoreInputOpen(true)}
          >
            + Add Score
          </button>
        </div>

        {profileData.act?.length > 0 ? (
          <table className="table" style={{ marginBottom: 0 }}>
            <thead>
              <tr>
                <th>Test Date</th>
                <th>Composite</th>
                <th>English</th>
                <th>Math</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {profileData.act.map((score) => (
                <tr key={score.testDate}>
                  <td>{score.testDate}</td>
                  <td style={{ fontWeight: 600, color: "var(--maroon)" }}>{score.composite}</td>
                  <td>{score.english}</td>
                  <td>{score.math}</td>
                  <td>
                    <button
                      className="btn btn-sm"
                      style={{ background: "none", border: "none", color: "var(--grey-mid)", cursor: "pointer" }}
                      onClick={() => deleteActScore(score.testDate)}
                      title="Remove"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ color: "var(--grey-mid)", fontStyle: "italic", margin: 0 }}>
            No ACT scores added yet.
          </p>
        )}
      </div>

      <SATScoreInput
        show={isSATScoreInputOpen}
        onClose={() => setIsSATScoreInputOpen(false)}
        onSave={handleSaveSATScoreInput}
      />
      <ACTScoreInput
        show={isACTScoreInputOpen}
        onClose={() => setIsACTScoreInputOpen(false)}
        onSave={handleSaveACTScoreInput}
      />
    </div>
  );
}
