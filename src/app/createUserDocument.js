import { db, app } from './firebaseStuff';
import { doc, setDoc, getDoc } from 'firebase/firestore';

async function createUserDocument(user) {
    const userRef = doc(db, "users", user.uid);

    const docSnapshot = await getDoc(userRef);
    if (!docSnapshot.exists()) {
        // Fetch sessionsPlayed from global document
        const globalRef = doc(db, "state", "global");
        const globalDocSnapshot = await getDoc(globalRef);
        let sessionsPlayed = 0;
        if (globalDocSnapshot.exists()) {
            sessionsPlayed = globalDocSnapshot.data().sessionsPlayed || 0;
        }

        // Calculate values for money and moneyAccrued
        const factor = 750 * sessionsPlayed;

        // The document doesn't exist, let's create it!
        await setDoc(userRef, {
            playerName: "",
            money: factor,
            moneyAccrued: factor,
            wins: 0,
            losses: 0
        });
    }
}

export default createUserDocument;
