import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '/styles/homeSidebarHeader.module.css';
import AccountDropdown from '/components/accountIconDropdown.js';

const MedicalHistory1PatientHeader = ({children, pageName}) => {
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
                            <input type="text" placeholder="Search" className={styles.searchInput} value={searchQuery} onChange={handleChange}/>
                            <a href="#" onClick={handleSearch} className={styles.searchButton}>
                                <img src="/Search icon.svg" alt="Search" className={styles.searchIcon} />
                            </a>
                        </div>
                        {/* <a href="/HOSPITAL/NotificationHospital/"> <img src="/Notifications.svg" alt="Notification" className={styles.logo} /> </a> */}
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
                            <li><a href="/PATIENT/HomePatient//">Home</a></li>
                            <li><a href="/PATIENT/MedicalHistory1Patient/">Medical History</a></li>
                        </ul>
                    </div>
                </div>

                <div className={`${styles.contentContainer} ${isSidebarOpen ? styles.contentAdjusted : ''}`}>
                    <div id='content'>
                        {children}
                    </div>
                </div>
            </div>       
        </>
    );
};

export default MedicalHistory1PatientHeader;
