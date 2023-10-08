import React from 'react';
import { db } from './firebaseStuff';
import { useCollection, useDocument } from 'react-firebase-hooks/firestore';
import { updateDoc, doc, collection, arrayUnion } from 'firebase/firestore';

const PossibleParticipants = () => {
    const usersRef = collection(db, 'users');
    const currentMatchStateRef = doc(db, 'state', 'currentMatchState');
    const currentSessionStateRef = doc(db, 'state', 'currentSessionState');

    const [userCollectionSnapshot, userLoading, userError] = useCollection(usersRef);
    const [matchStateSnapshot, matchLoading, matchError] = useDocument(currentMatchStateRef);
    const [sessionStateSnapshot, sessionLoading, sessionError] = useDocument(currentSessionStateRef);

    if (userLoading || matchLoading || sessionLoading) return <div>Loading...</div>;
    if (userError) return <div>Error: {userError.message}</div>;
    if (matchError) return <div>Error: {matchError.message}</div>;
    if (sessionError) return <div>Error: {sessionError.message}</div>;

    const currentParticipants = matchStateSnapshot?.data()?.matchParticipants || [];
    const losersThisSession = sessionStateSnapshot?.data()?.losersThisSession || [];
    const winnersThisSession = sessionStateSnapshot?.data()?.winnersThisSession || [];

    let usersWithId = [];
    if (!userLoading && userCollectionSnapshot) {
        usersWithId = userCollectionSnapshot.docs
            .filter(doc => 
                !currentParticipants.includes(doc.id) &&
                !losersThisSession.includes(doc.id) &&
                !winnersThisSession.includes(doc.id))
            .map(doc => ({
                uid: doc.id,
                ...doc.data()
            }));
    }

    usersWithId.sort((a, b) => b.moneyAccrued - a.moneyAccrued);

    const handleRowClick = async (uid) => {
        try {
            await updateDoc(currentMatchStateRef, {
                matchParticipants: arrayUnion(uid)
            });
        } catch (error) {
            console.error("Error adding participant:", error);
        }
    };

    return (
        <table className='possiblePBox'>
            <thead>
                <tr>
                    <th>Player</th>
                    <th>Accrued Money</th>
                </tr>
            </thead>
            <tbody >
                {usersWithId.map(user => (
                    <tr key={user.uid} onClick={() => handleRowClick(user.uid)} className="hoverableRow">
                        <td>{user.playerName}</td>
                        <td>{user.moneyAccrued}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default PossibleParticipants;
