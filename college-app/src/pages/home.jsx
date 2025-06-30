import React from 'react';
import {useNavigate} from 'react-router-dom'


const signOut = () => {
  if (window.gapi && window.gapi.auth2) {
    var auth2 = window.gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    }).catch(error => {
      console.error("Error signing out:", error);
    });
  } else {
    console.warn("Google API client library (gapi) not loaded or initialized. Cannot sign out.");
  }
};

const CollegeButton = () => {
  const navigate = useNavigate()
  const goToMyColleges = () => {
    navigate('/mycolleges')
  }

  return (
    <button className="button" onClick={goToMyColleges}>
    My Colleges
    </button>
  )
}

const ProfileButton = () => {
  const navigate = useNavigate()
  const goToMyProfile = () => {
    navigate('/profile')
  }

  return (
    <button className="button" onClick={goToMyProfile}>
    My Profile
    </button>
  )
}

export function Home() {
  return (
    <>
      <div>
        <h2>Welcome to the Home Page!</h2>
        <p>My Content</p>
        <div>
          <CollegeButton/>
        </div>
        <div>
        <br></br>
        </div>
        <div>
          <ProfileButton/>
        </div>
      </div>

      <div>
        <a href="#" onClick={signOut}>Sign out</a>
      </div>
    </>
  );
}