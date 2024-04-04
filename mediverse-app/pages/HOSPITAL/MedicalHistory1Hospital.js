import styles from '../../styles/medicalHistory.module.css';
import Layout from '../../components/HomeSidebarHeaderHospital.js'
//import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import web3 from "../../blockchain/web3";
import mvContract from '../../blockchain/mediverse';

/**
 * TODO: Retrieve data from the blockchain then display/populate the table
 * ! Note: Bali i-reretrieve ang record then display lang yung diagnosis, hospital name, physician , admission and discharge data
 * * nakatuple ang data na i-reretrieve, need gumawa ng function na naghihiwalay ng data at siya na bahala magpopulate ng table
 * * Lagi i-test ang smart contract sa remix then tignan kung paano ito gumagana.
 */


/**
 * *variables sa medical history
 * *patientAddr, address hospitalAddr, string physician, diagnosis, signsAndSymptoms, treatmentProcedure
 * *tests, medications, admission, creationDate
 */

const MedicalHistoryPatient = () => {
    const [medicalHistory, setMedicalHistory] = useState([]);
    const [hospitalAddress, setHospitalAddress] = useState('');

    // Function to set the hospital address
    const setAddress = async () => {
        try {
            const accounts = await web3.eth.getAccounts(); // Get the accounts from MetaMask
            console.log("Account:", accounts[0]);
            setHospitalAddress(accounts[0]); // Set the hospital address
        } catch (error) {
            alert('Error fetching hospital address.');
        }
    }

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
                console.log(hospitalInfo[0]);
                hospitalName = hospitalInfo[0]; //* Get ang name ni hospital then salin kay var hospitalName

                // Call the smart contract function with hospital address
                const medicalHistoryString = await mvContract.methods.getAllMedicalHistory().call();
                //console.log(medicalHistoryString);
                
                const parsedMedicalHistory = medicalHistoryString.map(item => {
                    const [patientAddr, hospitalAddr, physician, diagnosis, signsAndSymptoms, treatmentProcedure, tests, medications, admission, creationDate] = item;
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
                console.log(parsedMedicalHistory);
                
                const modifiedMedicalHistory = parsedMedicalHistory.map(item => {
                    const splitDiagnosis = item.diagnosis.split('+');
                    console.log("Diagnosis:", splitDiagnosis[0]);
                    // const splitSignsAndSymptoms = item.signsAndSymptoms.split('+');
                    // console.log("Signs and Symptoms:", splitSignsAndSymptoms);
                    // const splitTreatmentProcedure = item.treatmentProcedure.split('+');
                    // console.log("Treatment Procedure:", splitTreatmentProcedure);
                    // const splitTests = item.tests.split('+');
                    // console.log("Treatment Procedure:", splitTests);
                    // const splitMedications = item.medications.split('+');
                    // console.log("Medications:", splitMedications);
                    const splitAdmission = item.admission.split('+');
                    console.log("Admission Date:", splitAdmission[2]);
                    console.log("Discharge Date:", splitAdmission[3]);
                    return {
                        hospitalName,
                        diagnosis: splitDiagnosis[0],
                        physician: item.physician,
                        admissionDate: splitAdmission[2],
                        dischargeDate: splitAdmission[3]
                    };
                });
                
                setMedicalHistory(modifiedMedicalHistory);
                console.log("Modified", modifiedMedicalHistory);
            } catch (error) {
                console.error('Error fetching medical history:', error);
            }
        }
        
        fetchMedicalHistory();
    }, [hospitalAddress]);

    return (
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
    );
};

 
export default MedicalHistoryPatient;