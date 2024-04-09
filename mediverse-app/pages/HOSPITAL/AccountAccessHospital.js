import styles from '../../styles/accountAccess.module.css';
import Layout from '../../components/HomeSidebarHeader.js'
import React, { useState, useEffect  } from 'react';
import { useRouter } from 'next/router';
import web3 from "../../blockchain/web3";
import mvContract from '../../blockchain/mediverse';

const AccountAccessHospital = () => {
    //! DAPAT MAGKACONNECT ITO AT NASA PATIENT
    //TODO: Get lahat ng record and check if may permission si hospital (IDK IF POSSIBLE!)
    //TODO: Display ito (NOT POSSIBLE!)
    //TODO: Palitan ang view records ng request access buttons (IDK IF POSSIBLE!)
    //! DAPAT LIST NG MEDICAL RECORD NA WALANG PERMISSION (IDK POSSIBLE!)

    const [medicalHistory, setMedicalHistory] = useState([]);
    const [hospitalAddress, setHospitalAddress] = useState('');
    let patientAddress, patientName;

    // Function to set the hospital address
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
                // Ensure hospital address is set before fetching medical history
                if (!hospitalAddress) {
                    await setAddress();
                    return;
                }

                const medicalHistoryString = await mvContract.methods.getAllMedicalHistory().call();
                const unauthorizedHospitals = [];

                for (const medicalHistory of medicalHistoryString) {
                    const patientAddress = medicalHistory.patientAddr;

                    // Check if the hospital is authorized to access the patient's records
                    const isAuthorized = await mvContract.methods.isHospitalAuthorized(patientAddress, hospitalAddress).call();

                    if (!isAuthorized) {
                        unauthorizedHospitals.push(patientAddress);
                    }
                }

                console.log(unauthorizedHospitals);
                
                const parsedMedicalHistory = medicalHistoryString.map(item => {
                    const [patientAddr, hospitalAddr, physician, diagnosis, signsAndSymptoms, treatmentProcedure, tests, medications, admission, creationDate] = item;
                    patientAddress = patientAddr;
                    return {
                        hospitalAddr,
                        diagnosis,
                    };
                });
                console.log(parsedMedicalHistory);

                const patientInfo = await mvContract.methods.getPatientInfo(patientAddress).call();
                const patientNameHolder = patientInfo[0].split('+');
                patientName = `${patientNameHolder[0]} ${patientNameHolder[1]} ${patientNameHolder[2]}`;

                // //? Function that will filter the medical history 
                // const filteredMedicalHistory = parsedMedicalHistory.filter(item => item.hospitalAddr === hospitalAddress);
                
                const filteredMedicalHistory = parsedMedicalHistory.filter(item => {
                    // Check if the hospital is not authorized to access this medical record
                    return !isHospitalAuthorized(item.patientAddr, hospitalAddress);
                });

                const modifiedMedicalHistory = filteredMedicalHistory.map(item => {
                    const splitDiagnosis = item.diagnosis.split('+');
                    console.log("Diagnosis:", splitDiagnosis[1]);
                    return {
                        patientName,
                        diagnosis: splitDiagnosis[1],
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

    const [showAccountAccess, setShowAccountAccess] = useState(true);

    const handleAccountAccessClick = () => {
        setShowAccountAccess(true);
    };

    const handleRequestAccessClick = () => {
        setShowAccountAccess(false);
    };

    const handleRevokeAccessClick = () => {
        //onClick Function for Revoke Access Button
    }

    const handleAcceptAccessClick = () => {
        //onClick Function for Accept Account Access Request Button
    }

    const handleDeclineAccessClick = () => {
        //onClick Function for Decline Account Access Request Button
    }


    //for fetching dummy data
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch('/placeHolder/dummyData_AccountAccessHospital.json');
            const json = await res.json();
            const item = json.find(item => item.id === 1); // Filter data for ID 1
            setData(item);
        };

        fetchData();
    }, []);

    if (!data) {
        return <div>Loading...</div>;
    }

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

                        <div className={styles.dataContainer}>
                            {data.accountAccess.map(data => (
                                <div key={data.accountAccess_ID} className={styles.data_hospital}>
                                    <p>{data.patientName}</p>
                                    <p>{data.dateConsultation}</p>
                                    <button onClick={handleRevokeAccessClick}>View Medical Records</button>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className={styles.tableContainer}>
                        <div className={styles.tableHeading_reqAccess_hospital}>
                            <p>Patient Name</p>
                            <p>Status of Account Access</p>
                        </div>

                        <div className={styles.dataContainer}>
                            {data.requestAccess.map(data => (
                                <div key={data.request_ID} className={styles.data_reqAccess}>
                                    <p>{data.patientName}</p>
                                    <p>{data.status}</p>
                                    <button onClick={handleAcceptAccessClick}>Add Patient</button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </>
        </Layout>
    );
}
 
export default AccountAccessHospital;;