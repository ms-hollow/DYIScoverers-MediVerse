import styles from '../../styles/homePatient.module.css'
import Layout from '../../components/HomeSidebarHeader.js'
// import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import web3 from "../../blockchain/web3";
import mvContract from '../../blockchain/mediverse';
import ToastWrapper from '@/components/ToastWrapper';


const HomePatient = () => {

    const router = useRouter();
    const [medicalHistory, setMedicalHistory] = useState([]);
    const [listOfHospitalNames, setHospitalNames] = useState([]);
    const [updatedMedicalHistory, setUpdatedMedicalHistory] = useState([]);
    const [patientAddress, setPatientAddress] = useState('');
    const [patientName, setPatientName] = useState('');
    let hospitalAddress;
    const [latestHistory, setLatestHistory] = useState([]);

    const setAddress = async () => {
        try {
            const accounts = await web3.eth.getAccounts();
            //console.log("Account:", accounts[0]);
            setPatientAddress(accounts[0]); 
        } catch (error) {
            toast.error('Error fetching patient address.');
        }
    };

    useEffect(() => {
        
        async function fetchMedicalHistory() {
            try {
                if (!patientAddress) {
                    await setAddress();
                    return;
                }

                const patientInfo = await mvContract.methods.getPatientInfo(patientAddress).call();
                //console.log(patientInfo);
                const patientNameHolder = patientInfo[0].split('+');
                let patientHolder = `${patientNameHolder[0]} ${patientNameHolder[1]} ${patientNameHolder[2]}`;
                setPatientName(patientHolder);

                const patientMedicalHistories = await mvContract.methods.getMedicalHistory(patientAddress).call();
                //console.log(patientMedicalHistories);
                
                const parsedMedicalHistory = patientMedicalHistories.map(item => {
                    const {patientAddr, hospitalAddr, physician, diagnosis, signsAndSymptoms, treatmentProcedure, tests, medications, admission, creationDate} = item;
                    hospitalAddress = hospitalAddr;
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
                        creationDate
                    };
                });
                //console.log(parsedMedicalHistory);

                const modifiedMedicalHistory = parsedMedicalHistory.map(item => {
                    const splitDiagnosis = item.diagnosis.split('+');
                    // console.log("Diagnosis:", splitDiagnosis[0]);
                    // console.log("Creation Date: ",item.creationDate);
                    const splitAdmission = item.admission.split('+');
                    // console.log("Admission Date:", splitAdmission[2]);
                    // console.log("Discharge Date:", splitAdmission[3]);
                    const formattedDate = new Date(item.creationDate * 1000).toLocaleDateString();
                    return {
                        diagnosis: splitDiagnosis[0],
                        physician: item.physician,
                        hospitalName: splitAdmission[1],
                        admissionDate: splitAdmission[2],
                        dischargeDate: splitAdmission[3],
                        patientAddr: item.patientAddr,
                        creationDate: formattedDate
                    };
                });
                setMedicalHistory(modifiedMedicalHistory);
                // console.log("Modified", modifiedMedicalHistory);

                const latestMedicalRecord = modifiedMedicalHistory[0];
                // console.log("Latest Medical Record:", latestMedicalRecord);

                if (latestMedicalRecord && typeof latestMedicalRecord === 'object') {
                    const latestAdd = [latestMedicalRecord.hospitalName, latestMedicalRecord.creationDate];
                    setLatestHistory([latestAdd]);
                } else {
                    // console.log("No latest medical record found.");
                }

                const hospitalRequest = await mvContract.methods.getPendingRequests(patientAddress).call();
                const hospitalsInfo = [];
                for (let i = 0; i < Math.min(hospitalRequest.length, 2); i++) { // Limit to 2 requests
                    const hospitalInfo = await mvContract.methods.getHospitalInfo(hospitalRequest[i]).call();
                    hospitalsInfo.push({
                        name: hospitalInfo[0],
                    });
                }
                //console.log("Requesting Hospitals: ", hospitalsInfo);
                setHospitalNames(hospitalsInfo);

            } catch (error) {
                console.error('Error fetching medical history:', error);
            }
        }
        fetchMedicalHistory();
    }, [patientAddress]);

    const clickRow = (patientAddr, creationDate) => {
        router.push({
            pathname: '/PATIENT/MedicalHistory2Patient/',
            query: { patientAddr, creationDate }
        });
    };

    return ( 
        <>
        <Layout pageName="Home">
        
            <div className={styles.container}>

            <div className={styles.notifContainer}>
                    <div className={styles.notifSection_header}>
                        <div className={styles.notifTitle}>
                            <img src="/bell.svg" alt="bell-icon"/>
                            <p>Notifications</p>
                        </div>
                        <div className={styles.threeDot}>
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                    </div>

                    <div className={styles.tableContainer}>
                        {listOfHospitalNames.map((hospital, index) => (
                            <div className={styles.notifDataContainer} key={index}>
                                {/* <img className={styles.icon} src={notif_requestAccess.svg.icon} alt="Icon" /> */}
                                <p className={styles.notifTypeFormat}>Hospital Request: </p>
                                <p className={styles.desFormat}>{hospital.name} sends a request to access your medical history.</p>
                                <p className={styles.timeStampFormat}>{hospital.timeStamp}</p>
                            </div>
                        ))}
                       {latestHistory.map((record, index) => (
                            <div className={styles.notifDataContainer} key={index}>
                                <p className={styles.notifTypeFormat}>New Medical Record Added: </p>
                                <p className={styles.desFormat}>{record[0]} added new medical history.</p> 
                                <p className={styles.timeStampFormat}>{record[1]}</p>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className={styles.welcomeText}>
                    <p>Welcome Back, {patientName}</p> 
                </div>
                
                <div className={styles.tableHeading}>
                    <p>Diagnosis</p>
                    <p>Hospital</p>
                    <p>Physician</p>
                    <p>Admission Date</p>
                    <p>Discharge Date</p>
                </div>

                <div className={styles.dataContainer}>
                    {medicalHistory.map((record, index) => (
                            <div className={styles.data} key={index}>
                                <p className={styles.diaAttrb}>{record.diagnosis}</p> 
                                <p>{record.hospitalName}</p>
                                <p>{record.physician}</p>
                                <p>{record.admissionDate}</p>
                                <p>{record.dischargeDate}</p>
                            </div>
                        ))}
                </div>

            </div>
        </Layout>
        <ToastWrapper/>
        </>
     );
}
 
export default HomePatient;