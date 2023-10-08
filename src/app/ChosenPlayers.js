import React, { useState, useEffect } from 'react';
import { db } from './firebaseStuff';
import { useDocument } from 'react-firebase-hooks/firestore';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const ChosenPlayers = () => {
    const currentMatchStateRef = doc(db, 'state', 'currentMatchState');
    const [value, loading, error] = useDocument(currentMatchStateRef);
    const [playerData, setPlayerData] = useState([]);

    useEffect(() => {
      const fetchPlayerData = async (uids) => {
    const data = [];
    for (let uid of uids) {
        const userRef = doc(db, 'users', uid);
        const userData = await getDoc(userRef);
        if (userData.exists()) {
            data.push({
                uid: uid,
                name: userData.data().playerName,
                moneyAccrued: userData.data().moneyAccrued || 0
            });
        }
    }

    // Sorts in descending order based on moneyAccrued
    data.sort((a, b) => b.moneyAccrued - a.moneyAccrued);

    const zippedData = [];
    while (data.length) {
        if (data.length) zippedData.push(data.shift());
        if (data.length) zippedData.push(data.pop());
    }

    setPlayerData(zippedData);
};



        if (value?.data().matchParticipants) {
            fetchPlayerData(value.data().matchParticipants);
        }
    }, [value]);

    const handleNameClick = async (uidToRemove) => {
    try {
        const updatedParticipantsUIDs = value.data().matchParticipants.filter(uid => uid !== uidToRemove);
        const updatedParticipantsData = playerData.filter(data => data.uid !== uidToRemove);
        
        updatedParticipantsData.sort((a, b) => b.moneyAccrued - a.moneyAccrued);
        const zippedData = [];
        while (updatedParticipantsData.length) {
            if (updatedParticipantsData.length) zippedData.push(updatedParticipantsData.shift());
            if (updatedParticipantsData.length) zippedData.push(updatedParticipantsData.pop());
        }

        const sortedUIDs = zippedData.map(player => player.uid);

        await updateDoc(currentMatchStateRef, {
            matchParticipants: sortedUIDs
        });

        setPlayerData(zippedData);
    } catch (error) {
        console.error("Error removing participant:", error);
    }
};


    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    const numberOfBoxes = value.data().numberOfConcurrentMatches || 1;

    console.log("numberOfConcurrentMatches:", value.data().numberOfConcurrentMatches);


    // Helper function to chunk an array
    const chunkArray = (array, chunkSize) => {
        const chunks = [];
        for (let i = 0; i < array.length; i += chunkSize) {
            chunks.push(array.slice(i, i + chunkSize));
        }
        return chunks;
    };

    const playersChunks = chunkArray(playerData, 4);

    return (
    <div>
        {Array.from({ length: numberOfBoxes }).map((_, boxIndex) => (
            <div 
                key={boxIndex} 
                className="grayBox"
                style={{ backgroundColor: (!playersChunks[boxIndex] || playersChunks[boxIndex].length < 4) ? 'Gainsboro' : 'Chartreuse' }}
            >
                {playersChunks[boxIndex]?.map((data, playerIndex) => (
                    <React.Fragment key={data.uid}>
                        <p onClick={() => handleNameClick(data.uid)} className="playerName">
                            {data.name} - {data.moneyAccrued}
                        </p>
                        {playerIndex === 1 && <p className="vsText">VS</p>}
                    </React.Fragment>
                ))}
            </div>
        ))}
    </div>
);


};

export default ChosenPlayers;
