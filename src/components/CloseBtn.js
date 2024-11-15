import styles from './CloseBtn.module.css';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

const CloseBtn = (props) => {

    return (
        <div className={styles.closePageIconContainer}>
            <CloseRoundedIcon
                className={styles.closePageIcon}
                sx={{ fontSize: 80 }}
                onClick={props.toggleFunction}
            />
        </div>
    )
}

export default CloseBtn;