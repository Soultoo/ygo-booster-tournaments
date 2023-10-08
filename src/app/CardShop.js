import React, { useState, useEffect } from 'react';
import { db, app } from './firebaseStuff';
import { useDocument, useCollection } from 'react-firebase-hooks/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, collection, updateDoc, setDoc, increment  } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const CardShop = () => {

  const RARITY_VALUES = {
    commons: 25,
    rares: 50,
    superRares: 150,
    ultraRares: 300,
    secretRares: 800,
    ultimateRares: 1500,
    ghostRares: 5000
};


  const auth = getAuth(app);
    const [user] = useAuthState(auth);

  const userRef = doc(db, 'users', user.uid);
  const [userSnapshot, loading, error] = useDocument(userRef);

  const moneyToSpend = userSnapshot?.data()?.money || 0;

    
    const [quantity, setQuantity] = useState(0);
    const [selectedBoosterCost, setSelectedBoosterCost] = useState(0);
    const [isButtonEnabled, setIsButtonEnabled] = useState(false);

    const [commons, setCommons] = useState(0);
    const [rares, setRares] = useState(0);
    const [superRares, setSuperRares] = useState(0);
    const [ultraRares, setUltraRares] = useState(0);
    const [secretRares, setSecretRares] = useState(0);
    const [ultimateRares, setUltimateRares] = useState(0);
    const [ghostRares, setGhostRares] = useState(0);

    const totalSum = selectedBoosterCost * quantity;
    const isExceedingMoney = totalSum > moneyToSpend;

    useEffect(() => {
        setIsButtonEnabled(totalSum <= moneyToSpend && totalSum > 0);
    }, [totalSum, moneyToSpend]);

    

    const boostersRef = collection(db, 'availableBoosters');
    const [boostersSnapshot, boostersLoading, boostersError] = useCollection(boostersRef);

    const incrementClick = () => setQuantity(prev => prev + 1);
    const decrementClick = () => setQuantity(prev => Math.max(prev - 1, 0));

    if (!user) {
        return <div>Please sign in to access the card shop.</div>;
    }

    

    if (loading || boostersLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    if (boostersError) return <div>Error loading boosters: {boostersError.message}</div>;

    
    const boosterNames = boostersSnapshot.docs.map(doc => doc.id);
    const sortedBoosters = boostersSnapshot?.docs.sort((a, b) => {
        return a.data().boosterNumber - b.data().boosterNumber;
    }) || [];

    


    const handleBoosterChange = (e) => {
    if (e.target.value === "default") {
        setSelectedBoosterCost(0);
        return;
    }

    const selectedBooster = sortedBoosters.find(doc => doc.id === e.target.value);
    setSelectedBoosterCost(selectedBooster.data().cost);
};

    const handleQuantityChange = (newValue) => {
        setQuantity(Math.max(0, newValue)); // Ensure quantity is 0 or positive
    };

    

    

    const handlePurchase = async () => {
        try {
            await updateDoc(userRef, {
                money: moneyToSpend - totalSum
            });
            
        } catch (error) {
            console.error("Error updating user's money:", error);
        }
    };

    const totalValue = commons * RARITY_VALUES.commons + rares * RARITY_VALUES.rares + superRares * RARITY_VALUES.superRares + 
    ultraRares * RARITY_VALUES.ultraRares + secretRares * RARITY_VALUES.secretRares +
    ultimateRares * RARITY_VALUES.ultimateRares + ghostRares * RARITY_VALUES.ghostRares;

    const sellDuplicates = async () => {
      console.log(totalValue);
    if (userSnapshot) {
        try {
            await updateDoc(userRef, {
                money: increment(totalValue),
                moneyAccrued: increment(totalValue)
            });
        } catch (error) {
            console.error("Error selling duplicates: ", error);
        }
    }
};


    return (
        <div>
          <h3>Köp boosters</h3>
            <div>
                <span style={{ color: isExceedingMoney ? 'red' : 'black' }}>Pengar att spendera: </span>
                <strong>{moneyToSpend}</strong>
            </div>
            <div>
                <select onChange={handleBoosterChange}>
                  <option value="default">Välj en booster</option>
                      {sortedBoosters.map(doc => (
                        <option key={doc.id} value={doc.id}>
                            {`${doc.id}: ${doc.data().cost}`}
                        </option>
                    ))}
                </select>
                <button onClick={decrementClick}>&lt;</button>
                <input 
                    type="number" 
                    value={quantity} 
                    onChange={(e) => setQuantity(Math.max(0, parseInt(e.target.value, 10)))} 
                />
                <button onClick={incrementClick}>&gt;</button>
                <span style={{ color: isExceedingMoney ? 'red' : 'black' }}>Summa: {totalSum}</span>
            </div>
            <div>
            <button 
                onClick={handlePurchase}
                disabled={!isButtonEnabled}
                className={`purchaseButton ${!isButtonEnabled ? 'disabled' : ''}`}
            >
                Betala för boosters
            </button>
            <hr /> {/* Horizontal Divider */}
            <h3>Sälj dubletter</h3>

            {createCardRarityField("Commons:", commons, setCommons, RARITY_VALUES.commons)}
{createCardRarityField("Rares:", rares, setRares, RARITY_VALUES.rares)}
{createCardRarityField("Super rares:", superRares, setSuperRares, RARITY_VALUES.superRares)}
{createCardRarityField("Ultra rares:", ultraRares, setUltraRares, RARITY_VALUES.ultraRares)}
{createCardRarityField("Secret rares:", secretRares, setSecretRares, RARITY_VALUES.secretRares)}
{createCardRarityField("Ultimate rares:", ultimateRares, setUltimateRares, RARITY_VALUES.ultimateRares)}
{createCardRarityField("Ghost rares:", ghostRares, setGhostRares, RARITY_VALUES.ghostRares)}

<div className="totalValue">
    Summa inlösta kort: <strong>{totalValue}</strong>
</div>
<button className="shopButton" onClick={sellDuplicates}>
                Sälj inskrivna dubletter
            </button>


        </div>
            
        </div>
    );
};

const createCardRarityField = (label, value, setter, rarityValue) => (
    <div className="rarityField">
        <span>{label}</span>
        <button onClick={() => setter(Math.max(0, value - 1))}>←</button>
        <input type="number" value={value} onChange={e => setter(Math.max(0, +e.target.value))} />
        <button onClick={() => setter(value + 1)}>→</button>
        <span> * {rarityValue}</span>
    </div>
);


export default CardShop;
