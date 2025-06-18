import React from 'react';

export function Home() {
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

  return (
    <div>
      <div>
        <h2>Welcome to the Home Page!</h2>
        <p>My Content</p>
      </div>
      <a href="#" onClick={signOut}>Sign out</a>
    </div>
  );
}