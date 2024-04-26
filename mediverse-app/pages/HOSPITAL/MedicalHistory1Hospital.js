import styles from '../../styles/medicalHistory.module.css';
import Layout from '../../components/HomeSidebarHeaderHospital.js'
//import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import web3 from "../../blockchain/web3";
import mvContract from '../../blockchain/mediverse';
import ToastWrapper from "@/components/ToastWrapper";
import { toast } from 'react-toastify';


const MedicalHistoryPatient = () => {

    const router = useRouter();
    const [medicalHistory, setMedicalHistory] = useState([]);
    const [hospitalAddress, setHospitalAddress] = useState('');
    const { patientAddr, creationDateString } = router.query; //* kunin yung data ng pinindot na row sa may MedicalHistory1Hospital
    console.log(creationDateString);
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

    function searchInObject(obj, searchQuery) {
        // Check if searchQuery is null, undefined, or an empty string
       if (searchQuery === null || searchQuery === undefined || searchQuery.trim().length === 0) {
           return; // Exit the function
       }
       
       return Object.values(obj).some(value =>
           typeof value === "string" && value.toLowerCase().includes(searchQuery.toLowerCase())
       );
   };

    useEffect(() => {
        async function fetchMedicalHistory() {
            try {
                let hospitalName;
                // Ensure hospital address is set before fetching medical history
                if (!hospitalAddress) {
                    await setAddress();
                    return;
                }

                //* Retrieve muna ang hospital na currently naka logged in
                const hospitalInfo = await mvContract.methods.getHospitalInfo(hospitalAddress).call();
                //console.log(hospitalInfo[0]);
                //hospitalName = hospitalInfo[0]; //* Get ang name ni hospital then salin kay var hospitalName

                const medicalHistoryString = await mvContract.methods.getMedicalHistory(patientAddr).call();
                // console.log("Get all medical record of specific patient", medicalHistoryString);
                
                const parsedMedicalHistory = medicalHistoryString.map(item => {
                    const {patientAddr, hospitalAddr, physician, diagnosis, signsAndSymptoms, treatmentProcedure, tests, medications, admission, creationDate} = item;
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

                // //? Function that will filter the medical history 
                // const filteredMedicalHistory = parsedMedicalHistory.filter(item => item.hospitalAddr === hospitalAddress);
                
                const modifiedMedicalHistory = parsedMedicalHistory.map(item => {
                    const splitDiagnosis = item.diagnosis.split('+');
                    //console.log("Diagnosis:", splitDiagnosis[0]);
                    //console.log("Creation Date: ",item.creationDate);
                    const splitAdmission = item.admission.split('+');
                    //console.log("Admission Date:", splitAdmission[2]);
                    //console.log("Discharge Date:", splitAdmission[3]);
                    return {
                        hospitalName: splitAdmission[1],
                        diagnosis: splitDiagnosis[0],
                        physician: item.physician,
                        admissionDate: splitAdmission[2],
                        dischargeDate: splitAdmission[3],
                        patientAddr: item.patientAddr,
                        creationDate: item.creationDate
                    };
                });
                
                //setMedicalHistory(modifiedMedicalHistory);
                //console.log("Modified", modifiedMedicalHistory);
                let searchQueryLower;
                if (typeof searchQuery === 'string' && searchQuery.trim() !== '') {
                    searchQueryLower = searchQuery.toLowerCase();
                }
                
                if (!searchQueryLower) {
                    setMedicalHistory(modifiedMedicalHistory);
                } else {
                    const results = modifiedMedicalHistory.filter(entry => searchInObject(entry, searchQueryLower));
                    if (results.length > 0) {
                        //("Found:", results);
                        setMedicalHistory(results);
                    } else {
                        //console.log("No matching entry found.");
                        toast.warning("No matching entry found.");
                    }
                }

            } catch (error) {
                console.error('Error fetching medical history:', error);
            }
        }
        
        fetchMedicalHistory();
    }, [hospitalAddress]);

    const clickRow = (patientAddr, creationDate) => {
        const creationDateString = creationDate.toString();
        router.push({
            pathname: '/HOSPITAL/MedicalHistory2Hospital/',
            query: { patientAddr, creationDateString }
        });
    };

    return (
        <>
        <Layout pageName="Medical History">
            <div className={styles.container}>
                <div className={styles.tableHeading}>
                    <p>Diagnosis</p>
                    <p>Hospital</p>
                    <p>Physician</p>
                    <p>Admission Date</p>
                    <p>Discharge Date</p>
                </div>

                <div className={styles.dataContainer}>
                    {medicalHistory.map((record, index) => (
                        <div className={styles.data} key={index} onClick={() => clickRow(record.patientAddr, record.creationDate)}>
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
};
 
export default MedicalHistoryPatient;