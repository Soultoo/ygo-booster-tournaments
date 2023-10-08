import React, { useState, useEffect } from 'react';
import { useDocument } from 'react-firebase-hooks/firestore';
import { db } from './firebaseStuff';
import { doc, getDoc, arrayUnion, updateDoc, writeBatch } from 'firebase/firestore';

const SubmitMatchResults = () => {
  const currentMatchStateRef = doc(db, 'state', 'currentMatchState');
  const [value, loading, error] = useDocument(currentMatchStateRef);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [results, setResults] = useState({});
  const [playerNames, setPlayerNames] = useState({}); // NEW: To store player names

  useEffect(() => {
    if (value?.data()?.matchParticipants) {
      const fetchPlayerNames = async () => {
        const names = {};
        for (let playerId of value.data().matchParticipants) {
          const userDoc = await getDoc(doc(db, 'users', playerId));
          if (userDoc.exists()) {
            names[playerId] = userDoc.data().playerName;
          }
        }
        setPlayerNames(names);
      };
      fetchPlayerNames();
    }
  }, [value]);

  const handleSubmit = async () => {
        // Separate out winners and losers based on the 'results' state
        const winners = [];
        const losers = [];

        Object.keys(results).forEach(playerId => {
            if (results[playerId]) {
                winners.push(playerId);
            } else {
                losers.push(playerId);
            }
        });

    const sessionStateRef = doc(db, 'state', 'currentSessionState');
    const globalStateRef = doc(db, 'state', 'global');
    const currentMatchStateRef = doc(db, 'state', 'currentMatchState');

    

    try {
        // Use a batch to perform all updates atomically
        const batch = writeBatch(db);

        // Update winners and losers in currentSessionState document
        batch.update(sessionStateRef, {
            winnersThisSession: arrayUnion(...winners),
            losersThisSession: arrayUnion(...losers)
        });

        // Clear the matchParticipants array in currentMatchState document
        batch.update(currentMatchStateRef, {
            matchParticipants: []
        });

        // Set matchInProgress to false in global document
        batch.update(globalStateRef, {
            matchInProgress: false
        });

        // Commit the batch
        await batch.commit();

        closeModal(); // Close the modal after submitting
        } catch (error) {
            console.error("Error updating session state:", error);
        }
    };

  const openModal = () => {
    setIsModalOpen(true);
    const initialResults = {};
    value.data().matchParticipants.forEach(playerId => {
      initialResults[playerId] = false;
    });
    setResults(initialResults);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleToggleChange = (playerId, checked) => {
    setResults(prev => ({
      ...prev,
      [playerId]: checked
    }));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <button onClick={openModal}>Submit results</button>

      {isModalOpen && (
        <div className="backdrop" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Submit Match Results</h2>
            {value.data().matchParticipants.map(playerId => (
              <div key={playerId} className="playerResult">
                <span>{playerNames[playerId]}</span>
                <label>
                  Winner:
                  <input
                    type="checkbox"
                    checked={results[playerId]}
                    onChange={(e) => handleToggleChange(playerId, e.target.checked)}
                  />
                </label>
              </div>
            ))}
            <button onClick={closeModal}>Cancel</button>
            <button onClick={handleSubmit}>Submit</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmitMatchResults;
