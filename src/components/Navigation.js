import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Navigation.module.css';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import GoalPromptModal from './GoalPromptModal';

const Navigation = ({
    isMenuOpen,
    toggleMenu,
    isSettingsOpen,
    toggleSettings,
    isDailyLogOpen,
    toggleDailyLog,
    menuRef,
    handleEndRoute,
    totalDailyEarnings,
    goalInput,
    setGoalInput,
    myGoals,
    setMyGoals
}) => {

const [ isModalOpen, setIsModalOpen ] = useState(false);

    const handleInputChange = (e) => {
        let goal = e.target.value;
        setGoalInput(goal);
    };

    const handleSetGoal = (goal) => {
        const newGoal = {
            id: Date.now(),
            goal: goal
        }
        const newGoals = [ ...myGoals, newGoal ];
        setMyGoals(newGoals)
        setGoalInput(goal);
    }

    const checkAndPromptGoal = () => {
        if (!goalInput || parseInt(goalInput) === 0) {
            setIsModalOpen(true);
        }
    }

    useEffect(() => {
        checkAndPromptGoal();
    }, []);

    return (
        <>
            <GoalPromptModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={(goal) => handleSetGoal(parseInt(goal))}
            />
            <nav className={`${styles.navMenu} ${isMenuOpen ? styles.open : ""}`}>
                <button
                    className={styles.menuBtn}
                    type="button"
                    onClick={toggleMenu}
                >
                    {isMenuOpen
                        ? <CloseRoundedIcon className={styles.closeMenuIcon} sx={{ fontSize: 80 }} />
                        : <MenuRoundedIcon className={styles.openMenuIcon} sx={{ fontSize: 80 }} />
                    }
                </button>
                <ul
                    className={`${styles.navMenuUl}
                        ${isMenuOpen ? styles.open : styles.closed}
                        ${isSettingsOpen ? styles.pageOpen : styles.pageClosed}
                        ${isDailyLogOpen ? styles.pageOpen : styles.pageClosed}
                    `}
                    ref={menuRef}
                >
                    <li><NavLink className={styles.navItem} to="/daily-log" onClick={toggleDailyLog}>DAILY LOG</NavLink></li>
                    <li><NavLink className={styles.navItem} to="/settings" onClick={toggleSettings}>SETTINGS</NavLink></li>
                    <li className={styles.goalSection}>
                        CURRENT GOAL
                        <div className={styles.goalItems}>
                            <input
                                type="number"
                                inputMode="numeric"
                                className={styles.goalInput}
                                placeholder="$0"
                                value={goalInput}
                                onChange={handleInputChange}
                                onBlur={checkAndPromptGoal}
                                required
                            />
                            <button
                                className={styles.goalBtn}
                                type="button"
                                onClick={() => {
                                    checkAndPromptGoal();
                                    handleSetGoal(goalInput);
                                }}
                            >
                                <CheckRoundedIcon sx={{ fontSize: 40 }} />
                            </button>
                        </div>
                    </li>
                    <li className={styles.routeBtnListItem}>
                        <div className={styles.routeBtnContainer}>
                            {totalDailyEarnings > 0 ? (
                                <button
                                    className={styles.endRouteBtn}
                                    type="button"
                                    onClick={() => {
                                        checkAndPromptGoal();
                                        handleEndRoute();
                                    }}
                                >
                                    End Route
                                </button>
                            ) : (
                                <button
                                    className={`${styles.endRouteBtn} ${styles.disabled}`}
                                    type="button"
                                >
                                    End Route
                                </button>
                            )}
                        </div>
                    </li>
                </ul>
            </nav>
        </>
    )
}

export default Navigation;