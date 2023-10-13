import React, { useState } from 'react';
import { db } from './firebaseStuff';
import { useCollection } from 'react-firebase-hooks/firestore';
import { doc, collection, setDoc } from 'firebase/firestore';

const BoosterAdder = () => {
    const [boosterName, setBoosterName] = useState('');
    const [boosterCost, setBoosterCost] = useState('');
    const [confirmationVisible, setConfirmationVisible] = useState(false);
    const [lastAddedBooster, setLastAddedBooster] = useState('');
    
    const boostersRef = collection(db, 'availableBoosters');
    const [snapshot, loading, error] = useCollection(boostersRef);

    const handleSubmit = async () => {
        if (boosterName && boosterCost) {
            // Calculate the highest boosterNumber
            let highestBoosterNumber = 0;
            snapshot.docs.forEach(doc => {
                const boosterNumber = doc.data().boosterNumber || 0;
                if (boosterNumber > highestBoosterNumber) {
                    highestBoosterNumber = boosterNumber;
                }
            });

            // Create a new document
            const newBoosterRef = doc(boostersRef, boosterName);
            try {
                await setDoc(newBoosterRef, {
                    cost: parseInt(boosterCost, 10),
                    boosterNumber: highestBoosterNumber + 1
                });

                setLastAddedBooster(boosterName);

                // Clear the input fields after successfully creating the document
                setBoosterName('');
                setBoosterCost('');

                // Show the confirmation text
                setConfirmationVisible(true);
                
                // Hide the confirmation text after 3 seconds (3000ms)
                setTimeout(() => {
                    setConfirmationVisible(false);
                }, 3000);
            } catch (err) {
                console.error('Error adding new booster:', err);
            }
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div>
            <p className="booster-heading">Lägg till ny booster:</p>
            <div>
                <span>Namn på boostern: </span>
                <input 
                    type="text" 
                    placeholder="Namn på boostern" 
                    value={boosterName} 
                    onChange={e => setBoosterName(e.target.value)}
                />
            </div>
            <div>
                <span>Kostnad för ny booster: </span>
                <input 
                    type="number" 
                    placeholder="Kostnad för ny booster" 
                    value={boosterCost}
                    onChange={e => setBoosterCost(e.target.value)}
                />
            </div>
            <button onClick={handleSubmit}>Skapa ny booster</button>
            {confirmationVisible && <p style={{color: 'green'}}>Lade till {lastAddedBooster}.</p>}
        </div>
    );
};

export default BoosterAdder;
