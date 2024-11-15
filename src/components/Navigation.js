import { NavLink } from 'react-router-dom';
import styles from './Navigation.module.css';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

const Navigation = ({
    isMenuOpen,
    toggleMenu,
    isSettingsOpen,
    toggleSettings,
    isDailyLogOpen,
    toggleDailyLog,
    menuRef,
    handleEndRoute,
    totalDailyEarnings
}) => {

    return (
        <nav className={`${styles.navMenu} ${isMenuOpen ? styles.open : ""}`}>
            <button className={styles.menuBtn} onClick={toggleMenu}>
                {isMenuOpen
                    ? <CloseRoundedIcon className={styles.closeMenuIcon} sx={{ fontSize: 80 }} />
                    : <MenuRoundedIcon className={styles.openMenuIcon} sx={{ fontSize: 80 }} />
                }
            </button>
            <ul className={`${styles.navMenuUl}
                ${isMenuOpen ? styles.open : styles.closed}
                ${isSettingsOpen ? styles.settingsOpen : styles.settingsClosed}
                ${isDailyLogOpen ? styles.dailyLogOpen : styles.dailyLogClosed}`}
                ref={menuRef}
            >
                <li><NavLink className={styles.navItem} to="/daily-log" onClick={toggleDailyLog}>DAILY LOG</NavLink></li>
                <li><NavLink className={styles.navItem} to="/settings" onClick={toggleSettings}>SETTINGS</NavLink></li>
                <li className={styles.routeBtnListItem}>
                    <div className={styles.routeBtnContainer}>
                        {totalDailyEarnings > 0 ? (
                            <button
                                className={styles.endRouteBtn}
                                onClick={handleEndRoute}
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
    )
}

export default Navigation;