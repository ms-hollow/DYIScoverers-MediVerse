import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '/styles/homeSidebarHeader.module.css';
import styles2 from '/styles/accountIconDropdown.module.css';
import AccountDropdown from '/components/accountIconDropdown.js';

const HomeSidebarHeader = ({children, pageName}) => {

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    useEffect(() => {
        const container = document.getElementById('toBlur');
        const container1 = document.getElementById('toBlur1');
        if(container && container1){
            if (isSidebarOpen) {
                container.classList.add(styles.blur);
                container1.classList.add(styles.blur);
            } else {
                container.classList.remove(styles.blur);
                container1.classList.remove(styles.blur);
            }
        }
    }, [isSidebarOpen]);

    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const container = document.getElementById('content');
        const searchOpen = document.getElementById('searchOpen');
        if(container){
            if (isOpen) {
                container.classList.add(styles.blur);
                searchOpen.classList.remove(styles.searchOpen);
                setIsSearchOpen(false);
            } else {
                container.classList.remove(styles.blur);
            }
        }
    }, [isOpen]);

    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const toggleSearchClick = () => {
        setIsSearchOpen(!isSearchOpen);
    };

    useEffect(() => {
        const searchOpen = document.getElementById('searchOpen');
        const container = document.getElementById('content');
        if (isSearchOpen) {
            searchOpen.classList.add(styles.searchOpen);
            container.classList.remove(styles.blur);
            setIsOpen(false);
        } else {
            searchOpen.classList.remove(styles.searchOpen);
        }
    }, [isSearchOpen]);

    return (
        <>
            <div className={`${styles.sidebarContainer} ${isSidebarOpen ? styles.sidebarOpen : ''}`}>
                <header id='toBlur' className={styles.header}>   
                    <div className={`${styles.categoryName} ${isSidebarOpen ? styles.contentShifted : ''}`}>
                        {pageName}
                    </div>
                    
                    <div className={styles.headerButtons}>
                        <div onClick={toggleSearchClick}><img src='/Search Icon.svg' alt='search' className={styles.search}/></div>
                        <div className={`${styles.searchBar}`}> 
                            <a href="/destination-url"> <img src="/Search icon.svg" alt="Search" className={styles.searchIcon} /> </a>
                            <input type="text" placeholder="Search" className={styles.searchInput} />
                        </div>
                        <a href="/destination-url"> <img src="/Notifications.svg" alt="Notification" className={styles.logo} /> </a>
                        <AccountDropdown/>
                    </div>   
                </header>

                <div className={`${styles.sidebarMenuBtn} ${isSidebarOpen ? styles.menuOpen : ''}`} onClick={toggleSidebar}>
                    <div className={styles.triangle}></div> {/* Add the triangle directly inside the .sidebarMenuBtn */}
                    <img className={styles.hamburger} src='/hamburger.svg' alt='hamburger menu'/>
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
                            <li><p className={styles.close} onClick={toggleSidebar}>Close</p></li>
                        </ul>
                    </div>
                </div>

                <div id='toBlur1' className={`${styles.contentContainer} ${isSidebarOpen ? styles.contentAdjusted : ''}`}>
                    <div id='content'>
                        {children}
                    </div>
                </div>
                
                <div id='searchOpen' className={`${styles.searchBarResponsive}`}> 
                    <a href="/destination-url"> <img src="/Search icon.png" alt="Search" width={15} height={15} className={styles.searchIcon} /> </a>
                    <input type="text" placeholder="Search" className={styles.searchInput} />
                </div>   
            </div>   
        </>
    );
};

export default HomeSidebarHeader;