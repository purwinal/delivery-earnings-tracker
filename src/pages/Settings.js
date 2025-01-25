import styles from './Settings.module.css';
import CloseBtn from '../components/CloseBtn';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';

const Settings = ({
    myGoals,
    setMyGoals,
    goalInput,
    setGoalInput,
    isLightThemeOn,
    toggleTheme,
    isSettingsOpen,
    toggleSettings
}) => {

    const handleInputChange = (e) => {
        let goal = e.target.value.replace(/[^0-9]/g, "");
        if (goal) {
            const formattedGoal = goal.slice(0, goal.length - 2) + "." + goal.slice(-2);
            setGoalInput(formattedGoal);
        } else {
            setGoalInput("");
        }
    };

    const handleSetGoal = (e) => {
        e.preventDefault();
        const newGoal = {
            id: Date.now(),
            goal: goalInput
        }
        const newGoals = [ ...myGoals, newGoal ];
        setMyGoals(newGoals)
    }

    return (
        <div className={`page-container ${isSettingsOpen ? "open" : "closed"}`}>
            <section className="page-sections page-heading-section">
                <TuneRoundedIcon sx={{ fontSize: 70 }} />
                <h1 className="page-heading">SETTINGS</h1>
            </section>
            <section className="page-sections">
                <h2 className="page-section-headings">My Goal</h2>
                <div className="flex-input-areas">
                    <input
                        type="number"
                        keyboardType="numeric"
                        className="goal-input"
                        placeholder="Enter amount..."
                        value={goalInput}
                        onChange={handleInputChange}
                        required
                    />
                    <button
                        className={styles.goalBtn}
                        onClick={handleSetGoal}
                    >
                        Set
                    </button>
                </div>
            </section>
            <section className="page-sections">
                <h2 className="page-section-headings">Theme</h2>
                <div className="flex-input-areas">
                    <h3 className={styles.themeTitle}>Light Mode</h3>
                    <div className={`${styles.themeBtn} ${isLightThemeOn ? styles.on : styles.off}`} onClick={toggleTheme}>
                        <div className={`${styles.themeBtnLeft} ${isLightThemeOn ? styles.on : styles.off}`}></div>
                        <div className={`${styles.themeBtnRight} ${isLightThemeOn ? styles.on : styles.off}`}></div>
                    </div>
                </div>
                <p>This feature will be implemented in a future update.</p>
            </section>
            <CloseBtn
                toggleFunction={toggleSettings}
            />
        </div>
    )
}

export default Settings;