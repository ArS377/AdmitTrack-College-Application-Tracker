import React, { useEffect, useState } from "react";
import "./profile.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Alert from "../components/Alert.jsx";
import SATScoreInput from "../components/SATScoreInput.jsx";
import ACTScoreInput from "../components/ACTScoreInput.jsx";

export function Profile() {
  const [alertState, setAlertState] = useState(false);
  const [profileData, setProfileData] = useState({});
  const [profileUpdated, setProfileUpdated] = useState(false);
  const [status, setStatus] = useState({ color: "", confirmationMessage: "" });
  const [isSATScoreInputOpen, setIsSATScoreInputOpen] = useState(false);
  const [isACTScoreInputOpen, setIsACTScoreInputOpen] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const initializeProfileData = () => {
      let tempData = {
        fullName: "Soma Ellappan",
        email: "soma.ellappan@gmail.com",
        firstMajor: "Computer Science",
        secondMajor: "Data Science",
        /*
      sat: [
        { testDate: "08/23/2025", english: 770, math: 800 },
        { testDate: "09/13/2025", english: 780, math: 800 },
      ],
      act: [
        { testDate: "08/23/2025", english: 770, math: 800 },
        { testDate: "09/13/2025", english: 780, math: 800 },
      ],
      */
      };

      return tempData;
    };

    const fetchProfileData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/users`);
        if (response && response.status === 200) {
          console.log("Profile data fetched successfully:");
          setProfileData(response.data);
        } else {
          console.error("Failed to fetch profile data:");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchProfileData();
    //let tempData = initializeProfileData();
    let tempData = { ...profileData };
    tempData.sat = tempData.sat ?? [];
    tempData.act = tempData.act ?? [];
    console.log(`temp data: ${tempData}`);
    setProfileData(tempData);
  }, []);

  const addSatScore = async () => {
    console.log("add Sat Score");
  };
  const deleteSatScore = async (testDate) => {
    console.log("delete Sat Score");
    console.log(`Before update: ${JSON.stringify(profileData)}`);
    const sat = profileData.sat?.filter(
      (testScore) => testScore.testDate != testDate
    );
    console.log(`After update: ${JSON.stringify({ ...profileData, sat })}`);
    setProfileData({ ...profileData, sat });
  };
  const addActScore = async () => {
    console.log("add Act Score");
  };
  const deleteActScore = async (testDate) => {
    console.log("delete Act Score");
    const act = profileData.act?.filter(
      (testScore) => testScore.testDate != testDate
    );
    console.log(`After update: ${JSON.stringify({ ...profileData, act })}`);
    setProfileData({ ...profileData, act });
  };
  const editPrimaryInfo = async (testData) => {
    console.log("edit primary info");
  };

  const handleOpenSATScoreInput = () => {
    setIsSATScoreInputOpen(true);
  };

  const handleCloseSATScoreInput = () => {
    setIsSATScoreInputOpen(false);
  };

  const handleSaveSATScoreInput = (satScore) => {
    console.log("new SAT score:", satScore);
    // You can process the data here, e.g., send it to an API
    if (profileData.sat) {
      setProfileData({ ...profileData, sat: [...profileData.sat, satScore] });
    } else {
      setProfileData({ ...profileData, sat: [satScore] });
    }
    setProfileUpdated(true);
    handleCloseSATScoreInput();
  };

  const handleOpenACTScoreInput = () => {
    setIsACTScoreInputOpen(true);
  };

  const handleCloseACTScoreInput = () => {
    setIsACTScoreInputOpen(false);
  };

  const handleSaveACTScoreInput = (actScore) => {
    console.log("new ACT score:", actScore);
    if (profileData.act) {
      setProfileData({ ...profileData, act: [...profileData.act, actScore] });
    } else {
      setProfileData({ ...profileData, act: [actScore] });
    }
    setProfileUpdated(true);
    // You can process the data here, e.g., send it to an API
    handleCloseACTScoreInput();
  };

  const applyChanges = async () => {
    console.log("Applying profile changes.");
    try {
      const response = await axios.post(`${apiUrl}/profile`, profileData, {
        headers: { "Content-Type": "application/json" },
      });
      setProfileUpdated(false);
    } catch (error) {
      console.error("Updating profile: ", error);
    }
  };

  return (
    <div>
      <div className="container">
        <div className="row mt-3">
          <button
            className="col-2 btn btn-primary"
            disabled={!profileUpdated}
            onClick={applyChanges}
          >
            Apply Changes
          </button>
        </div>
        <div className="row mt-5">
          <div className="col-2 fw-bold">Primary Info</div>
          <button className="col-1 btn btn-link" onClick={editPrimaryInfo}>
            Edit
          </button>
        </div>
        <div className="row">
          <div className="col-3">Full Name</div>
          <div className="col-3">{profileData.fullName ?? ""}</div>
        </div>
        <div className="row">
          <div className="col-3">Email</div>
          <div className="col-3">{profileData.email ?? ""}</div>
        </div>
        <div className="row">
          <div className="col-3">First Major</div>
          <div className="col-3">{profileData.firstMajor ?? ""}</div>
        </div>
        <div className="row">
          <div className="col-3">Second Major</div>
          <div className="col-3">{profileData.secondMajor ?? ""}</div>
        </div>
        <SATScoreInput
          show={isSATScoreInputOpen}
          onClose={handleCloseSATScoreInput}
          onSave={handleSaveSATScoreInput}
        />
        <ACTScoreInput
          show={isACTScoreInputOpen}
          onClose={handleCloseACTScoreInput}
          onSave={handleSaveACTScoreInput}
        />
        <div className="row mt-5">
          <div className="col-2 fw-bold">SAT Score</div>
          <button
            className="col-auto btn btn-outline-primary"
            onClick={handleOpenSATScoreInput}
          >
            ➕
          </button>
        </div>
        {profileData.sat?.map((testScore) => (
          <div key={testScore.testDate}>
            <div className="row mt-4">
              <div className="col-3 fw-bold">Test Date</div>
              <div className="col-2">{testScore.testDate}</div>
              <button
                className="col-auto btn btn-outline-danger"
                onClick={() => deleteSatScore(testScore.testDate)}
              >
                {" "}
                &#x2796;
              </button>
            </div>
            <div className="row">
              <div className="col-3">English</div>
              <div className="col-3">{testScore.english}</div>
            </div>
            <div className="row">
              <div className="col-3">Math</div>
              <div className="col-3">{testScore.math}</div>
            </div>
          </div>
        ))}
        <div className="row mt-5">
          <div className="col-2 fw-bold">ACT Score</div>
          <button
            className="col-auto btn btn-outline-primary"
            onClick={handleOpenACTScoreInput}
          >
            &#x2795;
          </button>
        </div>
        {profileData.act?.map((testScore) => (
          <div key={testScore.testDate}>
            <div className="row mt-4">
              <div className="col-3 fw-bold">Test Date</div>
              <div className="col-2">{testScore.testDate}</div>
              <button
                className="col-auto btn btn-outline-danger"
                onClick={() => deleteActScore(testScore.testDate)}
              >
                &#x2796;
              </button>
            </div>
            <div className="row">
              <div className="col-3">Composite</div>
              <div className="col-3">{testScore.composite}</div>
            </div>
            <div className="row">
              <div className="col-3">English</div>
              <div className="col-3">{testScore.english}</div>
            </div>
            <div className="row">
              <div className="col-3">Math</div>
              <div className="col-3">{testScore.math}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
