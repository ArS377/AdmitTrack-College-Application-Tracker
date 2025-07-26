import React, { useState, useEffect } from "react"; // <-- Keep useEffect
import "./profile.css";
import { getUser } from "../User.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ReturnButton = () => {
  const navigate = useNavigate();
  const goToMyHome = () => {
    navigate("/home");
  };
  return (
    <button className="btn btn-secondary" onClick={goToMyHome}>
      Cancel
    </button>
  );
};

export function Profile() {
  const getUserData = async (profileData) => {
    try {
      const user = await axios.get(`http://localhost:3000/api/users`);
      profileData.name = user.fullName;
      profileData.email = user.email;
      profileData.firstMajor = user.firstMajor || "";
      profileData.secondMajor = user.secondMajor || "";
      profileData.satEnglish = user.satEnglish || "";
      profileData.satMath = user.satMath || "";
      profileData.act = user.act || "";
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
  };

  const profileUpdateData = {
    name: null,
    email: null,
    firstMajor: null,
    secondMajor: null,
    satEnglish: null,
    satMath: null,
    act: null,
  };

  getUserData(profileUpdateData);

  const handleSubmit = async (e) => {
    //e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3000/api/profile",
        profileUpdateData,
        { headers: { "Content-Type": "application/json" } }
      );
      if (response.status === 200) {
        console.log("Profile data updated successfully:", response.data);
        alert("Your academic profile has been successfully updated!");
      } else {
        console.error("Failed to update profile:", response.data);
        alert(
          `Failed to update profile: ${
            response.data.message || "Please try again."
          }`
        );
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(
        "An error occurred while submitting. Please check your network connection."
      );
    }
  };

  return (
    <div>
      <h2>Your Profile</h2>
      <div>
        <form onSubmit={handleSubmit} className="update">
          <h3 className="label">Enter your primary choice of major.</h3>
          <div className="custom-field one">
            <input
              type="text"
              value={profileUpdateData.firstMajor}
              onChange={(e) => (profileUpdateData.firstMajor = e.target.value)}
              placeholder="e.g., Computer Science"
            />
          </div>

          <h3 className="label">Enter your secondary choice of major.</h3>
          <div className="custom-field one">
            <input
              type="text"
              value={profileUpdateData.secondMajor}
              onChange={(e) => (profileUpdateData.secondMajor = e.target.value)}
              placeholder="e.g., Math"
            />
          </div>

          <h3 className="label">
            Enter your SAT English Score (If Applicable).
          </h3>
          <div className="custom-field one">
            <input
              type="text"
              value={profileUpdateData.satEnglish}
              onChange={(e) => (profileUpdateData.satEnglish = e.target.value)}
              placeholder="e.g., 750"
            />
          </div>

          <h3 className="label">Enter your SAT Math Score (If Applicable).</h3>
          <div className="custom-field one">
            <input
              type="text"
              value={profileUpdateData.satMath}
              onChange={(e) => (profileUpdateData.satMath = e.target.value)}
              placeholder="e.g., 800"
            />
          </div>

          <h3 className="label">
            Enter your ACT Composite Score (If Applicable).
          </h3>
          <div className="custom-field one">
            <input
              type="text"
              value={profileUpdateData.act}
              onChange={(e) => (profileUpdateData.act = e.target.value)}
              placeholder="e.g., 36"
            />
          </div>
          <input
            type="submit"
            className="btn btn-primary"
            value="Update Profile"
          />
          <ReturnButton />
        </form>
      </div>
    </div>
  );
}
