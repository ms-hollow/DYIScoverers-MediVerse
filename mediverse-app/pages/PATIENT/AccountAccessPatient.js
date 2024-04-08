import styles from '../../styles/accountAccess.module.css';
import Layout from '../../components/HomeSidebarHeader.js'
import fs from 'fs';
import path from 'path';
import React, { useState, useEffect } from 'react';
import web3 from "../../blockchain/web3";
import mvContract from '../../blockchain/mediverse';

/**
 * TODO: Get name, doctor and date of consultation ng mga hospitals na may access sa lahat ng record
 *  ! IN PROGRESS PA AAAA
 */

export async function getStaticProps() {
    const filePath = path.join(process.cwd(), 'public/placeHolder/dummyData_AccountAccess.json');
    const jsonData = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(jsonData);

    return {
        props: {
            data
        }
    };
}

const AccountAccessPatient = ({data}) => {

    const [patientAddress, setPatientAddress] = useState('');
    const [listOfAuthorizedHospitals, setAuthorizedHospitals] = useState([]);

    const setAddress = async () => {
        try {
            const accounts = await web3.eth.getAccounts(); // Get the accounts from MetaMask
            //console.log("Account:", accounts[0]);
            setPatientAddress(accounts[0]); 
        } catch (error) {
            alert('Error fetching hospital address.');
        }
    };
    
    useEffect(() => {
        async function authorizedHospitalList() {
            try {
                if (!patientAddress) {
                    await setAddress();
                    return;
                }

                const hospitals = await mvContract.methods.getAuthorizedHospitals(patientAddress).call();
                //console.log(hospitals);
                
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
                //console.log(parsedMedicalHistory);
                
                const filteredMedicalHistory = medicalHistoryString.filter(item => hospitals.includes(item.hospitalAddr));
                //console.log("Filtered Medical History:", filteredMedicalHistory);

                const modifiedList = filteredMedicalHistory.map(item => {
                    const splitDiagnosis = item.diagnosis.split('+');
                    const splitAdmission = item.admission.split('+');
                    return {
                        physician: item.physician,
                        dateOfConsultation: splitDiagnosis[1],
                        hospitalName: splitAdmission[1],
                        lengOfStay: splitAdmission[4],
                    };
                });
                setAuthorizedHospitals(modifiedList);
                //console.log(modifiedList)

                const hospitalRequest = await mvContract.methods.getPendingRequests(patientAddress).call();
                //console.log(hospitalRequest);
                const hospitalsInfo = [];

                for (const hospitalAddress of hospitalRequest) {
                    const hospitalInfo = await mvContract.methods.getHospitalInfo(hospitalAddress).call();
                    hospitalsInfo.push({
                        name: hospitalInfo[0],
                    });
                }
                console.log(hospitalsInfo);

            } catch (error) {
                console.error('Error fetching medical history:', error);
            }
        }
        authorizedHospitalList();
    }, [patientAddress]);


    // const handleGrantAccess = async () => {
    //     try {
    //         await mvContract.methods.givePermission(hospitalAddr).send({ from: patientAddress }); 
    //         console.log('Permission granted to hospital:', hospitalAddr);
    //     } catch (error) {
    //         console.error('Error granting permission:', error);
    //     }
    // };

    // const handleRevokeAccess = async () => {
    //     try {
    //         await mvContract.methods.revokeAccess(hospitalAddr).send({ from: patientAddress }); 
    //         console.log('Access was removed:', hospitalAddr);
    //     } catch (error) {
    //         console.error('Error revoking access:', error);
    //     }
    // };

    // const [showAccountAccess, setShowAccountAccess] = useState(true);

    // const handleAccountAccessClick = () => {
    //     setShowAccountAccess(true);
    // };

    // const handleRequestAccessClick = () => {
    //     setShowAccountAccess(false);
    // };

    // const handleRevokeAccessClick = () => {
    //     //onClick Function for Revoke Access Button
    // }

    // const handleAcceptAccessClick = () => {
    //     //onClick Function for Accept Account Access Request Button
    // }

    // const handleDeclineAccessClick = () => {
    //     //onClick Function for Decline Account Access Request Button
    // }

    // return ( 
    //     <Layout pageName="Account Access">
    //     <>
    //         <div className={styles.container}>
    //             <div className={styles.pageNavigator}>
    //                 <button className={showAccountAccess ? styles.activeButton_accAccess : ''} onClick={handleAccountAccessClick}>Account Access</button>
    //                 <button className={showAccountAccess ? '' : styles.activeButton_reqAccess} onClick={handleRequestAccessClick}>Request Access</button>
    //             </div>

    //             {showAccountAccess ? (
    //                 <div className={styles.tableContainer}>
    //                     <div className={styles.tableHeading}>
    //                         <p>Hospital Name</p>
    //                         <p>Doctor Consulted</p>
    //                         <p>Date of Consultation</p>
    //                         <p>Account Access</p>
    //                     </div>

    //                     <div className={styles.dataContainer}>
    //                         {data.map(data => (
    //                             <div key={data.id} className={styles.data}>
    //                                 <p>{data.hospitalName}</p>
    //                                 <p>{data.doctorConsulted}</p>
    //                                 <p>{data.dateConsultation}</p>
    //                                 <button onClick={handleRevokeAccessClick}>Revoke Access</button>
    //                             </div>
    //                         ))}
    //                     </div>
    //                 </div>
    //             ) : (
    //                 <div className={styles.tableContainer}>
    //                     <div className={styles.tableHeading_reqAccess}>
    //                         <p>Hospital Name</p>
    //                         <p>Account Access</p>
    //                     </div>

    //                     <div className={styles.dataContainer}>
    //                         {data.map(data => (
    //                             <div key={data.id} className={styles.data_reqAccess}>
    //                                 <p>{data.hospitalName}</p>
    //                                 <button onClick={handleAcceptAccessClick}>Accept</button>
    //                                 <button onClick={handleDeclineAccessClick}>Decline</button>
    //                             </div>
    //                         ))}
    //                     </div>
    //                 </div>
    //             )}

    //         </div>
    //     </>
    //     </Layout>
    // );
}
 
export default AccountAccessPatient;