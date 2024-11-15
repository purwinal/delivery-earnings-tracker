import { useState, useReducer, useEffect, useRef } from 'react';
import { Routes, Route } from 'react-router-dom';
import styles from './App.module.css';
import Navigation from './components/Navigation.js';
import BottomInputArea from './components/BottomInputArea.js';
import DailyLog from './pages/DailyLog.js';
import Settings from './pages/Settings.js';
import DoNotDisturbOnOutlinedIcon from '@mui/icons-material/DoNotDisturbOnOutlined';
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded';

let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);

window.addEventListener('resize', () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
})


// Converts the dates into a common format
const formatDate = (year, month, day) =>
    `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

// Reducer function for creating the daily total objects
const earningsReducer = (myEarnings, action) => {
    switch (action.type) {
        case 'ADD_AMOUNT':
            const today = new Date();
            const formattedTime = today.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
            const formattedYear = today.getFullYear();
            const formattedMonth = today.getMonth();
            const formattedDate = today.getDate();

            return [...myEarnings, {
                id: Date.now(),
                fullDate: formatDate(formattedYear, formattedMonth, formattedDate),
                year: formattedYear,
                month: formattedMonth,
                date: formattedDate,
                time: formattedTime,
                amount: action.amountInput,
            }];
        case 'DELETE_AMOUNT':
            return myEarnings.filter(myEarning => myEarning.id !== action.id);
        default:
            return myEarnings;
    }
}

function App() {
    const [ amountInput, setAmountInput ] = useState();
    const [ isMenuOpen, setIsMenuOpen ] = useState(false);
    const [ isSettingsOpen, setIsSettingsOpen ] = useState(false);
    const [ isDailyLogOpen, setIsDailyLogOpen ] = useState(false);

// Saves "myEarnings" state into local storage
    const [ myEarnings, dispatch ] = useReducer(earningsReducer, [], () => {
        const localData = localStorage.getItem('MyEarningsLog');
        return localData ? JSON.parse(localData) : []
    });

    useEffect(() => {
        localStorage.setItem('MyEarningsLog', JSON.stringify(myEarnings))
    }, [myEarnings]);

// Saves "myGoals" state into local storage
    const [ myGoals, setMyGoals ] = useState(() => {
        return JSON.parse(localStorage.getItem('MyGoalsLog')) || []
    });

    useEffect(() => {
        localStorage.setItem('MyGoalsLog', JSON.stringify(myGoals))
    }, [myGoals])

// Saves "myDailyLog" state into local storage
    const [ myDailyLog, setMyDailyLog ] = useState(() => {
        return JSON.parse(localStorage.getItem('MyDailyLog')) || []
    });

    useEffect(() => {
        localStorage.setItem('MyDailyLog', JSON.stringify(myDailyLog))
    }, [myDailyLog])

// Saves "isLightThemeOn" state into local storage
    const [ isLightThemeOn, setIsLightThemeOn ] = useState(
        JSON.parse(localStorage.getItem('ThemeStatus')) || false
    );

    useEffect(() => {
        localStorage.setItem('ThemeStatus', JSON.stringify(isLightThemeOn));
    }, [isLightThemeOn]);

// Saves "goalInput" state into local storage
    const [ goalInput, setGoalInput ] = useState(() => {
        return JSON.parse(localStorage.getItem('MyGoalInput')) || []
    });

    useEffect(() => {
        localStorage.setItem('MyGoalInput', JSON.stringify(goalInput))
    }, [goalInput])

// Closes menu when clicking outside of it
    let menuRef = useRef();

    useEffect(() => {
        let handler = (e) => {
            if (!menuRef.current.contains(e.target)) {
                setIsMenuOpen(false);
                console.log(menuRef.current);
            }
        };

        document.addEventListener("mousedown", handler);

        return() => {
            document.removeEventListener("mousedown", handler);
        };
    });

// Helper function to convert "hh:mm AM/PM" to a Date object on a fixed date
    const parseTime = (timeString) => {
        const [time, modifier] = timeString.split(" ");
        let [hours, minutes] = time.split(":").map(Number);

        // Convert to 24-hour format
        if (modifier === "PM" && hours !== 12) hours += 12;
        if (modifier === "AM" && hours === 12) hours = 0;

        // Create a Date object on a fixed date with the parsed hours and minutes
        const date = new Date("1970-01-01T00:00:00");
        date.setHours(hours, minutes, 0, 0);
        return date;
    };

// Toggle functions
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const toggleTheme = () => {
        setIsLightThemeOn(!isLightThemeOn);
    };

    const toggleSettings = () => {
        setIsSettingsOpen(!isSettingsOpen);
    }

    const toggleDailyLog = () => {
        setIsDailyLogOpen(!isDailyLogOpen);
    }

// Handle functions
    const handleAddAmount = () => {
        if (amountInput !== '' && amountInput !== '0' && goalInput !== '' && goalInput !== '0') {
            dispatch({ type: 'ADD_AMOUNT', amountInput });
            setAmountInput('');
        }
    };

    const handleDeleteAmount = id => {
        dispatch({ type: 'DELETE_AMOUNT', id });
    };

    const handleEndRoute = () => {
        const today = new Date();
        const formattedTime = today.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

        const startTime = myEarnings[0].time; // Example: "11:30 PM"

        const startDateTime = parseTime(startTime);
        const endDateTime = parseTime(formattedTime);

        if (!startDateTime || !endDateTime) {
            console.error("Time parsing failed.");
            return;
        }

        // Check if endTime is earlier than startTime (indicating it crossed midnight)
        if (endDateTime < startDateTime) {
            endDateTime.setTime(endDateTime.getTime() + 24 * 60 * 60 * 1000);
        }

        // Calculate total time in milliseconds
        const timeDifference = endDateTime - startDateTime;

        // Convert milliseconds to hours and minutes
        const totalHours = Math.floor(timeDifference / (1000 * 60 * 60));
        const totalMinutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
        const totalTime = `${totalHours}h ${totalMinutes}m`;

        const newRoute = {
            id: myEarnings[0].id,
            fullDate: myEarnings[0].fullDate,
            year: myEarnings[0].year,
            month: myEarnings[0].month,
            date: myEarnings[0].date,
            startTime: startTime,
            endTime: formattedTime,
            totalTime: totalTime,
            goal: myGoals[0].goal,
            totalAmount: totalDailyEarnings,
        }
        const newRoutes = [ ...myDailyLog, newRoute ];
        setMyDailyLog(newRoutes);
        localStorage.removeItem('MyEarningsLog');
        window.location.reload();
    }

// Calculates the daily total: Converts all object values into numbers and then sums them all up
    const calculateTotalDailyEarnings = (arr) => {
        return arr
            .map(entry => {
                const num = Number(entry.amount);
                return isNaN(num) ? 0 : num;
            })
            .reduce((acc, current) => acc + current, 0);
    };

    const totalDailyEarnings = calculateTotalDailyEarnings(myEarnings).toFixed(2);

// Converts the goals from strings to numbers
    const convertStringsToNumbers = (goal) => {
            const num = Number(goal);
            return isNaN(num) ? 0 : num;
    }

    const currentGoal = convertStringsToNumbers(goalInput);

// Converts the currency format so that the "$" goes after the "-" sign when inputting negative numbers
    const formatCurrency = (value) => {
        const numericValue = parseFloat(value.replace(/[^0-9.-]/g, '')).toFixed(2);
        if (numericValue < 0) {
            return `-$${Math.abs(numericValue).toFixed(2)}`;
        }
        return `$${numericValue}`;
    }

// Conditional colors of the progress bar
    const progressBarColor = () => {
        switch (true) {
            case totalDailyEarnings < (0.2 * currentGoal):
                return "#909090";
            case totalDailyEarnings < (0.4 * currentGoal):
                return "#709182";
            case totalDailyEarnings < (0.6 * currentGoal):
                return "#469470";
            case totalDailyEarnings < (0.8 * currentGoal):
                return "#21945e";
            case totalDailyEarnings < currentGoal:
                return "#008d4b";
            case totalDailyEarnings >= currentGoal:
                return "#00c167";
            default:
                return "#008d4b";
        }
    };

  	return (
        <div className={styles.gridContainer}>
            <div className={`${styles.topSection} ${isMenuOpen ? styles.menuOpen : ""}`}>
                <h1 className={styles.progressTitle}>Today's Progress</h1>
                <div className={`${styles.progressBar} ${totalDailyEarnings >= currentGoal ? styles.completed : ''}`}>
                    <div className={styles.progressBarFill} style={{ width: `${totalDailyEarnings}%`, backgroundColor: progressBarColor() }}>
                        {totalDailyEarnings <= currentGoal ? Math.floor((totalDailyEarnings / currentGoal) * 100) : currentGoal}%
                    </div>
                </div>
                <div className={styles.progressBarTracker}>
                    <span className={`${styles.totalEarnings} ${totalDailyEarnings >= currentGoal && totalDailyEarnings > 0 ? styles.completed : ''}`}>
                        {formatCurrency(totalDailyEarnings)}
                    </span>
                    <span className={styles.divider}>
                        &nbsp;/&nbsp;
                    </span>
                    <span className={`${styles.currentGoal} ${totalDailyEarnings >= currentGoal && totalDailyEarnings > 0 ? styles.completed : ''}`}>
                        ${currentGoal}
                    </span>
                    {totalDailyEarnings >= currentGoal && totalDailyEarnings > 0 ? <div>&nbsp;<EmojiEventsRoundedIcon className={styles.trophyIcon} sx={{ fontSize: 40 }} /></div> : ''}
                </div>
            </div>
            <div className={`${styles.middleSection} ${isMenuOpen ? styles.menuOpen : ""}`}>
                <div className={styles.mappedGridHeadings}>
                    <div>TIME</div>
                    <div>AMOUNT</div>
                    <div>CANCEL</div>
                </div>
                <hr className={styles.divider} />
                {myEarnings.map((myEarning) => (
                    <div className={styles.mappedGridContainer} key={myEarning.id}>
                        <div>{myEarning.time}</div>
                        <div>{formatCurrency(myEarning.amount)}</div>
                        <div className={styles.deleteBtnContainer}>
                            <button
                                className={styles.amountDeleteBtn}
                                onClick={() => handleDeleteAmount(myEarning.id)}
                            >
                                <DoNotDisturbOnOutlinedIcon
                                    className={styles.cancelBtn}
                                    sx={{ fontSize: 30 }}
                                />
                            </button>
                        </div>
                    </div>
                ))}
                <hr className={styles.divider} />
            </div>
            <div className={`${styles.bottomSection} ${isMenuOpen ? styles.menuOpen : ""}`}>
                <Navigation
                    isMenuOpen={isMenuOpen}
                    toggleMenu={toggleMenu}
                    isSettingsOpen={isSettingsOpen}
                    toggleSettings={toggleSettings}
                    isDailyLogOpen={isDailyLogOpen}
                    toggleDailyLog={toggleDailyLog}
                    menuRef={menuRef}
                    handleEndRoute={handleEndRoute}
                    totalDailyEarnings={totalDailyEarnings}
                />
                <BottomInputArea
                    isMenuOpen={isMenuOpen}
                    amountInput={amountInput}
                    setAmountInput={setAmountInput}
                    goalInput={goalInput}
                    handleAddAmount={handleAddAmount}
                />
            </div>
            <Routes>
                <Route path="daily-log" element={<DailyLog
                    myDailyLog={myDailyLog}
                    setMyDailyLog={setMyDailyLog}
                    isDailyLogOpen={isDailyLogOpen}
                    toggleDailyLog={toggleDailyLog}
                    parseTime={parseTime}
                />} />
                <Route path="Settings" element={<Settings
                    myGoals={myGoals}
                    setMyGoals={setMyGoals}
                    goalInput={goalInput}
                    setGoalInput={setGoalInput}
                    isLightThemeOn={isLightThemeOn}
                    toggleTheme={toggleTheme}
                    isSettingsOpen={isSettingsOpen}
                    toggleSettings={toggleSettings}
                />} />
            </Routes>
        </div>
    );
}

export default App;
