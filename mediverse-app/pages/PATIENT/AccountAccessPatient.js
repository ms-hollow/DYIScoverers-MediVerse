import styles from '../../styles/accountAccess.module.css';
import Layout from '../../components/HomeSidebarHeader.js'
// import fs from 'fs';
import path from 'path';
import React, { useState, useEffect } from 'react';
import web3 from "../../blockchain/web3";
import mvContract from '../../blockchain/mediverse';
import ToastWrapper from "@/components/ToastWrapper";
import { toast } from 'react-toastify';

//! Done with the process sa buttons
//TODO: Needs to update yung table kapag nabigyan na ng access
//! HINDI PA MAAYOS CONTRACT

const AccountAccessPatient = () => {

    const [patientAddress, setPatientAddress] = useState('');
    const [listOfAuthorizedHospitals, setAuthorizedHospitals] = useState([]);
    const [listOfHospitalNames, setHospitalNames] = useState([]);
    const [listOfRequestingHospital, setRequestingHospital] = useState([]);
    const [hospitalAddress, setHospitalAddress] = useState('');
    const [grantAccess, setGrantAccess] = useState(false); 
    const [revokeAccess, setRevokeAccess] = useState(false); 

    const setAddress = async () => {
        try {
            const accounts = await web3.eth.getAccounts(); // Get the accounts from MetaMask
            //console.log("Account:", accounts[0]);
            setPatientAddress(accounts[0]); 
        } catch (error) {
            toast.error('Error fetching hospital address.');
        }
    };

    useEffect(() => {
        async function authorizedHospitalList() {
            try {
                if (!patientAddress) {
                    await setAddress();
                    return;
                }
    
                const authorizedHospitals = await mvContract.methods.getAuthorizedHospitals(patientAddress).call();
                console.log("Authorized Hospitals:", authorizedHospitals);
    
                const medicalHistoryString = await mvContract.methods.getAllMedicalHistory().call();
                // Filter medical history records to include only those made by the currently logged-in patient
                const filteredMedicalHistory = medicalHistoryString.filter(item => item.patientAddr === patientAddress);
                //console.log("Filtered Medical History:", filteredMedicalHistory);
    
                const firstMedicalRecords = {};
                filteredMedicalHistory.forEach(item => {
                    if (!firstMedicalRecords[item.patientAddr]) {
                        firstMedicalRecords[item.patientAddr] = [];
                    }
                    firstMedicalRecords[item.patientAddr].push(item);
                });
    
                const uniqueMedicalRecords = Object.values(firstMedicalRecords);
    
                const modifiedList = uniqueMedicalRecords.map(medicalRecords => {
                    return medicalRecords.map(item => {
                        const splitDiagnosis = item.diagnosis.split('+');
                        const splitAdmission = item.admission.split('+');
                        return {
                            physician: item.physician,
                            hospitalAddress: item.hospitalAddr,
                            dateOfConsultation: splitDiagnosis[1],
                            hospitalName: splitAdmission[1],
                            lengthOfStay: splitAdmission[4],
                        };
                    });
                }).flat();
    
                // Filter out hospitals that are not in the authorized list
                const authorizedModifiedList = modifiedList.filter(item => authorizedHospitals.includes(item.hospitalAddress));
                setAuthorizedHospitals(authorizedModifiedList);
                //console.log("Authorized Hospitals: ", authorizedModifiedList);
    
                const hospitalRequest = await mvContract.methods.getPendingRequests(patientAddress).call();
                setRequestingHospital(hospitalRequest);
                console.log("Pending Request: ", hospitalRequest);  
    
                const hospitalsInfo = [];
                for (const hospitalAddress of hospitalRequest) {
                    const hospitalInfo = await mvContract.methods.getHospitalInfo(hospitalAddress).call();
                    hospitalsInfo.push({
                        name: hospitalInfo[0],
                    });
                }
                console.log("Requesting Hospitals: ", hospitalsInfo);
                setHospitalNames(hospitalsInfo);
            } catch (error) {
                console.error('Error fetching medical history:', error);
            }
        }
        authorizedHospitalList();
    
    }, [patientAddress, grantAccess, revokeAccess]);
    
    const handleGrantAccess = async (index) => {
        try {
            // Ensure the index is within bounds
            if (index < 0 || index >= listOfRequestingHospital.length) {
                console.error('Error: Index out of bounds.');
                return;
            }
    
            // Extract hospitalAddress from the array
            const hospitalAddress = listOfRequestingHospital[index];
    
            // Ensure patientAddress is set correctly
            if (!patientAddress) {
                console.error('Error: patientAddress is undefined or empty.');
                return;
            }
    
            // Call the contract function
            await mvContract.methods.givePermission(hospitalAddress).send({ from: patientAddress });
            console.log('Permission granted to hospital:', hospitalAddress);
    
            // After granting access, set the grantAccess state to trigger a refresh
            setGrantAccess(prevState => !prevState); // Toggle grantAccess state
        } catch (error) {
            console.error('Error granting permission:', error);
        }
    };
    
    const handleRevokeAccess = async (index) => {
        try {
            const hospitalAddress = listOfAuthorizedHospitals[index].hospitalAddress; // Get the hospital address based on the index
            console.log("Revoke Address: ", hospitalAddress);
            await mvContract.methods.revokeAccess(hospitalAddress).send({ from: patientAddress });
            console.log('Access was removed:', hospitalAddress);
            toast.info('Access was removed:', hospitalAddress);
            // After revoking access, set the revokeAccess state to trigger a refresh
            setRevokeAccess(prevState => !prevState); // Toggle revokeAccess state
        } catch (error) {
            console.error('Error revoking access:', error);
        }
    };

    const [showAccountAccess, setShowAccountAccess] = useState(true);

    const handleAccountAccessClick = () => {
        setShowAccountAccess(true);
    };

    const handleRequestAccessClick = () => {
        setShowAccountAccess(false);
    };

    return ( 
        <Layout pageName="Account Access">
        <>
            <div className={styles.container}>
                <div className={styles.pageNavigator}>
                    <button className={showAccountAccess ? styles.activeButton_accAccess : ''} onClick={handleAccountAccessClick}>Authorized Hospitals</button>
                    <button className={showAccountAccess ? '' : styles.activeButton_reqAccess} onClick={handleRequestAccessClick}>Pending Request</button>
                </div>

                {showAccountAccess ? (
                    <div className={styles.tableContainer}>
                        <div className={styles.tableHeading}>
                            <p>Hospital Name</p>
                            <p>Doctor Consulted</p>
                            <p>Date of Consultation</p>
                            <p>Account Access</p>
                        </div>

                        <div className={styles.dataContainer}>
                            {listOfAuthorizedHospitals.map((item, index) => (
                                <div key={index} className={styles.data}>
                                    <p>{item.hospitalName}</p>
                                    <p>{item.physician}</p>
                                    <p>{item.dateOfConsultation}</p>
                                    <button onClick={() => handleRevokeAccess(index)}>Revoke Access</button>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className={styles.tableContainer}>
                        <div className={styles.tableHeading_reqAccess}>
                            <p>Hospital Name</p>
                            <p>Account Access</p>
                        </div>

                        <div className={styles.dataContainer}>
                            {listOfHospitalNames.map((hospital, index) => (
                                <div key={index} className={styles.data_reqAccess}>
                                    <p>{hospital.name}</p>
                                    <button onClick={() => handleGrantAccess(index)}>Grant Access</button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
            </div>
            <ToastWrapper/>
            
        </>
        </Layout>
    );
}
 
export default AccountAccessPatient;