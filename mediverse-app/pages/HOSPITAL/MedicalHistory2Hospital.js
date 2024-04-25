import Layout from '../../components/HomeSidebarHeaderHospital.js'
import styles from '../../styles/medicalHistoryHospital.module.css';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import web3 from "../../blockchain/web3";
import mvContract from '../../blockchain/mediverse';
import ToastWrapper from "@/components/ToastWrapper";
import { toast } from 'react-toastify';

//TODO: Lagay ng comment for notifcation message
//TODO: Get patient info and display ito sa history

//! Specific Patient. Use the patient address to track kung anong record 'to. Use creationDate para ma-search ang specific record
//! Galing MedicalHistory1Hospital, pinasa ko yung address and creationDate

const MedicalHistoryHospital = () => {

    const [hospitalAddress, setHospitalAddress] = useState('');
    const [hospitalAddrInHistory, sethospitalAddrInHistory] = useState('');
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const { patientAddr, creationDate } = router.query; //* kunin yung data ng pinindot na row sa may MedicalHistory1Hospital

    //? Itong const sa baba, nag lagay ako nito para ma-access sa frontend ang data.
    const [medicalHistory, setMedicalHistory] = useState({
        patientName: '',
        patientAge: '',
        patientDob: '',
        patientGender: '',
        hospitalName: '',
        physicianName: '',
        diagnosis: {
            names: [],
            dates: [],
            descriptions: []
        },
        symptoms: {
            names: [],
            duration: [],
            severity: [],
            location: []
        },
        treatmentProcedure: {
            names: [],
            medicalProviders: [],
            dateStarted: [],
            dateEnd: [],
            duration: []
        },
        tests: {
            types: [],
            orderingPhysicians: [],
            dates: [],
            reviewingPhysicians: [],
            results: []
        },
        medications: {
            names: [],
            prescriptionDates: [],
            prescribingPhysicians: [],
            frequencies: [],
            durations: [],
            endDates: []
        },
        admissions: {
            hospitalNames: [],
            admissionDates: [],
            dischargeDates: [],
            lengthsOfStay: []
        }
    });

     // Function to set the hospital address
    const setAddress = async () => {
        try {
            const accounts = await web3.eth.getAccounts(); // Get the accounts from MetaMask
            //console.log("Account:", accounts[0]);
            setHospitalAddress(accounts[0]); // Set the hospital address
        } catch (error) {
            toast.error('Error fetching hospital address.');
        }
    }

    useEffect(() => {

        async function fetchMedicalHistory() {
            try {
                let patientName, patientAge, patientDob, patientGender;
                let hospitalName;
                // Ensure hospital address is set before fetching medical history
                if (!hospitalAddress) {
                    await setAddress();
                    return;
                }

                //* Retrieve muna ang hospital na currently naka logged in
                const hospitalInfo = await mvContract.methods.getHospitalInfo(hospitalAddress).call();
                //(hospitalInfo[0]);
                hospitalName = hospitalInfo[0]; //* Get ang name ni hospital then salin kay var hospitalName

                let patientAddress;
                patientAddress = patientAddr;

                const patientRecords = await mvContract.methods.getMedicalHistory(patientAddress).call();
                //console.log(patientRecords);
                
                const patientInfo = await mvContract.methods.getPatientInfo(patientAddress).call();
                //console.log(patientInfo);
                const patientNameHolder = patientInfo[0].split('+');
                patientName = `${patientNameHolder[0]} ${patientNameHolder[1]} ${patientNameHolder[2]}`;
                patientAge = patientInfo[1];
                patientDob = patientInfo[3];
                patientGender = patientInfo[2];
                
                //* So bali ang ginagawa dito is sa list ng medical history ni patient kinukuha yung specific record
                //* using creation date as key para masearch
                const getPatientMedicalHistory = patientRecords.filter(record => {
                    return record[9] === creationDate;
                });
                //console.log(getPatientMedicalHistory);

                let physicianName;
                
                //* Get yung data sa array na nag equal sa may creationDate
                const parsedPatientMedicalHistory = getPatientMedicalHistory.map(item => {
                    const {patientAddr, hospitalAddr, physician, diag, symptoms, treatment, testList, meds, adm, creationDate} = item;
                    physicianName = physician;
                    sethospitalAddrInHistory(hospitalAddr);

                    let diagnosis, signsAndSymptoms, treatmentProcedure, tests, medications, admission;

                    if (diag.includes('~')) {
                        diagnosis = diag.split('~').map(diagnosis => diagnosis.split('+'));
                    } else {
                        diagnosis = [diag.split('+')];
                    }

                    if (symptoms.includes('~')) {
                        signsAndSymptoms = symptoms.split('~').map(signsAndSymptoms => signsAndSymptoms.split('+'));
                    } else {
                        signsAndSymptoms = [symptoms.split('+')];
                    }

                    if (treatment.includes('~')) {
                        treatmentProcedure = treatment.split('~').map(treatmentProcedure => treatmentProcedure.split('+'));
                    } else {
                        treatmentProcedure = [treatment.split('+')];
                    }

                    if (testList.includes('~')) {
                        tests = testList.split('~').map(tests => tests.split('+'));
                    } else {
                        tests = [testList.split('+')];
                    }

                    if (meds.includes('~')) {
                        medications = meds.split('~').map(medications => medications.split('+'));
                    } else {
                        medications = [meds.split('+')];
                    }

                    if (adm.includes('~')) {
                        admission = adm.split('~').map(admission => admission.split('+'));
                    } else {
                        admission = [adm.split('+')];
                    }
                    
                    return {
                        patientAddr: patientAddr,
                        hospitalAddr,
                        physician,
                        diagnosis: diag,
                        signsAndSymptoms: symptoms,
                        treatmentProcedure: treatment,
                        tests: testList,
                        medications: meds,
                        admission: adm,
                        creationDate
                    };
                    
                });
                // console.log("Patient Medical History:", parsedPatientMedicalHistory);

                // const modifiedPatientMedicalHistory = parsedPatientMedicalHistory.map(item => {
                //     if (item.diagnosis.includes('~')) {
                //         item.diagnosis = item.diagnosis.split('~').map(diagnosis => diagnosis.split('+'));
                //         //console.log(item.diagnosis); 
                //     } else {
                //         item.diagnosis = [item.diagnosis.split('+')];
                //         //console.log(item.diagnosis); 
                //     }

                //     if (item.signsAndSymptoms.includes('~')) {
                //         item.signsAndSymptoms = item.signsAndSymptoms.split('~').map(signsAndSymptoms => signsAndSymptoms.split('+'));
                //         //console.log(item.signsAndSymptoms); 
                //     } else {
                //         item.signsAndSymptoms = [item.signsAndSymptoms.split('+')];
                //         //console.log(item.signsAndSymptoms); 
                //     }

                //     if (item.treatmentProcedure.includes('~')) {
                //         item.treatmentProcedure = item.treatmentProcedure.split('~').map(treatmentProcedure => treatmentProcedure.split('+'));
                //         //console.log(item.treatmentProcedure); // Use item.signsAndSymptoms here
                //     } else {
                //         item.treatmentProcedure = [item.treatmentProcedure.split('+')];
                //         //console.log(item.treatmentProcedure); // Use item.signsAndSymptoms here
                //     }

                //     if (item.tests.includes('~')) {
                //         item.tests = item.tests.split('~').map(tests => tests.split('+'));
                //         //console.log(item.tests); 
                //     } else {
                //         item.tests = [item.tests.split('+')];
                //         //console.log(item.tests); 
                //     }

                //     if (item.medications.includes('~')) {
                //         item.medications= item.medications.split('~').map(medications => medications.split('+'));
                //         //console.log(item.medications); 
                //     } else {
                //         item.medications = [item.medications.split('+')];
                //         //console.log(item.medications); 
                //     }

                //     if (item.admission.includes('~')) {
                //         item.admission = item.admission.split('~').map(admission => admission.split('+'));
                //         //console.log(item.admission); 
                //     } else {
                //         item.admission = [item.admission.split('+')];
                //         //console.log(item.admission); 
                //     }
                //     return {
                //         diagnosis: item.diagnosis,
                //         signsAndSymptoms: item.signsAndSymptoms,
                //         treatmentProcedure: item.treatmentProcedure,
                //         tests: item.tests,
                //         medications: item.medications,
                //         admission: item.admission,
                //         patientAddr: item.patientAddr,
                //         creationDate: item.creationDate
                //     };
                    
                // });
                // console.log("Modified Patient Medical History:", modifiedPatientMedicalHistory);

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

                parsedPatientMedicalHistory.forEach(item => {
                    if (Array.isArray(item.diagnosis)) {
                        item.diagnosis.forEach(array => {
                            const {diagnosisName, dateOfDiagnosis, diagnosisDescription} = array;
                            diagnosisNames.push(diagnosisName);
                            dateOfDiagnoses.push(dateOfDiagnosis);
                            diagnosisDescriptions.push(diagnosisDescription);
                        });
                    }
                
                    if (Array.isArray(item.signsAndSymptoms)) {
                        item.signsAndSymptoms.forEach(array => {
                            const {_, symptomName, duration, severity, location} = array;
                            symptomNames.push(symptomName);
                            symptomDuration.push(duration);
                            symptomSeverity.push(severity);
                            symptomLocation.push(location);
                        });
                    }

                    if (Array.isArray(item.treatmentProcedure)) {
                        item.treatmentProcedure.forEach(array => {
                            const {_, name, medicalProvider, dateStarted, dateEnd, duration} = array;
                            tpName.push(name);
                            tpMedicalProvider.push(medicalProvider);
                            tpDateStarted.push(dateStarted);
                            tpDateEnd.push(dateEnd);
                            tpDuration.push(duration);
                        });
                    }
                
                    if (Array.isArray(item.tests)) {
                        item.tests.forEach(array => {
                            const {_, type, orderingPhysician, date, reviewingPhysician, result} = array;
                            testType.push(type);
                            testOrderingPhysician.push(orderingPhysician);
                            testDate.push(date);
                            testReviewingPhysician.push(reviewingPhysician);
                            testResult.push(result);
                        });
                    }
                
                    if (Array.isArray(item.medications)) {
                        item.medications.forEach(array => {
                            const {_, name, date, physician, frequency, duration, endDate} = array;
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
                            const {_, hospitalName, admissionDate, dischargeDate, stayLength} = array;
                            admissionHospitalName.push(hospitalName);
                            aadmissionDate.push(admissionDate);
                            adischargeDate.push(dischargeDate);
                            lengthOfStay.push(stayLength);
                        });
                    }
                });

                const medicalHistory = {
                    patientName,
                    patientAge,
                    patientDob,
                    patientGender,
                    hospitalName,
                    physicianName,
                    diagnosis: {
                        names: diagnosisNames,
                        dates: dateOfDiagnoses,
                        descriptions: diagnosisDescriptions
                    },
                    symptoms: {
                        names: symptomNames,
                        duration: symptomDuration,
                        severity: symptomSeverity,
                        location: symptomLocation
                    },
                    treatmentProcedure: {
                        names: tpName,
                        medicalProviders: tpMedicalProvider,
                        dateStarted: tpDateStarted,
                        dateEnd: tpDateEnd,
                        duration: tpDuration
                    },
                    tests: {
                        types: testType,
                        orderingPhysicians: testOrderingPhysician,
                        dates: testDate,
                        reviewingPhysicians: testReviewingPhysician,
                        results: testResult
                    },
                    medications: {
                        names: medicationName,
                        prescriptionDates: prescriptionDate,
                        prescribingPhysicians: prescribingPhysician,
                        frequencies: medicationFrequency,
                        durations: medicationDuration,
                        endDates: medicationEndDate
                    },
                    admissions: {
                        hospitalNames: admissionHospitalName,
                        admissionDates: aadmissionDate,
                        dischargeDates: adischargeDate,
                        lengthsOfStay: lengthOfStay
                    }
                };
                setMedicalHistory(medicalHistory);
                console.log(medicalHistory)
            } catch (error) {
                console.error('Error fetching medical history:', error);
            }
        }
        
        fetchMedicalHistory();
    }, [hospitalAddress]);

    const toggleButton = (patientAddr, creationDate) => {
        if (hospitalAddrInHistory !== hospitalAddress) {
            toast.error('You do not have permission to edit this record');
        } else {
            router.push({
                pathname: '/HOSPITAL/UpdateMedicalHistoryHospital/',
                query: { patientAddr, creationDate }
            });
        }
    };

    return ( 
        <>
        <Layout id='layout' pageName="Medical History">
            <div id='container' className={styles.container}>   
                <div className={styles.outerContainer}>
                    <div className={styles.basicInfoContainer}>
                        <div className={styles.patientName}>
                            <p className={styles.headingAttrb}>Patient Name</p>  
                            <p className={styles.dataFormat}>{medicalHistory.patientName}</p> 
                        </div>
                        <div className={styles.patientAge}>
                            <p className={styles.headingAttrb}>Age</p>  
                            <p className={styles.dataFormat}>{medicalHistory.patientAge}</p> 
                        </div>
                        <div className={styles.patientBday}>
                            <p className={styles.headingAttrb}>Birthday</p>  
                            <p className={styles.dataFormat}>{medicalHistory.patientDob}</p> 
                        </div>
                        <div className={styles.doctor}>
                            <p className={styles.headingAttrb}>Doctor Consulted</p>   
                            <p className={styles.dataFormat}>{medicalHistory.physicianName}</p>
                        </div>
                        <div className={styles.dateDiagnosis}>
                            <p className={styles.headingAttrb}>Date of Diagnosis</p>  
                            <p className={styles.dataFormat}>{medicalHistory.diagnosis.dates}</p> 
                        </div>
                        <div className={styles.diagnosis}>
                            <p className={styles.headingAttrb}>Diagnosis</p>   
                            <p className={styles.dataFormat_diag}>{medicalHistory.diagnosis.names}</p> 
                        </div>
                        <div className={styles.description}>
                            <p className={styles.headingAttrb}>Diagnosis Description</p>   
                            <p className={styles.des}>{medicalHistory.diagnosis.descriptions}</p> 
                        </div>
                    </div>
                </div>

                <div className={styles.scrollable_container}>
                    <div className={styles.table_container}>
                        <p className={styles.table_title}>Signs and Symptoms</p>
                        <div className={styles.responsiveTable}>
                            <div className={styles.sANDs_heading}>
                                <p>Symptoms</p>
                                <p>Duration</p>
                                <p>Severity</p>
                                <p>Location</p>
                            </div>

                            <div className={styles.scrollableTable_container}>
                                {medicalHistory.symptoms.names.map((symptom, index) => (
                                    <div key={index} className={styles.sANDs_data}>
                                        <p>{symptom}</p>
                                        <p>{medicalHistory.symptoms.duration[index]}</p>
                                        <p>{medicalHistory.symptoms.severity[index]}</p>
                                        <p>{medicalHistory.symptoms.location[index]}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className={styles.table_container}>
                        <p className={styles.table_title}>Treatment/Procedure</p>
                        <div className={styles.responsiveTable}>
                            <div className={styles.treatment_heading}>
                                <p>Treatment/Procedure</p>
                                <p>Medical Team/Provider</p>
                                <p>Date Started</p>
                                <p>Date End</p>
                                <p>Duration</p>
                            </div>

                            <div className={styles.scrollableTable_container}>
                                {medicalHistory.treatmentProcedure.names.map((data, index) => (
                                    <div key={index} className={styles.treatment_data}>
                                        <p>{data}</p>
                                        <p>{medicalHistory.treatmentProcedure.medicalProviders[index]}</p>
                                        <p>{medicalHistory.treatmentProcedure.dateStarted[index]}</p>
                                        <p>{medicalHistory.treatmentProcedure.dateEnd[index]}</p>
                                        <p>{medicalHistory.treatmentProcedure.duration[index]}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className={styles.table_container}>
                        <p className={styles.table_title}>Test</p>
                        <div className={styles.responsiveTable}>
                            <div className={styles.test_heading}>
                                <p>Type of Test</p>
                                <p>Ordering Physician</p>
                                <p>Date</p>
                                <p>Reviewing Physician</p>
                                <p>Result</p>
                            </div>

                            <div className={styles.scrollableTable_container}>
                                {medicalHistory.tests.types.map((data, index) => (
                                    <div key={index} className={styles.test_data}>
                                        <p>{data}</p>
                                        <p>{medicalHistory.tests.orderingPhysicians[index]}</p>
                                        <p>{medicalHistory.tests.dates[index]}</p>
                                        <p>{medicalHistory.tests.reviewingPhysicians[index]}</p>
                                        <p>{medicalHistory.tests.results[index]}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    
                    <div className={styles.table_container}>
                        <p className={styles.table_title}>Medication</p>
                        <div className={styles.responsiveTable}>
                            <div className={styles.medication_heading}>
                                <p>Medication</p>
                                <p>Date of Prescription</p>
                                <p>Prescribing Physician</p>
                                <p>Frequency</p>
                                <p>Duration</p>
                                <p>End Date</p>
                            </div>

                            <div className={styles.scrollableTable_container}>
                                {medicalHistory.medications.names.map((data, index) => (
                                    <div key={index} className={styles.medication_data}>
                                        <p>{data}</p>
                                        <p>{medicalHistory.medications.prescriptionDates[index]}</p>
                                        <p>{medicalHistory.medications.prescribingPhysicians[index]}</p>
                                        <p>{medicalHistory.medications.frequencies[index]}</p>
                                        <p>{medicalHistory.medications.durations[index]}</p>
                                        <p>{medicalHistory.medications.endDates[index]}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className={styles.table_container}>
                        <p className={styles.table_title}>Admission</p>
                        <div className={styles.responsiveTable}>
                            <div className={styles.sANDs_heading}>
                                <p>Hospital</p>
                                <p>Admission Date</p>
                                <p>Discharge Date</p>
                                <p>Length of Stay</p>
                            </div>

                            <div className={styles.scrollableTable_container}>
                                {medicalHistory.admissions.hospitalNames.map((data, index) => (
                                    <div key={index} className={styles.sANDs_data}>
                                        <p>{data}</p>
                                        <p>{medicalHistory.admissions.admissionDates[index]}</p>
                                        <p>{medicalHistory.admissions.dischargeDates[index]}</p>
                                        <p>{medicalHistory.admissions.lengthsOfStay[index]}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>      
            </div>
            <button className={styles.submitButton} onClick={() => toggleButton(patientAddr, creationDate)}> 
                <img src="/edit.svg" alt="Edit Icon"/>
            </button>

        </Layout>
        <ToastWrapper/>  
        </>
     );
}
 
export default MedicalHistoryHospital;