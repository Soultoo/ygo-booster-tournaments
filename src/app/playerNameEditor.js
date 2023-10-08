import { db } from './firebaseStuff';
import React, { useState } from 'react';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { getFirestore } from 'firebase/firestore';

function PlayerNameEditor() {
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const userRef = doc(db, 'users', currentUser.uid);

  // Fetch the user document using react-firebase-hooks
  const [userData, loading, error] = useDocumentData(userRef);
  const [playerName, setPlayerName] = useState('');

  // Function to handle player name change
  const handlePlayerNameChange = async () => {
    if (playerName) {
      try {
        await updateDoc(userRef, { playerName });
        console.log('Player name updated successfully!');
      } catch (err) {
        console.error('Error updating player name:', err);
      }
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const editorStyle = {
  position: 'fixed',
  bottom: '20px',     // You can adjust the pixel values as needed
  left: '20px',
  zIndex: 1000       // This is to ensure it's always on top of other elements
};


  return (
  <div style={editorStyle}>
    <input
      type="text"
      value={playerName}
      onChange={(e) => setPlayerName(e.target.value)}
      placeholder={userData ? userData.playerName : 'Enter player name'}
    />
    <button onClick={handlePlayerNameChange}>Update Player Name</button>
  </div>
);

}

export default PlayerNameEditor;



