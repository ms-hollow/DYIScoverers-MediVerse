import Link from 'next/link';
import Image from 'next/image';
import styles from '/styles/logInPatientHeader.module.css';

const LogInPatientHeader = () => {
  return (
    <>
      <header className={styles.header}>
        <div className={styles.logoContainer}>
          <Image src="/MediVerse Logo (with Text).png" alt="Logo" width={217} height={58.06} className={styles.logo} />
        </div>

        <ul className={styles.navbar}>
          <li><a href="/">FEATURES</a></li>
          <li><a href="/contactUs">CONTACT US</a></li>
          <li><a href="/FAQS/">FAQS</a></li>
        </ul>

        <div className={styles.button}>
          <Link href="/PATIENT/Register1Patient/">REGISTER</Link>
        </div>

        {/* Ito yung image behind ng content ng login */}
        <div className={styles.vector1577}>
          <Image src="/Vector1577.png" alt="vector1577" width={1094} height={822} />
        </div>
                <div className={styles.cryptoWallet}>
          <Image src="/cryptoWallet.png" alt="cryptoWallet" width={646} height={609} />
        </div>
      </header>
    </>
  );
}
 
export default LogInPatientHeader;
