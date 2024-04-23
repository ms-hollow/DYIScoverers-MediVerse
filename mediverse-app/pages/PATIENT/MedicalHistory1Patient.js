import styles from '../../styles/medicalHistory.module.css';
import Layout from '../../components/MedicalHistory1PatientHeader.js'
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
    const [patientAddress, setPatientAddress] = useState('');
    const { searchQuery } = router.query;
    let hospitalAddress, hospitalName;

    const setAddress = async () => {
        try {
            const accounts = await web3.eth.getAccounts();
            //console.log("Account:", accounts[0]);
            setPatientAddress(accounts[0]); 
        } catch (error) {
            toast.error('Error fetching patient address.');
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
                // Ensure hospital address is set before fetching medical history
                if (!patientAddress) {
                    await setAddress();
                    return;
                }

                // console.log(patientAddress);

                const patientMedicalHistories = await mvContract.methods.getMedicalHistory(patientAddress).call();
                //console.log(patientMedicalHistories);

                const parsedMedicalHistory = patientMedicalHistories.map(item => {
                    const [patientAddr, hospitalAddr, physician, diagnosis, signsAndSymptoms, treatmentProcedure, tests, medications, admission, creationDate] = item;
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
                // setMedicalHistory(modifiedMedicalHistory);
                // console.log("Modified", modifiedMedicalHistory);

                let searchQueryLower;
                if (typeof searchQuery === 'string' && searchQuery.trim() !== '') {
                    searchQueryLower = searchQuery.toLowerCase();
                }
                
                if (!searchQueryLower) {
                    setMedicalHistory(modifiedMedicalHistory);
                } else {
                    const results = modifiedMedicalHistory.filter(entry => searchInObject(entry, searchQueryLower));
                
                    if (results.length > 0) {
                        // console.log("Found:", results);
                        setMedicalHistory(results);
                        toast.info(searchQueryLower);
                    } else {
                        // console.log("No matching entry found.");
                        toast.warning("No matching entry found.");
                    }
                }

            } catch (error) {
                console.error('Error fetching medical history:', error);
            }
        }
        fetchMedicalHistory();
    }, [patientAddress, searchQuery]);

    const clickRow = (patientAddr, creationDate) => {
        router.push({
            pathname: '/PATIENT/MedicalHistory2Patient/',
            query: { patientAddr, creationDate }
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
                        <div className={styles.perSection}>
                            <div className={styles.forResponsiveness}>
                                <p>Diagnosis</p>
                                <p>Hospital</p>
                                <p>Physician</p>
                                <p>Admission Date</p>
                                <p>Discharge Date</p>
                            </div>
                            <div className={styles.data} key={index} onClick={() => clickRow(record.patientAddr, record.creationDate)}>
                                <p className={styles.diaAttrb}>{record.diagnosis}</p>
                                <p>{record.hospitalName}</p>
                                <p>{record.physician}</p>
                                <p>{record.admissionDate}</p>
                                <p>{record.dischargeDate}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        
        </Layout>
        <ToastWrapper/>
        </>
    );
}
 
export default MedicalHistoryPatient;