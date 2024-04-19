import styles from '../../styles/accountAccess.module.css';
import Layout from '../../components/HomeSidebarHeader.js'
import React, { useState, useEffect  } from 'react';
import { useRouter } from 'next/router';
import web3 from "../../blockchain/web3";
import mvContract from '../../blockchain/mediverse';
import ToastWrapper from "@/components/ToastWrapper";
import { toast } from 'react-toastify';

//! Done with the process sa buttons
//TODO: Needs to update yung table kapag nabigyan na ng access
//* Note abby, once na detect na grant ang access, mareremove na siya sa list ng pendingRequest
//* Para sa notification, kukunin lang don kung grant ba ang access or nirevoke ni patient.

const AccountAccessHospital = () => {

    const router = useRouter();
    const [hospitalAddress, setHospitalAddress] = useState('');
    const [authorizedList, setAuthorizedList] = useState([]);
    const [unauthorizedList, setUnauthorizedList] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [patientAddress, setPatientAddress] = useState('');
    const [requestPermission, setRequestPermission] = useState(false); 
    const [sentRequestPatients, setSentRequestPatients] = useState([]);

    const setAddress = async () => {
        try {
            const accounts = await web3.eth.getAccounts(); // Get the accounts from MetaMask
            //console.log("Account:", accounts[0]);
            setHospitalAddress(accounts[0]); // Set the hospital address
        } catch (error) {
            toast.error('Error fetching hospital address.');
        }
    };

    useEffect(() => {
        async function authorizedPatientList() {
            try {
                if (!hospitalAddress) {
                    await setAddress();
                    return;
                }
    
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
                
                const firstMedicalRecords = {};
                filteredMedicalHistory.forEach(item => {
                    if (!firstMedicalRecords[item.patientAddr]) {
                        firstMedicalRecords[item.patientAddr] = item;
                    }
                });

                const uniqueMedicalRecords = Object.values(firstMedicalRecords);

                const modifiedMedicalHistoryPromises = uniqueMedicalRecords.map(async item => {
                    let patientAddress = item.patientAddr;
                    const patientAddr = item.patientAddr;
                    const creationDate = item.creationDate;
                    setPatientAddress(patientAddress);
                    async function isHospitalAuthorized(patientAddress, hospitalAddress) {
                        const authorizedHospitals = await mvContract.methods.getAuthorizedHospitals(patientAddress).call();
                        return authorizedHospitals.includes(hospitalAddress);
                    }
                
                    const isAuthorized = await isHospitalAuthorized(patientAddress, hospitalAddress);
                    // console.log("Is hospital authorized?", isAuthorized);
                
                    if (isAuthorized) {
                        const splitAdmission = item.admission.split('+');
                        const splitDiagnosis = item.diagnosis.split('+');
                
                        const patientInfo = await mvContract.methods.getPatientInfo(item.patientAddr).call();
                        const patientNameHolder = patientInfo[0].split('+');
                        const patientName = `${patientNameHolder[0]} ${patientNameHolder[1]} ${patientNameHolder[2]}`;
                        
                        return {
                            patientAddr,
                            patientName,
                            dateConsultation: splitDiagnosis[1],
                            // hospitalName: splitAdmission[1],
                            // admissionDate: splitAdmission[2],
                            // dischargeDate: splitAdmission[3],
                            // lengthOfStay: splitAdmission[4],
                            creationDate
                        };
                    } else {
                        return null;
                    }
                });
                
                const modifiedMedicalHistory = await Promise.all(modifiedMedicalHistoryPromises);
                const authorizedMedicalHistory = modifiedMedicalHistory.filter(record => record !== null);
                setAuthorizedList(authorizedMedicalHistory);
                // console.log("Processed Medical History:", authorizedMedicalHistory);
            } catch (error) {
                console.error('Error fetching medical history:', error);
            }
        }
        authorizedPatientList();
    }, [hospitalAddress]);

    useEffect(() => {
        async function unauthorizedPatientList() {
            try {
                if (!hospitalAddress) {
                    await setAddress();
                    return;
                }
        
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
                
                const firstMedicalRecords = {};
                filteredMedicalHistory.forEach(item => {
                    if (!firstMedicalRecords[item.patientAddr]) {
                        firstMedicalRecords[item.patientAddr] = item;
                    }
                });
        
                const uniqueMedicalRecords = Object.values(firstMedicalRecords);
                
                const modifiedMedicalHistoryPromises = uniqueMedicalRecords.map(async item => {
                    let patientAddress = item.patientAddr;
                    const patientAddr = item.patientAddr;
                    const creationDate = item.creationDate;
        
                    async function isHospitalAuthorized(patientAddress, hospitalAddress) {
                        const authorizedHospitals = await mvContract.methods.getAuthorizedHospitals(patientAddress).call();
                        return authorizedHospitals.includes(hospitalAddress);
                    }
        
                    const isAuthorized = await isHospitalAuthorized(patientAddress, hospitalAddress);
                    console.log("Is hospital authorized?", isAuthorized);
        
                    if (!isAuthorized) {
                        const patientInfo = await mvContract.methods.getPatientInfo(item.patientAddr).call();
                        const patientNameHolder = patientInfo[0].split('+');
                        const patientName = `${patientNameHolder[0]} ${patientNameHolder[1]} ${patientNameHolder[2]}`;
                        
                        const pendingRequests = await mvContract.methods.getPendingRequests(patientAddr).call();
                        const hasPendingRequest = pendingRequests.includes(hospitalAddress) || sentRequestPatients.includes(patientAddr);
                        const status = hasPendingRequest ? 'Pending' : '';
                        setPendingRequests(status);
                        return {
                            patientAddr,
                            patientName,
                            unauthorized: true,
                            hasPermission: false, // Assume initially no permission
                            creationDate,
                            status
                        };
                    
                    } else {
                            // Otherwise, return the record
                            const splitAdmission = item.admission.split('+');
                            const splitDiagnosis = item.diagnosis.split('+');
                            const patientInfo = await mvContract.methods.getPatientInfo(item.patientAddr).call();
                            const patientNameHolder = patientInfo[0].split('+');
                            const patientName = `${patientNameHolder[0]} ${patientNameHolder[1]} ${patientNameHolder[2]}`;
        
                            return {
                                patientAddr,
                                patientName,
                                dateConsultation: splitDiagnosis[1],
                                creationDate
                            };
                    }
                });
                const modifiedMedicalHistory = await Promise.all(modifiedMedicalHistoryPromises);
                const unauthorizedMedicalHistory = modifiedMedicalHistory.filter(record => record && record.unauthorized);
                setUnauthorizedList(unauthorizedMedicalHistory.filter(record => record !== null));
                console.log("Unauthorized Medical History:", unauthorizedMedicalHistory);
                
            } catch (error) {
                console.error('Error fetching medical history:', error);
            }
        }
        unauthorizedPatientList();
    }, [hospitalAddress, requestPermission]);

    const handleRequest = async (patientAddr) => {
        try {
            const pendingRequests = await mvContract.methods.getPendingRequests(patientAddr).call();
            const hasPending = pendingRequests.includes(hospitalAddress);
    
            if (hasPending || sentRequestPatients.includes(patientAddr)) {
                console.log('Hospital already has a pending request for this patient.');
            } else {
                await mvContract.methods.requestPermission(patientAddr).send({ from: hospitalAddress });
                console.log('Access requested to:', patientAddr);
                setPendingRequests('Pending');
                toast.success("Request Sent!");
                setRequestPermission(true);
                setSentRequestPatients([...sentRequestPatients, patientAddr]);
            }
        } catch (error) {
            console.error('Error requesting access:', error);
            console.log('Error requesting access');
        }
    };

    const handleViewMedicalHistory = async (patientAddr, creationDate) => {
        router.push({
            pathname: '/HOSPITAL/MedicalHistory1Hospital/',
            query: { patientAddr, creationDate }
        });
    }

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
                    <button className={showAccountAccess ? styles.activeButton_accAccess : ''} onClick={handleAccountAccessClick}>Account Access</button>
                    <button className={showAccountAccess ? '' : styles.activeButton_reqAccess} onClick={handleRequestAccessClick}>Request Access</button>
                </div>

                {showAccountAccess ? (
                    <div className={styles.tableContainer}>
                        <div className={styles.tableHeading_hospital}>
                            <p>Patient Name</p>
                            <p>Date of Consultation</p>
                            <p>Account Access</p>
                        </div>

                        {authorizedList.map((data, index) => (
                            <div key={`${data.patientAddr}-${index}`} className={styles.data_hospital}>
                                <p>{data.patientName}</p>
                                <p>{data.dateConsultation}</p>
                                <button onClick={() => handleViewMedicalHistory(data.patientAddr, data.creationDate)}>View Medical Records</button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={styles.tableContainer}>
                        <div className={styles.tableHeading_reqAccess_hospital}>
                            <p>Patient Name</p>
                            <p>Status of Account Access</p>
                        </div>

                        <div className={styles.dataContainer}>
                            {unauthorizedList.map(data => (
                                <div key={data.patientAddr} className={styles.data_reqAccess}>
                                    <p>{data.patientName}</p>
                                    <p>{data.status}</p>
                                    <button onClick={() => handleRequest(data.patientAddr)}>Request</button>
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
 
export default AccountAccessHospital;