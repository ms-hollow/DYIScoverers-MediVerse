import React, { useState } from 'react';
import Link from 'next/link';
import styles from '/styles/homeSidebarHeader.module.css';
import styles2 from '/styles/accountIconDropdown.module.css';

const RegisterButtonDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={styles2.dropdown}>

            <div className={styles2.accountIcon} onClick={toggleMenu}> 
                <div className={styles.button}>
                    Get Started
                </div>
                {isOpen && (
                    <div className={styles2.dropdownContent}>
                        <Link href="/HOSPITAL/Register1Patient/"><img src="/dropdown_profile.svg" alt="Profile Dropdown Icon" />As Patient</Link>
                        <Link href="/PATIENT/Register1Hospital/"><img src="/dropdown_settings.svg" alt="Settings Dropdown Icon" />As Hospital</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RegisterButtonDropdown;
