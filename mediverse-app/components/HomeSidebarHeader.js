import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '/styles/homeSidebarHeader.module.css';

const HomeSidebarHeader = ({children, pageName}) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
};

    return (
        <>
            <div className={`${styles.sidebarContainer} ${isSidebarOpen ? styles.sidebarOpen : ''}`}>
            <header className={styles.header}>
                
                <div className={`${styles.categoryName} ${isSidebarOpen ? styles.contentShifted : ''}`}>
                    {pageName}
                </div>

                <div className={styles.headerButtons}>
                    <div className={`${styles.searchBar}`}> 
                        <a href="/destination-url"> <img src="/Search icon.png" alt="Search" width={15} height={15} className={styles.searchIcon} /> </a>
                        <input type="text" placeholder="Search" className={styles.searchInput} />
                    </div>
                    <a href="/destination-url"> <img src="/Notifications.png" alt="Notification" width={30} height={30} className={styles.logo} /> </a>
                    <a href="/destination-url"> <img src="/Account Logo.png" alt="Account" width={35} height={35} className={styles.logo} /></a>
                </div>
                
            </header>
                
            
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
                            <li><a href="./book-appointment/book-appointment.html">Medical History</a></li>
                            <li><a href="profile.html">General Health Profile</a></li>
                            <li><a href="change-password.html">Account</a></li>
                        </ul>
                    </div>
                </div>

                <div className={`${styles.contentContainer} ${isSidebarOpen ? styles.contentAdjusted : ''}`}>
                    {children}
                </div>
                
            </div>       
        </>
    );
};

export default HomeSidebarHeader;
