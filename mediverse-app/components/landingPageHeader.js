import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from '/styles/landingPageHeader.module.css';
import styles2 from '/styles/accountIconDropdown.module.css';

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
        <Link href='/' className={styles.logoContainer}>
          <img src="/MediVerse Logo (with Text).svg" alt="Logo" />
        </Link>

        {/* Navbar links */}
        <ul id='navbar' className={`${styles.navbar} ${isOpen ? styles.open : ''}`}>
          <li><Link href='/' className={styles.logoNavBar}>
            <img src="/MediVerse Logo (with Text).svg" alt="Logo" />
          </Link></li>
          <li><a href="/#features" onClick={toggleNavbar}>FEATURES</a></li>
          <li><a href="/GENERAL/ContactUs" onClick={toggleNavbar}>CONTACT US</a></li>
          <li><a href="/GENERAL/FAQs/" onClick={toggleNavbar}>FAQS</a></li>
          <li><p className={styles.closeTxt} onClick={toggleNavbar}>CLOSE</p></li>
        </ul>

        {/* Log in button and menu icon */}
        <div className={styles.button}>
          <Link href={String(buttonLink)}> {buttonText}</Link>
        </div>


        <div className={isOpen ? styles.menuIconHidden : styles.menuIcon} onClick={toggleNavbar}>
          <img src="/burger-menu-icon.svg" style={{ width: '30px', height: '30px' }} alt="Menu" />
        </div>
      </header>
    </>
  );
}
 
export default LandingPageHeader;
