/*dito ide-define ang layout ng nabvar*/
import Link from 'next/link';
import Image from 'next/image';
import styles from '/styles/logInPageHeader.module.css';

const logInPageHeader = () => {
  return (
    <>
      <header className={styles.header}>
        <div className={styles.logoContainer}>
          <Image src="/MediVerse Logo (with Text).png" alt="Logo" width={217} height={58.06} className={styles.logo} />
        </div>

        <ul className={styles.navbar}>
          <li><a href="/">FEATURES</a></li>
          <li><a href="/REGISTER">CONTACT US</a></li>
          <li><a href="/FAQS/">FAQS</a></li>
        </ul>

        <div className={styles.button}>
          <Link href="/PATIENT/Register1Patient/">Connect Wallet</Link>
        </div>

      </header>
    </>
  );
}
 
export default logInPageHeader;