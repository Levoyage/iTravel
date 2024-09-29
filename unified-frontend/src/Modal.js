import React from 'react';
import './ProfilePage.css';

const Modal = ({ children, onClose }) => {
    return (
        <div className="custom-modal-backdrop">
            <div className="custom-modal-content">
                {children}
                <button onClick={onClose} className="custom-modal-close">Close</button>
            </div>
        </div>

    );
};

export default Modal;
