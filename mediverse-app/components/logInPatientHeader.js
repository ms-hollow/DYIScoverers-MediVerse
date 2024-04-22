import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles2 from '/styles/accountIconDropdown.module.css';
import styles from '/styles/landingPageHeader.module.css';

const LogInPatientHeader = () => {

  // State to track whether the navbar is open or closed
  const [isOpen, setIsOpen] = useState(false);

  // Function to toggle the navbar
  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  {/*FOR DROPDOWN MENU IN REGISTER*/}
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const toggleMenu = () => {
      setIsRegisterOpen(!isRegisterOpen);
  };

  return (
    <>
    
      <header className={`${styles.loginHeader} ${isOpen ? styles.open : ''}`}>
        <Link href='/' className={styles.logoContainer}>
          <img src="/MediVerse Logo (with Text).svg" alt="Logo" />
        </Link>

        {/* Navbar links */}
        <ul id='navbar' className={`${styles.navbar} ${isOpen ? styles.open : ''}`}>
          <li><a href="/#features" onClick={toggleNavbar}>FEATURES</a></li>
          <li><a href="/GENERAL/ContactUs" onClick={toggleNavbar}>CONTACT US</a></li>
          <li><a href="/GENERAL/FAQs/" onClick={toggleNavbar}>FAQS</a></li>
        </ul>

        <div className={styles2.registerDropdown2}></div>
            <div className={styles.button} onClick={toggleMenu}> 
                REGISTER
                  {isRegisterOpen && (
                      <div className={styles2.registerDropdownContent2}>
                          <Link href="/PATIENT/Register1Patient/">As Patient</Link>
                          <Link href="/HOSPITAL/Register1Hospital/">As Hospital</Link>    
                      </div>
                  )}
        </div>

        <div className={isOpen ? styles.menuIconHidden : styles.menuIcon} onClick={toggleNavbar}>
            <img src="/burger-menu-icon.svg" style={{ width: '30px', height: '30px' }} alt="Menu" />
        </div>

        <div id='close' className={isOpen ? styles.closeIcon : styles.closeIconHidden} onClick={toggleNavbar}>
            <img src="/close icon.svg" style={{ width: '27px', height: '27px' }} alt="Close" />
        </div>

      </header>

    </>
  );
}
 
export default LogInPatientHeader;
