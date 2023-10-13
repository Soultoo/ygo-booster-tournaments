import React from 'react';
import { db } from './firebaseStuff';
import { useDocument } from 'react-firebase-hooks/firestore';
import { doc } from 'firebase/firestore';

const SessionDisplay = () => {
    // Reference to the 'global' document inside the 'state' collection
    const globalRef = doc(db, 'state', 'global');
    const [snapshot, loading, error] = useDocument(globalRef);

    let displayValue = 0; // Default value
    if (snapshot && snapshot.data()) {
        displayValue = snapshot.data().sessionsPlayed + 1;
    }

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <p><span>Nuvarande sessionsnummer: </span>{displayValue} </p>
    );
};

export default SessionDisplay;
