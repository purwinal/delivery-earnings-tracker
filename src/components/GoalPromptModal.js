import { useState } from 'react';
import styles from './GoalPromptModal.module.css';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';

const GoalPromptModal = ({ isOpen, onClose, onSave }) => {
    const [goal, setGoal] = useState('');

    const handleInputChange = (e) => {
        setGoal(e.target.value);
    };

    const handleSave = () => {
        onSave(goal);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2 className={styles.heading}>To get started, please first enter a goal amount:</h2>
                <p className={styles.text}>(This can be changed in the Main Menu.)</p>
                <input
                    type="number"
                    inputMode="numeric"
                    value={goal}
                    onChange={handleInputChange}
                    placeholder="$0"
                    className={styles.goalInput}
                    required
                />
                <div className={styles.btnContainer}>
                    <button
                        type="button"
                        className={styles.saveBtn}
                        onClick={handleSave}
                    >
                        <CheckRoundedIcon className={styles.closeMenuIcon} sx={{ fontSize: 40 }} />
                    </button>
                    <button
                        type="button"
                        className={styles.closeBtn}
                        onClick={onClose}
                    >
                        <CloseRoundedIcon className={styles.closeMenuIcon} sx={{ fontSize: 40 }} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GoalPromptModal;