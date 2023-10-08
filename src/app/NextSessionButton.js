import React, { useState } from 'react';
import { collection, getDocs, updateDoc, doc, writeBatch, increment, getDoc } from 'firebase/firestore';
import { db } from './firebaseStuff';

const NextSessionButton = () => {
    const [showModal, setShowModal] = useState(false);

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const batch = writeBatch(db);

    const handleContinue = async () => {
    try {
        const sessionRef = doc(db, 'state', 'currentSessionState');
        const globalRef = doc(db, 'state', 'global');
        
        const sessionSnap = await getDoc(sessionRef);

        const losers = sessionSnap.data().losersThisSession || [];
        const winners = sessionSnap.data().winnersThisSession || [];

        const batch = writeBatch(db);

        // For each loser, increment the losses field and add 500 to both moneyAccrued and money
        for (const loser of losers) {
            const userRef = doc(db, 'users', loser);
            batch.update(userRef, { 
                losses: increment(1), 
                moneyAccrued: increment(500), 
                money: increment(500) 
            });
        }

        // For each winner, increment the wins field and add 1000 to both moneyAccrued and money
        for (const winner of winners) {
            const userRef = doc(db, 'users', winner);
            batch.update(userRef, { 
                wins: increment(1), 
                moneyAccrued: increment(1000), 
                money: increment(1000) 
            });
        }

        const usersSnap = await getDocs(collection(db, 'users'));
        usersSnap.forEach(docSnap => {
            // If the user is neither a winner nor a loser, add 750 to both moneyAccrued and money
            if (!winners.includes(docSnap.id) && !losers.includes(docSnap.id)) {
                const userRef = doc(db, 'users', docSnap.id);
                batch.update(userRef, { 
                    moneyAccrued: increment(750),
                    money: increment(750)
                });
            }
        });
        

        // Clear the losersThisSession and winnersThisSession arrays in the currentSessionState document
        batch.update(sessionRef, {
            losersThisSession: [],
            winnersThisSession: []
        });

        // Increment the sessionsPlayed field in the global document by 1
        batch.update(globalRef, {
            sessionsPlayed: increment(1)
        });

        await batch.commit();

        closeModal();
    } catch (error) {
        console.error("Error updating users:", error);
    }
};

    return (
        <div>
            <button onClick={openModal}>Continue to next session</button>

            {showModal && (
    <div className="backdrop">
        <div className="modal">
            <p>Klickar du på continue här så fortsätter vi till nästa booster. Klicka inte här om du inte är 10000% säker på att vi ska vidare nu.</p>
            <div>
                <button onClick={closeModal}>Cancel</button>
                <button onClick={handleContinue}>Continue</button>
            </div>
        </div>
    </div>
)}
        </div>
    );
};

export default NextSessionButton;
