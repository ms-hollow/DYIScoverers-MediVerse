import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from '/styles/landingPageHeader.module.css';
import styles2 from '/styles/accountIconDropdown.module.css';
//import '@fortawesome/fontawesome-free/css/all.min.css';

const LandingPageHeader = ({ buttonText, buttonLink}) => {
  // State to track whether the navbar is open or closed
  const [isOpen, setIsOpen] = useState(false);

  // Function to toggle the navbar
  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <header className={`${styles.header} ${isOpen ? styles.open : ''}`}>
        <div className={styles.logoContainer}>
          <Image src="/MediVerse Logo (with Text).svg" alt="Logo" width={217} height={58.06}/>
        </div>

        {/* Navbar links */}
        <ul className={`${styles.navbar} ${isOpen ? styles.open : ''}`}>
          <li><a href="/#features" onClick={toggleNavbar}>FEATURES</a></li>
          <li><a href="/GENERAL/ContactUs" onClick={toggleNavbar}>CONTACT US</a></li>
          <li><a href="/GENERAL/FAQs/" onClick={toggleNavbar}>FAQS</a></li>
        </ul>

        <div className={styles.menuIcon} onClick={toggleNavbar}>
            <i className="fas fa-bars"></i>
        </div>

        {/* Log in button and menu icon */}
        <div className={styles.button}>
          <Link href={String(buttonLink)}> {buttonText}</Link>
        </div>

      </header>
    </>
  );
}
 
export default LandingPageHeader;
