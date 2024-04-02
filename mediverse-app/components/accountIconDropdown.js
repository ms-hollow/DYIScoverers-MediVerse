import React, { useState } from 'react';
import Link from 'next/link';
import styles from '/styles/homeSidebarHeader.module.css';
import styles2 from '/styles/accountIconDropdown.module.css';

const AccountDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={styles2.dropdown}>
            <div className={styles2.accountIcon} onClick={toggleMenu}> 
                <img src="/Account Logo.png" alt="Account" width={35} height={35} className={styles.logo} />
                {isOpen && (
                    <div className={styles2.dropdownContent}>
                        <Link href="/account/profile"><img src="/dropdown_profile.svg" alt="Profile Dropdown Icon" />Profile</Link>
                        <Link href="/account/settings"><img src="/dropdown_settings.svg" alt="Settings Dropdown Icon" />Settings</Link>
                        <Link href="/logout"><img src="/dropdown_access.svg" alt="Account Access Dropdown Icon" />Account Access</Link>
                        <Link href="/logout"><img src="/dropdown_logout.svg" alt="Logout Dropdown Icon" />Logout</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AccountDropdown;
