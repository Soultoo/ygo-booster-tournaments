import React from 'react';

const ConfirmationModalCancelMatch = ({ onClose, onConfirm }) => {
    return (
        <div className="modalBackdrop">
            <div className="modalContent">
                <p>Det här kommer avsluta matchen. Vill du avbryta?</p>
                <button onClick={onConfirm}>Yes, cancel</button>
                <button onClick={onClose}>No, continue this match</button>
            </div>
        </div>
    );
};

export default ConfirmationModalCancelMatch;

