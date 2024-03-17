import styles from '/styles/register.module.css';

const RegistrationProcess = () => {
    return (
      <>
        <div className={styles.stepsContainer}>
            <div className={styles.visualization}>
                <div className={styles.step}>
                    <div className={styles.shapeBlue}>1</div>
                    <div className={styles.stepText}>Account Setup</div>
                </div>
                <div className={styles.line}></div>
                <div className={styles.step}>
                    <div className={styles.shapeCyan}>2</div>
                    <div className={styles.stepText}>Personal Details</div>
                </div>
                <div className={styles.line}></div>
                <div className={styles.step}>
                    <div className={styles.shapeBlue}>3</div>
                    <div className={styles.stepText}>Confirmation</div>
                </div>
            </div>
        </div>

      </>
    );
  }
   
export default RegistrationProcess;
