import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '/styles/logInPatientHeader.module.css';
import styles2 from '/styles/accountIconDropdown.module.css';

const LogInPatientHeader = () => {

  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
      setIsOpen(!isOpen);
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.logoContainer}>
          <Image src="/MediVerse Logo (with Text).svg" alt="Logo" width={217} height={58.06} className={styles.logo} />
          
        </div>

        <ul className={styles.navbar}>
          <li><a href="/#features">FEATURES</a></li>
          <li><a href="/GENERAL/ContactUs/">CONTACT US</a></li>
          <li><a href="/GENERAL/FAQs/">FAQS</a></li>
        </ul>

        <div className={styles2.registerDropdown2}></div>
            <div className={styles.button} onClick={toggleMenu}> 
                REGISTER
                  {isOpen && (
                      <div className={styles2.registerDropdownContent2}>
                          <Link href="/PATIENT/Register1Patient/">As Patient</Link>
                          <Link href="/HOSPITAL/Register1Hospital/">As Hospital</Link>
                      </div>
                  )}
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
