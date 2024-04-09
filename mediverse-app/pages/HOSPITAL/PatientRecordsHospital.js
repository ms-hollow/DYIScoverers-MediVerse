import styles from '../../styles/medicalHistory.module.css';
import Layout from '../../components/HomeSidebarHeaderHospital.js'
import path from 'path';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import web3 from "../../blockchain/web3";
import mvContract from '../../blockchain/mediverse';

//* Modified

const MedicalHistoryPatient = () => {

    const router = useRouter();
    const [medicalHistory, setMedicalHistory] = useState([]);
    const [hospitalAddress, setHospitalAddress] = useState('');
    let patientAddress, patientName;

    const setAddress = async () => {
        try {
            const accounts = await web3.eth.getAccounts(); // Get the accounts from MetaMask
            console.log("Account:", accounts[0]);
            setHospitalAddress(accounts[0]); // Set the hospital address
        } catch (error) {
            alert('Error fetching hospital address.');
        }
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
                // console.log(hospitalInfo[0]);
                hospitalName = hospitalInfo[0]; //* Get ang name ni hospital then salin kay var hospitalName

                // Call the smart contract function with hospital address
                const medicalHistoryString = await mvContract.methods.getAllMedicalHistory().call();
                //console.log(medicalHistoryString);
                
                const parsedMedicalHistory = medicalHistoryString.map(item => {
                    const [patientAddr, hospitalAddr, physician, diagnosis, signsAndSymptoms, treatmentProcedure, tests, medications, admission, creationDate] = item;
                    patientAddress = patientAddr;
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
                // console.log(parsedMedicalHistory);
                
                const patientInfo = await mvContract.methods.getPatientInfo(patientAddress).call();
                //console.log(patientInfo);
                const patientNameHolder = patientInfo[0].split('+');
                patientName = `${patientNameHolder[0]} ${patientNameHolder[1]} ${patientNameHolder[2]}`;
            
                const modifiedMedicalHistory = parsedMedicalHistory.map(item => {
                    // const splitDiagnosis = item.diagnosis.split('+');
                    // console.log("Diagnosis:", splitDiagnosis[0]);
                    // const splitSignsAndSymptoms = item.signsAndSymptoms.split('+');
                    // console.log("Signs and Symptoms:", splitSignsAndSymptoms);
                    // const splitTreatmentProcedure = item.treatmentProcedure.split('+');
                    // console.log("Treatment Procedure:", splitTreatmentProcedure);
                    // const splitTests = item.tests.split('+');
                    // console.log("Treatment Procedure:", splitTests);
                    // const splitMedications = item.medications.split('+');
                    // console.log("Medications:", splitMedications);
                    //console.log("Creation Date: ",item.creationDate);
                    const splitAdmission = item.admission.split('+');
                    // console.log("Admission Date:", splitAdmission[2]);
                    // console.log("Discharge Date:", splitAdmission[3]);
                    return {
                        patientName,
                        physician: item.physician,
                        hospitalName: splitAdmission[1],
                        admissionDate: splitAdmission[2],
                        dischargeDate: splitAdmission[3],
                        lengOfStay: splitAdmission[4],
                        patientAddr: item.patientAddr,
                        creationDate: item.creationDate
                    };
                });
                setMedicalHistory(modifiedMedicalHistory);
                // console.log("Modified", modifiedMedicalHistory);
            } catch (error) {
                console.error('Error fetching medical history:', error);
            }
        }
        fetchMedicalHistory();
    }, [hospitalAddress]);

    // const clickRow = (patientAddr, creationDate) => {
    //     router.push({
    //         pathname: '/HOSPITAL/MedicalHistory1Hospital/',
    //         query: { patientAddr, creationDate }
    //     });
    // };

    const clickRow = (patientAddr, creationDate) => {
        // Construct the URL with patient address and creation date as query parameters
        const url = {
            pathname: '/HOSPITAL/MedicalHistory1Hospital',
            query: { patientAddr, creationDate }
        };
        // Navigate using Next.js router
        router.push(url);
    };

    const handleAdd = () => {
        router.push('/HOSPITAL/AddPatient/');
    };
    
    return (  
        <Layout pageName = "Patient Records">
        <>
        
            <div className={styles.container}>
                <div className={styles.tableHeading}>
                    <p>Patient Name</p>
                    <p>Hospital</p>
                    <p>Admission Date</p>
                    <p>Discharge Date</p>
                    <p>Length of Stay</p>
                </div>

                <div className={styles.dataContainer}>
                    {medicalHistory.map((record, index) => (
                        <div className={styles.data} key={index} onClick={() => clickRow(record.patientAddr, record.creationDate)}>
                            <p className={styles.diaAttrb}>{record.patientName}</p>
                            <p>{record.hospitalName}</p>
                            <p>{record.physician}</p>
                            <p>{record.admissionDate}</p>
                            <p>{record.dischargeDate}</p>
                            <p>{record.stayLength}</p>
                        </div>
                    ))}
                </div>

                <button className={styles.submitButton} onClick={handleAdd}>
                    <Link href="/HOSPITAL/AddPatient/">Add Patient</Link>
                </button>
            </div>
        </>
        </Layout>
    );
}
 
export default MedicalHistoryPatient;