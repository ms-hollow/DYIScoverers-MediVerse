import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '/styles/homeSidebarHeader.module.css';
import AccountDropdown from '/components/accountIconDropdownHospital.js';

const HomeSidebarHeaderHospital = ({children, pageName}) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
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
                            <a href="/destination-url"> <img src="/Search icon.svg" alt="Search" className={styles.searchIcon} /> </a>
                            <input type="text" placeholder="Search" className={styles.searchInput} />
                        </div>
                        <a href="/HOSPITAL/NotificationHospital/"> <img src="/Notifications.svg" alt="Notification"/> </a>
                        <AccountDropdown />
                    </div>
                    
                </header>
                
            
                <div className={`${styles.sidebarMenuBtn} ${isSidebarOpen ? styles.menuOpen : ''}`} onClick={toggleSidebar}>
                    <div className={styles.triangle}></div> {/* Add the triangle directly inside the .sidebarMenuBtn */}
                </div>
                
                <div className={styles.sidebar}>
                    <div className={styles.top}>
                        <div className={styles.sidebarLogo}>                     
                            <Image src="/MediVerse Logo (with Text).svg" alt="Logo" width={217} height={58.06} className={styles.logo} />
                        </div>
                    </div>

                    <div className={styles.menuItems}>
                        <ul>
                            <li><a href="/HOSPITAL/HomeHospital/">Home</a></li>
                            <li><a href="/HOSPITAL/PatientRecordsHospital/">Patient Records</a></li>
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

export default HomeSidebarHeaderHospital;
