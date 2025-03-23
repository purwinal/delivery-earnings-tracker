import styles from './Settings.module.css';
import CloseBtn from '../components/CloseBtn';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';

const Settings = ({
    isLightThemeOn,
    toggleTheme,
    isSettingsOpen,
    toggleSettings
}) => {

    return (
        <div className={`page-container ${isSettingsOpen ? "open" : "closed"}`}>
            <section className="page-sections page-heading-section">
                <TuneRoundedIcon sx={{ fontSize: 70 }} />
                <h1 className="page-heading">SETTINGS</h1>
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