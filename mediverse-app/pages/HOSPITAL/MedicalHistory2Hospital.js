import Layout from '../../components/HomeSidebarHeader.js'
import styles from '../../styles/medicalHistoryHospital.module.css';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import web3 from "../../blockchain/web3";
import mvContract from '../../blockchain/mediverse';

/**
 * TODO: Retrieve data from the blockchain then display/populate the table
 * ! Note: Bali i-reretrieve ang record then display. All data ang idi-dipslay dito
 * * nakatuple ang data na i-reretrieve, need gumawa ng function na naghihiwalay ng data at siya na bahala magpopulate ng table
 * * Lagi i-test ang smart contract sa remix then tignan kung paano ito gumagana.
 */

//* Specific Patient. Use the patient address to track kung anong record 'to. Use creationDate para ma-search ang specific record
//* Galing MedicalHistory1Hospital, pinasa ko yung address and creationDate

const MedicalHistoryHospital = () => {

    const [data, setData] = useState(null);
    const [medicalHistory, setMedicalHistory] = useState([]);
    const [hospitalAddress, setHospitalAddress] = useState('');
    const router = useRouter();
    //console.log('Router Query:', router.query);
    const { patientAddr, creationDate } = router.query; //* kunin yung data ng pinindot na row sa may MedicalHistory1Hospital

    // console.log('Patient Address:', patientAddr); 
    // console.log('Creation Date:', creationDate);

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

                let patientAddress;
                patientAddress = patientAddr;

                const patientRecords = await mvContract.methods.getMedicalHistory(patientAddress).call();
                console.log(patientRecords);
                
                //* So bali ang ginagawa dito is sa list ng medical history ni patient kinukuha yung specific record
                //* using creation date as key para masearch
                const getPatientMedicalHistory = patientRecords.filter(record => {
                    return record[9] === creationDate;
                });
                console.log(getPatientMedicalHistory);

                //* Get yung data sa array na nag equal sa may creationDate
                const parsedPatientMedicalHistory = getPatientMedicalHistory.map(item => {
                    const [patientAddr, hospitalAddr, physician, diagnosis, signsAndSymptoms, treatmentProcedure, tests, medications, admission, creationDate] = item;
                    return {
                        patientAddr: patientAddr,
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
                console.log("Patient Medical History:", parsedPatientMedicalHistory);

                //* Split ang mga data. '/' means paghihiwalay ang array kapag marami nilagay si hospital
                //* '+' means paghihiwalayin ang concatenated data sa isang array
                const modifiedPatientMedicalHistory = parsedPatientMedicalHistory.map(item => {
                    if (item.diagnosis.includes('/')) {
                        item.diagnosis = item.diagnosis.split('/').map(diagnosis => diagnosis.split('+'));
                        //console.log(item.diagnosis); 
                    } else {
                        item.diagnosis = [item.diagnosis.split('+')];
                        //console.log(item.diagnosis); 
                    }

                    if (item.signsAndSymptoms.includes('/')) {
                        item.signsAndSymptoms = item.signsAndSymptoms.split('/').map(signsAndSymptoms => signsAndSymptoms.split('+'));
                        //console.log(item.signsAndSymptoms); 
                    } else {
                        item.signsAndSymptoms = [item.signsAndSymptoms.split('+')];
                        //console.log(item.signsAndSymptoms); 
                    }

                    if (item.treatmentProcedure.includes('/')) {
                        item.treatmentProcedure = item.treatmentProcedure.split('/').map(treatmentProcedure => treatmentProcedure.split('+'));
                        //console.log(item.treatmentProcedure); // Use item.signsAndSymptoms here
                    } else {
                        item.treatmentProcedure = [item.treatmentProcedure.split('+')];
                        //console.log(item.treatmentProcedure); // Use item.signsAndSymptoms here
                    }

                    if (item.tests.includes('/')) {
                        item.tests = item.tests.split('/').map(tests => tests.split('+'));
                        //console.log(item.tests); 
                    } else {
                        item.tests = [item.tests.split('+')];
                        //console.log(item.tests); 
                    }

                    if (item.medications.includes('/')) {
                        item.medications= item.medications.split('/').map(medications => medications.split('+'));
                        //console.log(item.medications); 
                    } else {
                        item.medications = [item.medications.split('+')];
                        //console.log(item.medications); 
                    }

                    if (item.admission.includes('/')) {
                        item.admission = item.admission.split('/').map(admission => admission.split('+'));
                        //console.log(item.admission); 
                    } else {
                        item.admission = [item.admission.split('+')];
                        //console.log(item.admission); 
                    }
                    return {
                        diagnosis: item.diagnosis,
                        signsAndSymptoms: item.signsAndSymptoms,
                        treatmentProcedure: item.treatmentProcedure,
                        tests: item.tests,
                        medications: item.medications,
                        admission: item.admission,
                        patientAddr: item.patientAddr,
                        creationDate: item.creationDate
                    };
                    
                });
                console.log("Modified Patient Medical History:", modifiedPatientMedicalHistory);

                //* Array kung saan i-store ang mga pinaghiwalay hiwalay na data
                //! Important para sa pagpopulate ng table. 
                const diagnosisNames = [];
                const dateOfDiagnoses = [];
                const diagnosisDescriptions = [];

                const symptomNames = []; 
                const symptomDuration = []; 
                const symptomSeverity = []; 
                const symptomLocation = [];

                const tpName = []; 
                const tpMedicalProvider = []; 
                const tpDateStarted = []; 
                const tpDateEnd = []; 
                const tpDuration = [];

                const testType = []; 
                const testOrderingPhysician = []; 
                const testDate = []; 
                const testReviewingPhysician = []; 
                const testResult = [];

                const medicationName = []; 
                const prescriptionDate = []; 
                const prescribingPhysician = []; 
                const medicationFrequency = []; 
                const medicationDuration = []; 
                const medicationEndDate = [];

                const admissionHospitalName = [];  
                const aadmissionDate = []; 
                const adischargeDate = []; 
                const lengthOfStay = [];

                //* Ang ginagawa nito ay hinihiwalay hiwalay niya ang laman ng array then s-store niya sa kanya kanyang variable
                //? Purose nito? Diba sa isang variable for example, signAndSymptoms, kapag nag add ka ng maraming data mahirap i-populate
                //? 'yon sa table and hindi rin siya directly kasi meron silang kanya kanyang lugar na pagdidisplayan
                modifiedPatientMedicalHistory.forEach(item => {
                    
                    if (Array.isArray(item.diagnosis)) {
                        item.diagnosis.forEach(array => {
                            const [diagnosisName, dateOfDiagnosis, diagnosisDescription] = array;
                            diagnosisNames.push(diagnosisName);
                            dateOfDiagnoses.push(dateOfDiagnosis);
                            diagnosisDescriptions.push(diagnosisDescription);
                        });
                    }
                
                    if (Array.isArray(item.signsAndSymptoms)) {
                        item.signsAndSymptoms.forEach(array => {
                            const [_, symptomName, duration, severity, location] = array;
                            symptomNames.push(symptomName);
                            symptomDuration.push(duration);
                            symptomSeverity.push(severity);
                            symptomLocation.push(location);
                        });
                    }

                    if (Array.isArray(item.treatmentProcedure)) {
                        item.treatmentProcedure.forEach(array => {
                            const [name, medicalProvider, dateStarted, dateEnd, duration] = array;
                            tpName.push(name);
                            tpMedicalProvider.push(medicalProvider);
                            tpDateStarted.push(dateStarted);
                            tpDateEnd.push(dateEnd);
                            tpDuration.push(duration);
                        });
                    }
                
                    if (Array.isArray(item.tests)) {
                        item.tests.forEach(array => {
                            const [type, orderingPhysician, date, reviewingPhysician, result] = array;
                            testType.push(type);
                            testOrderingPhysician.push(orderingPhysician);
                            testDate.push(date);
                            testReviewingPhysician.push(reviewingPhysician);
                            testResult.push(result);
                        });
                    }
                
                    if (Array.isArray(item.medications)) {
                        item.medications.forEach(array => {
                            const [name, date, physician, frequency, duration, endDate] = array;
                            medicationName.push(name);
                            prescriptionDate.push(date);
                            prescribingPhysician.push(physician);
                            medicationFrequency.push(frequency);
                            medicationDuration.push(duration);
                            medicationEndDate.push(endDate);
                        });
                    }
                
                    if (Array.isArray(item.admission)) {
                        item.admission.forEach(array => {
                            const [hospitalName, admissionDate, dischargeDate, stayLength] = array;
                            admissionHospitalName.push(hospitalName);
                            aadmissionDate.push(admissionDate);
                            adischargeDate.push(dischargeDate);
                            lengthOfStay.push(stayLength);
                        });
                    }
                });

                console.log(diagnosisNames);
                console.log(dateOfDiagnoses);
                console.log(diagnosisDescriptions);

                console.log(symptomNames);
                console.log(symptomDuration);
                console.log(symptomSeverity);
                console.log(symptomLocation);

                console.log(tpName);
                console.log(tpMedicalProvider);
                console.log(tpDateStarted);
                console.log(tpDateEnd);
                console.log(tpDuration);

                console.log(testType);
                console.log(testOrderingPhysician);
                console.log(testDate);
                console.log(testReviewingPhysician);
                console.log(testResult);
                
                console.log(medicationName);
                console.log(prescriptionDate);
                console.log(prescribingPhysician);
                console.log(medicationFrequency);
                console.log(medicationDuration);
                console.log(medicationEndDate);

                console.log(admissionHospitalName);
                console.log(aadmissionDate);
                console.log(adischargeDate);
                console.log(lengthOfStay);
                
            } catch (error) {
                console.error('Error fetching medical history:', error);
            }
        }
        
        fetchMedicalHistory();
    }, [hospitalAddress]);

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch('/placeHolder/dummyData_MedicalHistory_Hospital.json');
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
        <Layout pageName="Medical History">
        <>
            <div className={styles.container}>      
                <div className={styles.reserveSpace}></div>
                <div className={styles.basicInfoContainer}>
                    <div className={styles.headingAttrb_formatting}>
                        <p className={styles.headingAttrb}>Doctor Consulted</p>   
                        <p className={styles.dataFormat}>{data.basicInfo.doctor}</p>
                        <p className={styles.doctorTypeFormat}>{data.basicInfo.doctorType}</p>
                    </div>
                    <div className={styles.headingAttrb_formatting}>
                        <p className={styles.headingAttrb}>Date of Diagnosis</p>  
                        <p className={styles.dataFormat}>{data.basicInfo.dateDiagnosis}</p> 
                    </div>
                    <div className={styles.headingAttrb_formatting}>
                        <p className={styles.headingAttrb}>Diagnosis</p>   
                        <p className={styles.dataFormat_diag}>{data.basicInfo.diagnosis}</p> 
                    </div>
                    <div className={styles.headingAttrb_des}>
                        <p className={styles.headingAttrb}>Description</p>   
                        <p className={styles.dataFormat_des}>{data.basicInfo.description}</p> 
                    </div>
                </div>
        
                <div className={styles.table_container}>
                    <p className={styles.table_title}>Signs and Symptoms</p>
                    <div className={styles.sANDs_heading}>
                        <p>Symptoms</p>
                        <p>Duration</p>
                        <p>Severity</p>
                        <p>Location</p>
                    </div>

                    <div className={styles.scrollableTable_container}>
                        {data.signsAndSymptoms.map(data => (
                            <div key={data.sANDs_ID} className={styles.sANDs_data}>
                                <p>{data.symptoms}</p>
                                <p>{data.duration}</p>
                                <p>{data.severity}</p>
                                <p>{data.location}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.table_container}>
                    <p className={styles.table_title}>Treatment/Procedure</p>
                    <div className={styles.treatment_heading}>
                        <p>Treatment/Procedure</p>
                        <p>Medical Team/Provider</p>
                        <p>Date Started</p>
                        <p>Date End</p>
                        <p>Duration</p>
                    </div>

                    <div className={styles.scrollableTable_container}>
                        {data.treatment.map(data => (
                            <div key={data.treatment_ID} className={styles.treatment_data}>
                                <p>{data.treatment}</p>
                                <p>{data.medicalTeam}</p>
                                <p>{data.dateStarted}</p>
                                <p>{data.dateEnd}</p>
                                <p>{data.duration}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.table_container}>
                    <p className={styles.table_title}>Test</p>
                    <div className={styles.test_heading}>
                        <p>Type of Test</p>
                        <p>Ordering Physician</p>
                        <p>Date</p>
                        <p>Reviewing Physician</p>
                        <p>Result</p>
                    </div>

                    <div className={styles.scrollableTable_container}>
                        {data.test.map(data => (
                            <div key={data.test_ID} className={styles.test_data}>
                                <p>{data.testType}</p>
                                <p>{data.orderingPhysician}</p>
                                <p>{data.date}</p>
                                <p>{data.reviewingPhysician}</p>
                                <p>{data.result}</p>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className={styles.table_container}>
                    <p className={styles.table_title}>Medication</p>
                    <div className={styles.medication_heading}>
                        <p>Medication</p>
                        <p>Date of Prescription</p>
                        <p>Prescribing Physician</p>
                        <p>Frequency</p>
                        <p>Duration</p>
                        <p>End Date</p>
                    </div>

                    <div className={styles.scrollableTable_container}>
                        {data.medication.map(data => (
                            <div key={data.medication_ID} className={styles.medication_data}>
                                <p>{data.medicationType}</p>
                                <p>{data.prescriptionDate}</p>
                                <p>{data.prescribingPhysician}</p>
                                <p>{data.frequency}</p>
                                <p>{data.duration}</p>
                                <p>{data.endDate}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.table_container}>
                    <p className={styles.table_title}>Admission</p>
                    <div className={styles.sANDs_heading}>
                        <p>Hospital</p>
                        <p>Admission Date</p>
                        <p>Discharge Date</p>
                        <p>Length of Stay</p>
                    </div>

                    <div className={styles.scrollableTable_container}>
                        {data.admission.map(data => (
                            <div key={data.admission_ID} className={styles.sANDs_data}>
                                <p>{data.hospital}</p>
                                <p>{data.admissionDate}</p>
                                <p>{data.dischargeDate}</p>
                                <p>{data.lengthOfStay}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
        </Layout>
     );
}
 
export default MedicalHistoryHospital;