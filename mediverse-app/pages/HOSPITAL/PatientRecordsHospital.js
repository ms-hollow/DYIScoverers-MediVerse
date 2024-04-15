import styles from '../../styles/medicalHistory.module.css';
import styles1 from '/styles/homeSidebarHeader.module.css';
import Layout from '../../components/HomeSidebarHeaderHospital.js'
import path from 'path';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import web3 from "../../blockchain/web3";
import mvContract from '../../blockchain/mediverse';

//? Changes: Added lines of code if the hospital is authorized to view the medical history if the patient

const MedicalHistoryPatient = () => {

    const router = useRouter();
    const [medicalHistory, setMedicalHistory] = useState([]);
    const [hospitalAddress, setHospitalAddress] = useState('');

    const setAddress = async () => {
        try {
            const accounts = await web3.eth.getAccounts();
            console.log("Account:", accounts[0]);
            setHospitalAddress(accounts[0]); 
        } catch (error) {
            alert('Error fetching hospital address.');
        }
    };

    function searchInObject(obj, term) {
        return Object.values(obj).some(value =>
            typeof value === "string" && value.toLowerCase().includes(term.toLowerCase())
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
    
                //* Retrieve the hospital currently logged in
                const hospitalInfo = await mvContract.methods.getHospitalInfo(hospitalAddress).call();
                hospitalName = hospitalInfo[0]; //* Get the hospital name
    
                // Call the smart contract function with hospital address
                const medicalHistoryString = await mvContract.methods.getAllMedicalHistory().call();
                
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
    
                // Filter medical records to include only those made by the specific hospital
                const filteredMedicalHistory = parsedMedicalHistory.filter(item => item.hospitalAddr === hospitalAddress);
    
                // Create an object to store the first medical record for each patient
                const firstMedicalRecords = {};
                filteredMedicalHistory.forEach(item => {
                    if (!firstMedicalRecords[item.patientAddr]) {
                        firstMedicalRecords[item.patientAddr] = item;
                    }
                });
    
                // Convert the object values (first medical records) to an array
                const uniqueMedicalRecords = Object.values(firstMedicalRecords);
                
                // Process each medical record to format it as needed
                const modifiedMedicalHistory = uniqueMedicalRecords.map(item => {
                    const splitAdmission = item.admission.split('+');
                    return {
                        patientAddr: item.patientAddr,
                        patientName: "", // Fetch patient name here
                        physician: item.physician,
                        hospitalName: splitAdmission[1],
                        admissionDate: splitAdmission[2],
                        dischargeDate: splitAdmission[3],
                        lengthOfStay: splitAdmission[4],
                        creationDate: item.creationDate
                    };
                });
    
                // Fetch patient names for each medical record
                const patientAddresses = modifiedMedicalHistory.map(record => record.patientAddr);
                const patientInfoPromises = patientAddresses.map(address => mvContract.methods.getPatientInfo(address).call());
                const allPatientInfo = await Promise.all(patientInfoPromises);
                allPatientInfo.forEach((info, index) => {
                    const patientNameHolder = info[0].split('+');
                    modifiedMedicalHistory[index].patientName = `${patientNameHolder[0]} ${patientNameHolder[1]} ${patientNameHolder[2]}`;
                });
    

                setMedicalHistory(modifiedMedicalHistory);

                // const searchTerm = "";
                // const results = modifiedMedicalHistory.filter(entry => searchInObject(entry, searchTerm.toLowerCase()));

                // setMedicalHistory(results);

                // if (results.length > 0) {
                //     console.log("Found:", results);
                // } else {
                //     console.log("No matching entry found.");
                // }
            } catch (error) {
                console.error('Error fetching medical history:', error);
            }
        }
        fetchMedicalHistory();
    }, [hospitalAddress]);
    
    const clickRow = async (patientAddr, creationDate) => {

        async function isHospitalAuthorized(patientAddr, hospitalAddress) {
            const authorizedHospitals = await mvContract.methods.getAuthorizedHospitals(patientAddr).call();
            return authorizedHospitals.includes(hospitalAddress);
        }
        
        const isAuthorized = await isHospitalAuthorized(patientAddr, hospitalAddress);
        console.log("Is hospital authorized?", isAuthorized);
      
       if (isAuthorized){
            router.push({
                pathname: '/HOSPITAL/MedicalHistory1Hospital/',
                query: { patientAddr, creationDate }
            });
       } else {
            alert("You don't have permission do view this record.");
            console.log("You don't have permission do view this record.");
       }
    };

    const handleAdd = () => {
        router.push('/HOSPITAL/AddPatient/');
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            
        }
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

                <div className={`${styles1.searchBar}`}> 
                    <a href="/destination-url"> <img src="/Search icon.svg" alt="Search" className={styles1.searchIcon} /> </a>
                    <input type="text" placeholder="Search" className={styles1.searchInput} />
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