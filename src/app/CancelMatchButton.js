import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from './firebaseStuff';
import ConfirmationModalCancelMatch from './ConfirmationModalCancelMatch';

const CancelMatchButton = () => {
    const [showModal, setShowModal] = useState(false);
    const globalStateRef = doc(db, 'state', 'global');

    const handleCancelClick = () => {
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
    };

    const handleModalConfirm = async () => {
        try {
            await updateDoc(globalStateRef, {
                matchInProgress: false
            });
            setShowModal(false);
        } catch (error) {
            console.error("Error updating matchInProgress:", error);
        }
    };

    return (
        <div>
            <button onClick={handleCancelClick}>
                Cancel Match
            </button>
            {showModal && 
                <ConfirmationModalCancelMatch 
                    onClose={handleModalClose} 
                    onConfirm={handleModalConfirm} 
                />
            }
        </div>
    );
};

export default CancelMatchButton;
