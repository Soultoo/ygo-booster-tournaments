import React from 'react';
import { getAuth, signOut } from 'firebase/auth';
import app from './firebaseStuff';

function Logout() {
  const auth = getAuth(app);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Optionally, after logout you can redirect or inform the user
      console.log("User has been logged out!");
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  const logoutButtonStyle = {
    position: 'fixed',
    bottom: '20px',     // You can adjust the pixel values as needed
    right: '20px',
    zIndex: 1000       // This is to ensure it's always on top of other elements
};


  return (
    <button onClick={handleLogout} style={logoutButtonStyle}>
        Logout
    </button>
);

}

export default Logout;