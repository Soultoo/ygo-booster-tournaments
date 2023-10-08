import React from 'react';
import { db } from './firebaseStuff';
import { useDocument } from 'react-firebase-hooks/firestore';
import { updateDoc, doc } from 'firebase/firestore';

const NumberOfTeams = () => {
    const currentMatchStateRef = doc(db, 'state', 'currentMatchState');

    // Get the document and handle loading and error states
    const [value, loading, error] = useDocument(currentMatchStateRef);

    const increaseValue = async () => {
        if (value?.data().numberOfConcurrentMatches !== undefined) {
            const newValue = value.data().numberOfConcurrentMatches + 1;
            await updateDoc(currentMatchStateRef, {
                numberOfConcurrentMatches: newValue
            });
        }
    }

    const decreaseValue = async () => {
        if (value?.data().numberOfConcurrentMatches !== undefined && value.data().numberOfConcurrentMatches > 1) {
            const newValue = value.data().numberOfConcurrentMatches - 1;
            await updateDoc(currentMatchStateRef, {
                numberOfConcurrentMatches: newValue
            });
        }
    }

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <p>Number of teams:</p>
            <button onClick={decreaseValue}>&larr;</button>
            <div style={{ margin: '0 10px' }}>{value?.data().numberOfConcurrentMatches}</div>
            <button onClick={increaseValue}>&rarr;</button>
        </div>
    );
};

export default NumberOfTeams;
