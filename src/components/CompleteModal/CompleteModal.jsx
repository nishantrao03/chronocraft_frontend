import React from 'react';
import styles from './CompleteModal.module.css'; // Add your own styles

const CompleteModal = ({ show, title, modalType, message, onConfirm, onCancel }) => {
    if (!show) return null; // Don't render if not visible

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2>{title}</h2>
                <p>{message}</p>
                <div className={styles.modalActions}>
                    {modalType === 'error' ? (
                        <button onClick={onCancel}>OK</button> // Show only OK for error
                    ) : (
                        <>
                            <button onClick={onConfirm}>Yes</button>
                            <button onClick={onCancel}>Cancel</button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CompleteModal;
