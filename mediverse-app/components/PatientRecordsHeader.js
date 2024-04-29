import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '/styles/homeSidebarHeader.module.css';
import AccountDropdown from '/components/accountIconDropdownHospital.js';
import { useRouter } from 'next/router';
import web3 from "../blockchain/web3";

const PatientRecordsHeader = ({children, pageName}) => {
    
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

    {/*SEARCH FUNCTION*/}
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();

    const authenticator = async () => {
        const accounts = await web3.eth.getAccounts();
        if (accounts.length > 0) {
            return;
        } else {
            router.push('/');
        }
    }
    
    const handleChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleSearch = () => {
        //console.log('Search query:', searchQuery);
        authenticator();
        router.push({
            pathname: '/HOSPITAL/PatientRecordsHospital/',
            query: { searchQuery }
        });
        setSearchQuery('');
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    const gotoHome = async () => {
        const accounts = await web3.eth.getAccounts();
        if (accounts.length > 0) {
            router.push('/HOSPITAL/HomeHospital/');
        } else {
            router.push('/');
        }
    }

    const gotoPatientRecords = async () => {
        const accounts = await web3.eth.getAccounts();
        if (accounts.length > 0) {
            router.push('/HOSPITAL/PatientRecordsHospital/');
        } else {
            router.push('/');
        }
    }
    
    return (
        <>
            <div className={`${styles.sidebarContainer} ${isSidebarOpen ? styles.sidebarOpen : ''}`}>
                <header className={styles.header}>
                    
                    <div className={`${styles.categoryName} ${isSidebarOpen ? styles.contentShifted : ''}`}>
                        {pageName}
                    </div>

                    <div className={styles.headerButtons}>
                            <div onClick={toggleSearchClick}><img src='/Search Icon.svg' alt='search' className={styles.search}/></div>
                            <div className={`${styles.searchBar}`}> 
                                <input type="text" placeholder="Search" className={styles.searchInput} value={searchQuery} onChange={handleChange}/>
                                <a onClick={handleSearch}>
                                    <img src="/Search Icon.svg" alt="Search" className={styles.searchIcon} />
                                </a>
                            </div>
                            {/* <a href="/destination-url"> <img src="/Notifications.svg" alt="Notification" className={styles.logo} /> </a> */}
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
                            <Image src="/MediVerse Logo (with Text).png" alt="Logo" width={217} height={58.06} className={styles.logo} />
                        </div>
                    </div>

                    <div className={styles.menuItems}>
                        <ul>
                            <li><a onClick={gotoHome}>Home</a></li>
                            <li><a onClick={gotoPatientRecords}>Patient Records</a></li>
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
                    <a onClick={handleSearch}> <img src="/Search Icon.png" alt="Search" width={15} height={15} className={styles.searchIcon} /> </a>
                    <input type="text" placeholder="Search" className={styles.searchInput} value={searchQuery} onChange={handleChange} onKeyPress={handleKeyPress}/>
                </div>    
            </div>   
        </>
    );
};

export default PatientRecordsHeader;
