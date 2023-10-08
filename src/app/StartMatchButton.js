import React from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from './firebaseStuff';

const StartMatchButton = () => {

  // Reference to the global document in the state collection
  const globalStateRef = doc(db, 'state', 'global');

  // Function to update matchInProgress to true
  const handleStartMatch = async () => {
    try {
      await updateDoc(globalStateRef, {
        matchInProgress: true
      });
      console.log('Match started successfully!');
    } catch (error) {
      console.error('Error starting the match:', error);
    }
  };

  return (
    <button className="startMatchButton" onClick={handleStartMatch}>
      Start Match
    </button>
  );

};

export default StartMatchButton;