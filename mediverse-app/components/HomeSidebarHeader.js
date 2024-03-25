import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '/styles/homeSidebarHeader.module.css';

const HomeSidebarHeader = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <>

            <header className={styles.header}>
            
                <div className={`${styles.categoryName} ${isSidebarOpen ? styles.contentShifted : ''}`}>
                    Home
                </div>

                <div className={styles.headerButtons}>
                    <img src="/Search icon.png" alt="Search" width={23} height={23} className={styles.logo} />
                    <img src="/Notifications.png" alt="Notification" width={23} height={23} className={styles.logo} />
                    <img src="/Account Logo.png" alt="Account" width={23} height={23} className={styles.logo} />
                </div>
                
            </header>

            <div className={`${styles.sidebarContainer} ${isSidebarOpen ? styles.sidebarOpen : ''}`}>
            
                <div className={`${styles.sidebarMenuBtn} ${isSidebarOpen ? styles.menuOpen : ''}`} onClick={toggleSidebar}>
                    <div className={styles.triangle}></div> {/* Add the triangle directly inside the .sidebarMenuBtn */}
                </div>
                
                <div className={styles.sidebar}>
                    <div className={styles.top}>
                        <div className={styles.sidebarLogo}>                     
                            <Image src="/MediVerse Logo (with Text).png" alt="Logo" width={217} height={58.06} className={styles.logo} />
                        </div>
                    </div>

                    <div className={styles.menuItems}>
                        <ul>
                            <li><a href="view-appointments.html">Home</a></li>
                            <li><a href="./book-appointment/book-appointment.html">Book Appointment</a></li>
                            <li><a href="profile.html">Profile</a></li>
                            <li><a href="change-password.html">Setting</a></li>
                        </ul>
                    </div>
                </div>

                <div className={`${styles.contentContainer} ${isSidebarOpen ? styles.contentShifted : ''}`}>
                    <h1>DITO LALAGAY CONTENTS</h1>
                </div>
            </div>
                
        </>
    );
};

export default HomeSidebarHeader;
