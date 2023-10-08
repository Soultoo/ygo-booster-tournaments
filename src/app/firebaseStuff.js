// utils/firebaseClient.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAoxFkpIp1bYuGq_kAQLcfFjKUYrha5LQ4",
  authDomain: "ygo-booster-tournament.firebaseapp.com",
  projectId: "ygo-booster-tournament",
  storageBucket: "ygo-booster-tournament.appspot.com",
  messagingSenderId: "460592324236",
  appId: "1:460592324236:web:77424247e2f3e06fcee5a9"
};

// Ensure no duplication of firebase app initialization
const app = initializeApp(firebaseConfig);
const db = getFirestore();

export { app, db };