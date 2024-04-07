import styles from '../../styles/medicalHistory.module.css';
import Layout from '../../components/HomeSidebarHeader.js'
import path from 'path';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import web3 from "../../blockchain/web3";
import mvContract from '../../blockchain/mediverse';

//! TAPOS NA 

const MedicalHistoryPatient = () => {
    const router = useRouter();
    const [medicalHistory, setMedicalHistory] = useState([]);
    const [patientAddress, setPatientAddress] = useState('');
    let hospitalAddress, hospitalName;

    const setAddress = async () => {
        try {
            const accounts = await web3.eth.getAccounts();
            console.log("Account:", accounts[0]);
            setPatientAddress(accounts[0]); 
        } catch (error) {
            alert('Error fetching patient address.');
        }
    };

    useEffect(() => {
        
        async function fetchMedicalHistory() {
            try {
                // Ensure hospital address is set before fetching medical history
                if (!patientAddress) {
                    await setAddress();
                    return;
                }

                const patientMedicalHistories = await mvContract.methods.getMedicalHistory(patientAddress).call();
                console.log(patientMedicalHistories);

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

                const hospitalInfo = await mvContract.methods.getHospitalInfo(hospitalAddress).call();    
                //console.log(hospitalInfo);
                hospitalName = hospitalInfo[0];
                //console.log(hospitalName);

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
                    console.log("Creation Date: ",item.creationDate);
                    const splitAdmission = item.admission.split('+');
                    console.log("Admission Date:", splitAdmission[2]);
                    console.log("Discharge Date:", splitAdmission[3]);
                    return {
                        hospitalName,
                        diagnosis: splitDiagnosis[0],
                        physician: item.physician,
                        admissionDate: splitAdmission[2],
                        dischargeDate: splitAdmission[3],
                        patientAddr: item.patientAddr,
                        creationDate: item.creationDate
                    };
                });
                setMedicalHistory(modifiedMedicalHistory);
                console.log("Modified", modifiedMedicalHistory);

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
    );
}
 
export default MedicalHistoryPatient;