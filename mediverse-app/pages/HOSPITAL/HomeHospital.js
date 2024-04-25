import Image from "next/image";
import Link from "next/link";
import styles from '../../styles/homeHospital.module.css'
import Layout from '../../components/HomeSidebarHeaderHospital'
// import fs from 'fs';
import path from 'path';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ToastWrapper from "@/components/ToastWrapper";
import { toast } from 'react-toastify';
import web3 from "../../blockchain/web3";
import mvContract from "../../blockchain/mediverse"; // ABI


const HospitalHome = () => {
    const router = useRouter();
    const [medicalHistory, setMedicalHistory] = useState([]);
    const [hospitalAddress, setHospitalAddress] = useState('');
    const [creationDates, setCreationDates] = useState([]);
    let patientAddress, patientName;
    

    // Function to set the hospital address
    const setAddress = async () => {
        try {
            const accounts = await web3.eth.getAccounts(); // Get the accounts from MetaMask
            //console.log("Account:", accounts[0]);
            setHospitalAddress(accounts[0]); // Set the hospital address
        } catch (error) {
            toast.error('Error fetching hospital address.');
        }
    };


    function getLatestCreationDate(array) {
        const lastOccurrenceMap = new Map();

        for (let i = array.length - 1; i >= 0; i--) {
            const firstElement = array[i][0];
            // If the map doesn't have the first element, or if it's the first occurrence of this element, add it to the map
            if (!lastOccurrenceMap.has(firstElement)) {
                lastOccurrenceMap.set(firstElement, array[i]);
            }
        }

        // Convert map values to an array and return the last three elements
        return Array.from(lastOccurrenceMap.values()).slice(-3);
        
    };

    function getLatestListAddress(array) {
        let p = array.map(item =>  item[0] );
        let unique = [...new Set(p)];

        if (!Array.isArray(array)) {
            return "Input is not an array";
        }
        
        if (unique.length <= 3) {
            return unique.reverse();
        } else {
            return unique.slice(-3).reverse();
        }
    };

    function getLatestListDiagnosis(array) {
        let p = array.map(item =>  item[1] );
        let unique = [...new Set(p)];

        if (!Array.isArray(array)) {
            return "Input is not an array";
        }
        
        if (unique.length <= 3) {
            return unique.reverse();
        } else {
            return unique.slice(-3).reverse();
        }
    };

    function getLatestListAdmission(array) {
        let p = array.map(item =>  item[2] );
        let unique = [...new Set(p)];

        if (!Array.isArray(array)) {
            return "Input is not an array";
        }
        
        if (unique.length <= 3) {
            return unique.reverse();
        } else {
            return unique.slice(-3).reverse();
        }
    };

    useEffect(() => {
        async function fetchPatientHistory() {
            
            try {
                // Ensure hospital address is set before fetching medical history
                if (!hospitalAddress) {
                    await setAddress();
                    return;
                }
                
                // Call the smart contract function with hospital address
                const medicalHistoryString = await mvContract.methods.getAllMedicalHistory().call();
                console.log(medicalHistoryString);
                
                const parsedMedicalHistory = medicalHistoryString.map(item => {
                    const { patientAddr, hospitalAddr, diagnosis, admission, creationDate } = item;
                    patientAddress = patientAddr;
                    const creationDateInt = parseInt(creationDate);
                    return {
                        hospitalAddr,
                        diagnosis,
                        admission,
                        creationDate: creationDateInt
                    };
                });

                // console.log('parsed medical history', parsedMedicalHistory);

                const filteredMedicalHistory = parsedMedicalHistory.filter(item => item.hospitalAddr === hospitalAddress);

                // console.log(filteredMedicalHistory);

                const patientAddrAndCreationDate = filteredMedicalHistory.map(entry => [ entry.patientAddr, entry.diagnosis, entry.admission]);
                //console.log(patientAddrAndCreationDate);

                //console.log("Latest three dates:", getLatestCreationDate(patientAddrAndCreationDate));

                let listAddress = getLatestListAddress(patientAddrAndCreationDate);
                let listDiagnosis = getLatestListDiagnosis(patientAddrAndCreationDate);
                let listAdmission = getLatestListAdmission(patientAddrAndCreationDate);

                
                //console.log(listAddress)
                // * eto ung recent patients naka auto na yan mag  anti duplicate
                let p, temp =[]; 
                for (let i = 0; i < listAddress.length; i++) {
                    p = await getRecentPatient(filteredMedicalHistory, listAddress[i], listDiagnosis[i], listAdmission[i]);
                    //console.log(p);
                    const obj = {
                        patientName: p[0],
                        admissionDate: p[1],
                        dischargeDate: p[2],
                        gender: p[3],
                        diagnosis: p[4]
                    };

                    temp.push(obj);
                }
                setMedicalHistory(temp);
                console.log(temp);
                
            } catch (error) {
                console.error('Error fetching medical history:', error);
            }

            async function getRecentPatient(parsedMedicalHistory, address, diagnosis, admission) {
                const patientInfo = await mvContract.methods.getPatientInfo(address).call();
                const patientNameHolder = patientInfo[0].split('+');
                patientName = `${patientNameHolder[0]} ${patientNameHolder[1]} ${patientNameHolder[2]}`;

                //console.log(patientName);
                //console.log(patientInfo[2]); // Gender
                const splitDiagnosis = diagnosis.split('+');
                //console.log("Diagnosis:", splitDiagnosis[0]);
                const splitAdmission = admission.split('+');
                //console.log("Admission Date:", splitAdmission[2]);
                //console.log("Discharge Date:", splitAdmission[3]);
                return [patientName, splitAdmission[2], splitAdmission[3], patientInfo[2], splitDiagnosis[0]]
            }
        }
        fetchPatientHistory();
    }, [hospitalAddress]);

    const [authorizedList, setAuthorizedList] = useState([]);
    const [unauthorizedList, setUnauthorizedList] = useState([]);

    async function isHospitalAuthorized(patientAddr, hospitalAddr) {
        const authorizedHospitals = await mvContract.methods.getAuthorizedHospitals(patientAddr).call();
        return authorizedHospitals.includes(hospitalAddr);
    }
    
    async function hasPendingRequest(patientAddr, hospitalAddr) {
        const pendingRequests = await mvContract.methods.getPendingRequests(patientAddr).call();
        return pendingRequests.includes(hospitalAddr);
    }

    useEffect(() => {
        async function getStatus() {
            try {
                if (!hospitalAddress) {
                    await setAddress();
                    return;
                }
                const medicalHistoryString = await mvContract.methods.getAllMedicalHistory().call();
    
                // Filter medical records to include only those made by the specific hospital
                const filteredMedicalHistory = medicalHistoryString.filter(item => item.hospitalAddr === hospitalAddress);
    
                const processedMedicalHistory = filteredMedicalHistory.map(async item => {
                    const isAuthorized = await isHospitalAuthorized(item.patientAddr, hospitalAddress);
                    const pendingRequest = await hasPendingRequest(item.patientAddr, hospitalAddress);
    
                    if (isAuthorized) {
                        return {
                            ...item,
                            authorized: true,
                            unauthorized: false,
                            accessStatus: 'Your request for account access has been approved.'
                        };
                    } else {
                        return {
                            ...item,
                            authorized: false,
                            unauthorized: true,
                            status: pendingRequest ? 'Pending' : 'Not Authorized',
                            accessStatus: 'You no longer have access to this account.'
                        };
                    }
                });
    
                // Wait for all promises to resolve
                const processedMedicalHistoryData = await Promise.all(processedMedicalHistory);
    
                // Separate authorized and unauthorized records
                const authorizedRecords = processedMedicalHistoryData.filter(record => record.authorized);
                const unauthorizedRecords = processedMedicalHistoryData.filter(record => record.unauthorized);
    
                // Update state with authorized and unauthorized records
                setAuthorizedList(authorizedRecords);
                setUnauthorizedList(unauthorizedRecords);
                //console.log(authorizedRecords);
                //console.log(unauthorizedRecords);

            } catch (error) {
                console.error('Error fetching medical history:', error);
            }
        }
    
        getStatus();
    }, [hospitalAddress]);

    return (  
        <>
        <Layout pageName="Home">
            <div className={styles.mainContainer}>
                <div className={styles.banner}>
                    <img src='/imageHome.svg' alt='Image Banner'/>
                    <div className={styles.banner_info}>
                        <div className={styles.infoFormat}>
                            <h5>1M</h5>
                            <p>Satisfied Patients</p>
                        </div>
                        <div className={styles.infoFormat}>
                            <h5>50k</h5>
                            <p>Renowed Doctors</p>
                        </div>
                        <div className={styles.infoFormat}>
                            <h5>5k</h5>
                            <p>Progressive Hospitals</p>
                        </div>
                    </div>
                </div>
                <div className={styles.bottomHalf_container}>
                    <div className={styles.recentPatients_container}>
                        <div className={styles.title}>
                            <p>Recent Patiens</p>
                            <Link href="/HOSPITAL/PatientRecordsHospital">
                                <p>View All &gt;</p>
                            </Link>
                        </div>
                        <div className={styles.tableHeading}>
                            <p>Patient Name</p>
                            <p>Admission Date</p>
                            <p>Discharge Date</p>
                            <p>Gender</p>
                            <p>Diagnosis</p>
                        </div>

                        <div className={styles.dataContainer}>
                            {medicalHistory.map(data => (
                                <div key={data.id} className={styles.data}> <p className={styles.nameFormat}>{data.patientName}</p>
                                    <p>{data.admissionDate}</p>
                                    <p>{data.dischargeDate}</p>
                                    <p>{data.gender}</p>
                                    <p>{data.diagnosis}</p>
                                    </div>
                            //     <Link href="/" key={data.id} className={styles.data}>
                            //     <p className={styles.nameFormat}>{data.patientName}</p>
                            //     <p>{data.admissionDate}</p>
                            //     <p>{data.dischargeDate}</p>
                            //     <p>{data.gender}</p>
                            //     <p>{data.diagnosis}</p>
                            // </Link>
                            ))}
                        </div>
                    </div>
                    <div className={styles.newPatientAndNotif_container}>
                        <div>
                            <Link href="/HOSPITAL/AddPatient" className={styles.newPatient}>
                                <img src='/plus icon.svg' alt='Plus Icon'/>
                                <p>Add New Patients</p>
                            </Link>
                        </div>
                        <div className={styles.notifications}>
                            <div className={styles.notif_title}>
                                <img src="/bell.svg" alt="bell-icon"/>
                                <p>Notifications</p>
                            </div>
                            {/* <div className={styles.notif_container}>
                                {data2.map(data => (
                                    <Link href="/" key={data.id} className={styles.notifData}>
                                        <p className={styles.notifIcon}>{data.icon && <img src={data.icon}/>}</p>
                                        <div className={styles.typeDesContainer}>
                                            <p className={styles.notifTypeFormat}>{data.notificationType}</p>
                                            <p className={styles.notifDesFormat}>{data.description}</p>
                                        </div>
                                        <p className={styles.timeStampFormat}>{data.timeStamp}</p>
                                    </Link>
                                ))}
                            </div> */}

                            <div className={styles.notif_container}>
                                {authorizedList.map((record, index) => (
                                    <div key={index} className={styles.notifData}>
                                        <p className={styles.notifIcon}>{record.icon && <img src={record.icon}/>}</p>
                                        <div className={styles.typeDesContainer}>
                                            <p className={styles.notifTypeFormat}>Account Access Granted</p>
                                            <p className={styles.notifDesFormat}>{record.accessStatus}</p>
                                        </div>
                                    </div>
                                ))}

                                {unauthorizedList.map((record, index) => (
                                    <div key={index} className={styles.notifData}>
                                        <p className={styles.notifIcon}>{record.icon && <img src={record.icon}/>}</p>
                                        <div className={styles.typeDesContainer}>
                                            <p className={styles.notifTypeFormat}>Account Access got Revoked</p>
                                            <p className={styles.notifDesFormat}>{record.accessStatus}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            
        </Layout>
        <ToastWrapper/>
        </>
    );
}
 
export default HospitalHome;