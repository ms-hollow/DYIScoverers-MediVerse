import styles from '../../styles/homeHospital.module.css'
import Layout from '../../components/HomeSidebarHeader.js'
import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import web3 from "../../blockchain/web3";
import mvContract from '../../blockchain/mediverse';

export async function getStaticProps() {
    const filePath1 = path.join(process.cwd(), 'public/placeHolder/dummyData_RecentPatients.json');
    const jsonData1 = fs.readFileSync(filePath1, 'utf8');
    const data1 = JSON.parse(jsonData1);

    const filePath2 = path.join(process.cwd(), 'public/placeHolder/dummyData_notifHospitalHome.json');
    const jsonData2 = fs.readFileSync(filePath2, 'utf8');
    const data2 = JSON.parse(jsonData2);

    return {
        props: {
            data1, data2
        }
    };
}

const HospitalHome = ({data1, data2}) => {
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
            alert('Error fetching hospital address.');
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
                
                const parsedMedicalHistory = medicalHistoryString.map(item => {
                    const [patientAddr, hospitalAddr, physician, diagnosis, signsAndSymptoms, treatmentProcedure, tests, medications, admission, creationDate] = item;
                    patientAddress = patientAddr;
                    const creationDateInt = parseInt(creationDate);
                    return {
                        patientAddr,
                        hospitalAddr,
                        physician,
                        diagnosis,
                        signsAndSymptoms,
                        treatmentProcedure,
                        tests,
                        medications,
                        admission,
                        creationDate: creationDateInt
                    };
                });

                //console.log(parsedMedicalHistory);

                const filteredMedicalHistory = parsedMedicalHistory.filter(item => item.hospitalAddr === hospitalAddress);

                console.log(filteredMedicalHistory);

                const patientAddrAndCreationDate = filteredMedicalHistory.map(entry => [ entry.patientAddr, entry.diagnosis, entry.admission]);
                console.log(patientAddrAndCreationDate);


                console.log("Latest three dates:", getLatestCreationDate(patientAddrAndCreationDate));

                let listAddress = getLatestListAddress(patientAddrAndCreationDate);
                let listDiagnosis = getLatestListDiagnosis(patientAddrAndCreationDate);
                let listAdmission = getLatestListAdmission(patientAddrAndCreationDate);
                //console.log(listAddress)
                for (let i = 0; i < listAddress.length; i++) {
                    let p = await parse(filteredMedicalHistory, listAddress[i], listDiagnosis[i], listAdmission[i]);
                    console.log(p);
                }

                
                

            } catch (error) {
                console.error('Error fetching medical history:', error);
            }

            async function parse(parsedMedicalHistory, address, diagnosis, admission) {
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
                
                const modifiedMedicalHistory = parsedMedicalHistory.map(item => {
                    const splitDiagnosis = item.diagnosis.split('+');
                    //console.log("Diagnosis:", splitDiagnosis[0]);
                    //console.log("Creation Date: ", item.creationDate);
                    const splitAdmission = item.admission.split('+');
                    //console.log("Admission Date:", splitAdmission[2]);
                    //console.log("Discharge Date:", splitAdmission[3]);


                    return {
                        patientName,
                        admissionDate: splitAdmission[2],
                        dischargeDate: splitAdmission[3],
                        gender: patientInfo[2],
                        diagnosis: splitDiagnosis[0],
                        //creationDates
                    };
                });
                setMedicalHistory(modifiedMedicalHistory);

                return [patientName, patientInfo[2], splitDiagnosis[0], splitAdmission[2], splitAdmission[3]]
            }
        }

        fetchPatientHistory();
    }, [hospitalAddress]);


    return (  
        <Layout pageName="Home">
        <>
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
                            <Link href="/">
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
                            {data1.map(data => (
                                <Link href="/" key={data.id} className={styles.data}>
                                    <p className={styles.nameFormat}>{data.patientName}</p>
                                    <p>{data.admissionDate}</p>
                                    <p>{data.dischargeDate}</p>
                                    <p>{data.gender}</p>
                                    <p>{data.diagnosis}</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div className={styles.newPatientAndNotif_container}>
                        <div>
                            <Link href="/" className={styles.newPatient}>
                                <img src='/plus icon.svg' alt='Plus Icon'/>
                                <p>Add New Patients</p>
                            </Link>
                        </div>
                        <div className={styles.notifications}>
                            <Link href="/" className={styles.notif_title}>
                                <img src="/bell.svg" alt="bell-icon"/>
                                <p>Notifications</p>
                            </Link>
                            <div className={styles.notif_container}>
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
        </Layout>
    );
}
 
export default HospitalHome;