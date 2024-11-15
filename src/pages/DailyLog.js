import { useState } from 'react';
import CloseBtn from '../components/CloseBtn';
import Calendar from '../components/Calendar';
import AutoStoriesRoundedIcon from '@mui/icons-material/AutoStoriesRounded';

const DailyLog = ({
    myDailyLog,
    isDailyLogOpen,
    toggleDailyLog,
    parseTime
}) => {
    const [ currentDate, setCurrentDate ] = useState(new Date());
    const [ currentMonth, setCurrentMonth ] = useState(new Date().getMonth());
    const [ currentYear, setCurrentYear ] = useState(new Date().getFullYear());
    const [ focusedDay, setFocusedDay ] = useState(null);
    const [ selectedEvent, setSelectedEvent ] = useState(null);

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Helper to format dates as 'YYYY-MM-DD'
    const formatDate = (year, month, day) =>
        `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    // Function to check if a given date has an event
    const hasEvent = (day) => {
        const date = formatDate(currentYear, currentMonth, day);
        return myDailyLog.some(event => event.fullDate === date);
    };

    const handleCellClick = (day) => {
        setFocusedDay(day);
        const date = formatDate(currentYear, currentMonth, day);

        // Find all events for the selected date
        const eventsForDate = myDailyLog.filter(event => event.fullDate === date);

        if (eventsForDate.length > 0) {
            // Calculate the aggregate data for total time and total amount
            let totalMilliseconds = 0;
            const totalAmount = eventsForDate.reduce((acc, event) => {
                const start = parseTime(event.startTime);
                const end = parseTime(event.endTime);

                // Account for end time crossing midnight
                if (end < start) {
                    end.setTime(end.getTime() + 24 * 60 * 60 * 1000);
                }
                totalMilliseconds += (end - start);

                return acc + parseFloat(event.totalAmount);
            }, 0).toFixed(2);

            const totalHours = Math.floor(totalMilliseconds / (1000 * 60 * 60));
            const totalMinutes = Math.floor((totalMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
            const aggregatedTotalTime = `${totalHours}h ${totalMinutes}m`;

            // Set the aggregated data and individual events
            setSelectedEvent({
                fullDate: date,
                aggregatedTotalTime,
                aggregatedTotalAmount: totalAmount,
                events: eventsForDate
            });
        } else {
            setSelectedEvent(null);
        }
    };

    // Function to change the month and year
    const changeMonth = (offset) => {
        const newMonth = currentMonth + offset;
        if (newMonth < 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else if (newMonth > 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(newMonth);
        }
        setFocusedDay(null);
        setSelectedEvent(null);
    };

    return (
        <div className={`page-container ${isDailyLogOpen ? "open" : "closed"}`}>
            <section className="page-sections page-heading-section">
                <AutoStoriesRoundedIcon sx={{ fontSize: 70 }} />
                <h1 className="page-heading">DAILY LOG</h1>
            </section>
            <Calendar
                daysOfWeek={daysOfWeek}
                firstDayOfMonth={firstDayOfMonth}
                daysInMonth={daysInMonth}
                changeMonth={changeMonth}
                currentYear={currentYear}
                currentMonth={currentMonth}
                currentDate={currentDate}
                focusedDay={focusedDay}
                handleCellClick={handleCellClick}
                hasEvent={hasEvent}
                selectedEvent={selectedEvent}
                setSelectedEvent={setSelectedEvent}
            />
            <CloseBtn
                toggleFunction={() => {
                    toggleDailyLog();
                    setFocusedDay(null);
                    setSelectedEvent(null);
                }}
            />
        </div>
    );
}

export default DailyLog;