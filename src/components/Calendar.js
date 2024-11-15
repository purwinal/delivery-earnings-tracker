import styles from './Calendar.module.css';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';

const Calendar = ({
    daysOfWeek,
    firstDayOfMonth,
    daysInMonth,
    changeMonth,
    currentYear,
    currentMonth,
    currentDate,
    focusedDay,
    handleCellClick,
    hasEvent,
    selectedEvent
}) => {
    return (
        <>
            <section className={`page-sections ${styles.calendarSection}`}>
                <div className={styles.calendarNavigationContainer}>
                    <button className={styles.calendarNavigationBtns} onClick={() => changeMonth(-1)}>
                        <ArrowBackIosRoundedIcon sx={{ fontSize: 30 }} />
                    </button>
                    <span className={styles.calendarNavigationDate}>
                        {new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' })} {currentYear}
                    </span>
                    <button className={styles.calendarNavigationBtns} onClick={() => changeMonth(1)}>
                        <ArrowForwardIosRoundedIcon sx={{ fontSize: 30 }} />
                    </button>
                </div>
                <div className={styles.calendarGridContainer}>
                    {daysOfWeek.map(day => (
                        <div className={styles.calendarWeekdayHeadings} key={day}>{day}</div>
                    ))}

                    {/* Empty cells for days before the first day of the month */}
                    {Array(firstDayOfMonth).fill(null).map((_, index) => (
                        <div key={`empty-${index}`} />
                    ))}

                    {/* Days of the month */}
                    {Array.from({ length: daysInMonth }, (_, day) => {
                        const isEvent = hasEvent(day + 1);

                        // Checks if the day is today
                        const isToday = currentDate.getFullYear() === currentYear &&
                                        currentDate.getMonth() === currentMonth &&
                                        currentDate.getDate() === day + 1;
                        const isFocused = focusedDay === day + 1;

                        return (
                            <div
                                key={day + 1}
                                className={`${styles.calendarCells} ${isToday ? styles.today : ''} ${isFocused ? styles.focused : ''}`}
                                tabIndex="0"
                                onClick={() => handleCellClick(day + 1)}
                            >
                                {day + 1}
                                {isEvent ? <div className={styles.calendarEventMark}></div> : ''}
                            </div>
                        );
                    })}
                </div>
            </section>
            <section className={`page-sections ${styles.eventDetailsSection}`}>
                {selectedEvent ? (
                    <div className={styles.eventContainer}>
                        <h2>
                            {new Date(selectedEvent.fullDate + 'T00:00:00').toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </h2>
                        <hr className={styles.divider} />
                        <section className={styles.eventInfo}>
                            <h3>Summary</h3>
                            <ul className={styles.eventList}>
                                <li className={styles.eventItems}>
                                    <span>Total Time:</span>
                                    <span>{selectedEvent.aggregatedTotalTime}</span>
                                </li>
                                <li className={styles.eventItems}>
                                    <span>Total Earnings:</span>
                                    <span>{selectedEvent.aggregatedTotalAmount}</span>
                                </li>
                            </ul>
                        </section>
                        <section className={styles.eventInfo}>
                            {selectedEvent.events.map((event, index) => (
                                <div key={index} className={styles.individualEventContainer}>
                                    <hr className={styles.divider} />
                                    <h3>Route #{index + 1}</h3>
                                    <ul className={styles.eventList}>
                                        <li className={styles.eventItems}>
                                            <span>Start Time:</span>
                                            <span>{event.startTime}</span>
                                        </li>
                                        <li className={styles.eventItems}>
                                            <span>End Time:</span>
                                            <span>{event.endTime}</span>
                                        </li>
                                        <li className={styles.eventItems}>
                                            <span>Route Time:</span>
                                            <span>{event.totalTime}</span>
                                        </li>
                                        <li className={styles.eventItems}>
                                            <span>Earnings:</span>
                                            <span>${event.totalAmount}</span>
                                        </li>
                                    </ul>
                                </div>
                            ))}
                        </section>
                    </div>
                ) : (
                    <p>No event selected</p>
                )}
            </section>
        </>
    )
}

export default Calendar;