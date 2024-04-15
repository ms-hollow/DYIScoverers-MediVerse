import styles from '../../styles/homePatient.module.css'
import Layout from '../../components/HomeSidebarHeader.js'
import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import web3 from "../../blockchain/web3";
import mvContract from '../../blockchain/mediverse';

export async function getStaticProps() {
    const filePath1 = path.join(process.cwd(), 'public/placeHolder/dummyData_HomePatient.json');
    const jsonData1 = fs.readFileSync(filePath1, 'utf8');
    const data1 = JSON.parse(jsonData1);

    const filePath2 = path.join(process.cwd(), 'public/placeHolder/dummyData_notifHome.json');
    const jsonData2 = fs.readFileSync(filePath2, 'utf8');
    const data2 = JSON.parse(jsonData2);

    return {
        props: {
            data1, data2
        }
    };
}

const HomePatient = ({ data1, data2 }) => {

    const router = useRouter();
    const [medicalHistory, setMedicalHistory] = useState([]);
    const [listOfHospitalNames, setHospitalNames] = useState([]);
    const [updatedMedicalHistory, setUpdatedMedicalHistory] = useState([]);
    const [patientAddress, setPatientAddress] = useState('');
    const [patientName, setPatientName] = useState('');
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
                if (!patientAddress) {
                    await setAddress();
                    return;
                }

                const patientInfo = await mvContract.methods.getPatientInfo(patientAddress).call();
                //console.log(patientInfo);
                const patientNameHolder = patientInfo[0].split('+');
                let patientHolder = `${patientNameHolder[0]} ${patientNameHolder[1]} ${patientNameHolder[2]}`;
                setPatientName(patientHolder);

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
                hospitalName = hospitalInfo[0];
                //console.log(hospitalName);

                const modifiedMedicalHistory = parsedMedicalHistory.map(item => {
                    const splitDiagnosis = item.diagnosis.split('+');
                    console.log("Diagnosis:", splitDiagnosis[0]);
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
                //console.log("Modified", modifiedMedicalHistory);

                // Sort the medical history by creation date in descending order
                modifiedMedicalHistory.sort((a, b) => b.creationDate - a.creationDate);

                // Get the latest medical record
                const latestMedicalRecord = modifiedMedicalHistory[0];
                console.log("Latest Medical Record:", latestMedicalRecord);
                setMedicalHistory(modifiedMedicalHistory);
                
                const hospitalRequest = await mvContract.methods.getPendingRequests(patientAddress).call();
                const hospitalsInfo = [];
                for (const hospitalAddress of hospitalRequest) {
                    const hospitalInfo = await mvContract.methods.getHospitalInfo(hospitalAddress).call();
                    hospitalsInfo.push({
                        name: hospitalInfo[0],
                    });
                }
                console.log("Requesting Hospitals: ", hospitalsInfo);
                setHospitalNames(hospitalsInfo)

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
        <Layout pageName="Home">
        <>
            <div className={styles.container}>
                <div className={styles.welcomeText}>
                    <p>Welcome Back, {patientName}</p> 
                </div>

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

                <div className={styles.notifContainer}>
                    <div className={styles.notifSection_header}>
                        <div className={styles.notifTitle}>
                            <img src="/bell.svg" alt="bell-icon"/>
                            <p>Notifications</p>
                        </div>
                        <div className={styles.threeDot}>
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                    </div>
                    
                    <div className={styles.tableContainer}>
                        {data2.map(data => (
                            <Link href="/" key={data.id} className={styles.notifDataContainer}>
                                <p className={styles.icon}>{data.icon && <img src={data.icon}/>}</p>
                                <p className={styles.notifTypeFormat}>{data.notificationType}</p>
                                <p className={styles.desFormat}>{data.description}</p>
                                <p className={styles.timeStampFormat}>{data.timeStamp}</p>
                            </Link>
                        ))}
                    </div>
                    
                </div>
            </div>
        </>
        </Layout>
     );
}
 
export default HomePatient;