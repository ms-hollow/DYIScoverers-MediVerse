import styles from '/styles/register.module.css';

/**Parameters are the colors you want the each page to be. ide-define sila sa register page. */
const RegistrationProcess = ({ firstShapeColor, secondShapeColor, thirdShapeColor }) => {
    return (
      <>
        <div className={styles.stepsContainer}>
            <div className={styles.visualization}>
                <div className={styles.step}>
                    <div className={`${styles.shape} ${styles[firstShapeColor]}`}>1</div>
                    <div className={styles.stepText}>Account Setup</div>
                </div>
                <div className={styles.line}></div>
                <div className={styles.step}>
                    <div className={`${styles.shape} ${styles[secondShapeColor]}`}>2</div>
                    <div className={styles.stepText}>Personal Details</div>
                </div>
                <div className={styles.line}></div>
                <div className={styles.step}>
                    <div className={`${styles.shape} ${styles[thirdShapeColor]}`}>3</div>
                    <div className={styles.stepText}>Confirmation</div>
                </div>
            </div>
        </div>
      </>
    );
}

export default RegistrationProcess;