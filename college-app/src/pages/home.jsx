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
      <div> {/* This div contains the welcome message */}
        <h2>Welcome to the Home Page!</h2>
        <p>This is where your main content will go.</p>
      </div>
      
      {/* Use React's onClick prop (camelCase) and pass the signOut function directly */}
      <a href="#" onClick={signOut}>Sign out</a>
      {/* The <script> tag is removed as JavaScript logic goes directly in the component */}
    </div>
  );
}