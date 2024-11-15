import styles from './BottomInputArea.module.css';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';

const BottomInputArea = ({
    isMenuOpen,
    amountInput,
    setAmountInput,
    goalInput,
    handleAddAmount
}) => {

    return (
        <div className={`${styles.bottomInputArea} ${isMenuOpen ? styles.menuOpen : ""}`}>
            <input
                type="number"
                keyboardType="numeric"
                className={styles.amountInput}
                placeholder="$0.00"
                value={amountInput}
                onChange={(e) => setAmountInput(e.target.value)}
                required
            />
            {amountInput < 0 || amountInput > 0 && amountInput !== 0 && goalInput > 0 ?
                <button
                    className={styles.enterBtn}
                    type="submit"
                    onClick={handleAddAmount}
                >
                    <CheckRoundedIcon sx={{ fontSize: 40 }} />
                </button>
            :
                <button
                    className={`${styles.enterBtn} ${styles.disabled}`}
                    type="button"
                >
                    <CheckRoundedIcon sx={{ fontSize: 40 }} />
                </button>
            }
        </div>
    )
}

export default BottomInputArea;