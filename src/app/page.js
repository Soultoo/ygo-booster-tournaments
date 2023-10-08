'use client'
import Head from 'next/head';

import { collection, query, where, doc  } from 'firebase/firestore';
import { useCollection, useDocument } from 'react-firebase-hooks/firestore';
import { db, app } from './firebaseStuff';
import { useState } from 'react';

import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';

import Login from './login';
import Register from './Register';
import LoginCheck from './LoginCheck';
import Logout from './Logout';
import PlayerNameEditor from './playerNameEditor';
import UserDataTable from './UserDataTable';
import PossibleParticipants from './PossibleParticipants';
import NumberOfTeams from './NumberOfTeams';
import ChosenPlayers from './ChosenPlayers';
import StartMatchButton from './StartMatchButton';
import CancelMatchButton from './CancelMatchButton';
import SubmitMatchResults from './SubmitMatchResults';
import NextSessionButton from './NextSessionButton';
import CardShop from './CardShop';

import createUserDocument from './createUserDocument';

import './globals.css';











export default function Home() {

  

  const [testThing, setTestThing] = useState(2);
  const docRef = doc(db, 'testCollection', 'testDocument');
  const [value, loading, error] = useDocument(docRef);

  const globalStateRef = doc(db, 'state', 'global');
  const [globalState, globalLoading, globalError] = useDocument(globalStateRef);

  const auth = getAuth(app);
  const [user, loadingUser, errorUser] = useAuthState(auth);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in
      createUserDocument(user);
    } else {
      // User is signed out
    }
});
  

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const testField1 = value?.data()?.testField1;
  
  return (
    <div>
      <div>
        <Head>
          <title>YGOTTP</title>
          <link 
            href="https://fonts.googleapis.com/css2?family=YourFontName&display=swap" 
            rel="stylesheet" 
          />
        </Head>
      </div>
      

      { user 
  ? 
    <div>
      <div className="blog-container">
      <Logout />
      <div className="mainContentContainer">
        <div className="componentStyle">
        <LoginCheck></LoginCheck>
        </div>
        <div className="componentStyle">
          <UserDataTable/>
        </div>
        <div className="componentStyle">
          <CardShop/>
        </div>
        { !globalLoading && globalState?.data()?.matchInProgress 
        ? 
        <div className="matchComponentsBox">
          <div className="componentStyle">
            <PossibleParticipants/>
          </div>
          <div >
          <NumberOfTeams/>
          </div>
          <div className="componentStyle">
          <ChosenPlayers/>
          </div>
          <div className="componentStyle">
          <CancelMatchButton/>
          <SubmitMatchResults/>
          </div>
        </div>
        : <div>
        <StartMatchButton />
        <div className="componentStyle">
          <NextSessionButton/>
        </div>
        </div>
        
      }
      
      </div>

      <PlayerNameEditor/>
      
      
      
    </div>
    </div>
  : 
    <div>
      <Login /> 
      <Register/> 
    </div> 
}

  <div className="bottom-bar"></div>
      
      
    </div>
  )
}
