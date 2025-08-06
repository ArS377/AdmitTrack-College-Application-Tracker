import React, { useEffect, useState } from "react";
import "./profile.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Alert from "../components/Alert.jsx";

export function Profile() {
  const [alertState, setAlertState] = useState(false);
  const [profileData, setProfileData] = useState({});
  const [status, setStatus] = useState({ color: "", confirmationMessage: "" });
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        let profileData = {
          name: "",
          email: "",
          firstMajor: "",
          secondMajor: "",
          satEnglish: "",
          satMath: "",
          act: "",
        };
        const response = await axios.get(`${apiUrl}/users`);
        if (response.status !== 200) {
          throw new Error("Failed to fetch profile data");
        }
        console.log("Profile data fetched successfully:");
        const user = response.data;
        profileData.name = user.fullName ?? "";
        profileData.email = user.email ?? "";
        profileData.firstMajor = user.firstMajor ?? "";
        profileData.secondMajor = user.secondMajor ?? "";
        profileData.satEnglish = user.satEnglish ?? "";
        profileData.satMath = user.satMath ?? "";
        profileData.act = user.act ?? "";
        console.log(profileData);
        setProfileData(profileData); // Update state with fetched data
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchProfileData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${apiUrl}/profile`, profileData, {
        headers: { "Content-Type": "application/json" },
      });
      setAlertState(true);
      if (response.status === 200) {
        console.log("Profile data updated successfully:", response.data);
        setStatus((prevStatus) => ({
          ...prevStatus, // Keep existing properties (like confirmationMessage)
          color: "success", // Set the color property to the string "success"
          confirmationMessage: "Profile updated successfully!",
        }));
      } else {
        console.error("Failed to update profile:", response.data);
        setStatus((prevStatus) => ({
          ...prevStatus, // Keep existing properties (like confirmationMessage)
          color: "danger", // Set the color property to the string "success"
          confirmationMessage: "Failed to update profile",
        }));
      }
    } catch (error) {
      console.error("Error submitting form:", error);

      setStatus((prevStatus) => ({
        ...prevStatus, // Keep existing properties (like confirmationMessage)
        color: "danger", // Set the color property to the string "success"
        confirmationMessage: "Failed to update profile",
      }));
    }
  };

  return (
    <div>
      <h2>Your Profile</h2>
      {alertState && (
        <Alert
          confirmationMessage={status.confirmationMessage}
          status={status.color}
        />
      )}
      <div>
        <form onSubmit={handleSubmit} className="update">
          <h3 className="label">Enter your primary choice of major.</h3>
          <div className="custom-field one">
            <input
              type="text"
              value={profileData.firstMajor ?? ""}
              onChange={(e) =>
                setProfileData({ ...profileData, firstMajor: e.target.value })
              }
              placeholder="e.g., Computer Science"
            />
          </div>

          <h3 className="label">Enter your secondary choice of major.</h3>
          <div className="custom-field one">
            <input
              type="text"
              value={profileData.secondMajor ?? ""}
              onChange={(e) =>
                setProfileData({ ...profileData, secondMajor: e.target.value })
              }
              placeholder="e.g., Math"
            />
          </div>

          <h3 className="label">
            Enter your SAT English Score (If Applicable).
          </h3>
          <div className="custom-field one">
            <input
              type="text"
              value={profileData.satEnglish ?? ""}
              onChange={(e) =>
                setProfileData({ ...profileData, satEnglish: e.target.value })
              }
              placeholder="e.g., 750"
            />
          </div>

          <h3 className="label">Enter your SAT Math Score (If Applicable).</h3>
          <div className="custom-field one">
            <input
              type="text"
              value={profileData.satMath ?? ""}
              onChange={(e) =>
                setProfileData({ ...profileData, satMath: e.target.value })
              }
              placeholder="e.g., 800"
            />
          </div>

          <h3 className="label">
            Enter your ACT Composite Score (If Applicable).
          </h3>
          <div className="custom-field one">
            <input
              type="text"
              value={profileData.act ?? ""}
              onChange={(e) =>
                setProfileData({ ...profileData, act: e.target.value })
              }
              placeholder="e.g., 36"
            />
          </div>
          <input
            type="submit"
            className="btn btn-primary"
            value="Update Profile"
          />
        </form>
      </div>
    </div>
  );
}
