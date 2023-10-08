import { db, app } from './firebaseStuff';
import { doc, setDoc, getDoc } from 'firebase/firestore';

async function createUserDocument(user) {
    const userRef = doc(db, "users", user.uid);

    const docSnapshot = await getDoc(userRef);
    if (!docSnapshot.exists()) {
        // The document doesn't exist, let's create it!
        await setDoc(userRef, {
            playerName: "",
            money: 0,
            moneyAccrued: 0,
            wins: 0,
            losses: 0
        });
    }
}

export default createUserDocument;