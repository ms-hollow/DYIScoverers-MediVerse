import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from '/styles/homeSidebarHeader.module.css';
import styles2 from '/styles/accountIconDropdown.module.css';
 
const AccountDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const container = document.getElementById('content');
        if(container){
            if (isOpen) {
                container.classList.add(styles.blur);
                searchOpen.classList.remove(styles.searchOpen);
            } else {
                container.classList.remove(styles.blur);
            }
        }
    }, [isOpen]);

    return (
        <div className={styles2.dropdown}>
            <div className={styles2.accountIcon} onClick={toggleMenu}> 
                <img src="/Account Icon.svg" alt="Account" className={styles.logo} />
                {isOpen && (
                    <div className={styles2.dropdownContent}>
                        <Link href="/PATIENT/AccountProfilePatient"><img src="/dropdown_profile.svg" alt="Profile Dropdown Icon" />Profile</Link>
                        <Link href="/account/settings"><img src="/dropdown_settings.svg" alt="Settings Dropdown Icon" />Settings</Link>
                        <Link href="/PATIENT/AccountAccessPatient"><img src="/dropdown_access.svg" alt="Account Access Dropdown Icon" />Account Access</Link>
                        <a href="/"><img src="/dropdown_logout.svg" alt="Logout Dropdown Icon" />Logout</a>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AccountDropdown;
