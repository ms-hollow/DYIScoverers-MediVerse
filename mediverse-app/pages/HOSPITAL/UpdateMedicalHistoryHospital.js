import styles from '../../styles/updateMedicalHistory.module.css';
import Layout from '../../components/HomeSidebarHeaderHospital.js'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import web3 from "../../blockchain/web3";
import mvContract from '../../blockchain/mediverse';

//! Note: Sa may MedicalHistory2Hospital, meron update or edit button

const UpdateMedicalHistoryHospital = () => {

    //TODO: Lagay ang info ni patient sa taas. SHOULD BE IN READ ONLY FORMAT
    //TODO: Retrieve ang medical record
    //TODO: Display sa forms and table
    //TODO: Save lahat ng data ulit
    
    const [hospitalAddress, setHospitalAddress] = useState('');
    const [currentMedicalHistory, setcurrentMedicalHistory] = useState([]);
    const router = useRouter();
    const { patientAddr, creationDate } = router.query; //* kunin yung data ng pinindot na row sa may MedicalHistory1Hospital

    //? Itong const sa baba, nag lagay ako nito para ma-access sa frontend ang data.
    const [medicalHistory, setMedicalHistory] = useState({
        patientName: '',
        patientAge: '',
        patientDob: '',
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
            alert('Error fetching hospital address.');
        }
    }

    useEffect(() => {

        async function fetchMedicalHistory() {
            try {
                let patientName, patientAge, patientDob;
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
                console.log(patientRecords);
                
                const patientInfo = await mvContract.methods.getPatientInfo(patientAddress).call();
                console.log(patientInfo);
                const patientNameHolder = patientInfo[0].split('+');
                patientName = `${patientNameHolder[0]} ${patientNameHolder[1]} ${patientNameHolder[2]}`;
                patientAge = patientInfo[1];
                patientDob = patientInfo[3];
                
                //* So bali ang ginagawa dito is sa list ng medical history ni patient kinukuha yung specific record
                //* using creation date as key para masearch
                const getPatientMedicalHistory = patientRecords.filter(record => {
                    return record[9] === creationDate;
                });
                console.log(getPatientMedicalHistory);

                let physicianName;
                //* Get yung data sa array na nag equal sa may creationDate
                const parsedPatientMedicalHistory = getPatientMedicalHistory.map(item => {
                    const [patientAddr, hospitalAddr, physician, diagnosis, signsAndSymptoms, treatmentProcedure, tests, medications, admission, creationDate] = item;
                    physicianName = physician;
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
                setcurrentMedicalHistory(parsedPatientMedicalHistory);

                //console.log("Patient Medical History:", parsedPatientMedicalHistory);

                //* Split ang mga data. '~' means paghihiwalay ang array kapag marami nilagay si hospital
                //* '+' means paghihiwalayin ang concatenated data sa isang array
                const modifiedPatientMedicalHistory = parsedPatientMedicalHistory.map(item => {
                    if (item.diagnosis.includes('~')) {
                        item.diagnosis = item.diagnosis.split('~').map(diagnosis => diagnosis.split('+'));
                        //console.log(item.diagnosis); 
                    } else {
                        item.diagnosis = [item.diagnosis.split('+')];
                        //console.log(item.diagnosis); 
                    }

                    if (item.signsAndSymptoms.includes('~')) {
                        item.signsAndSymptoms = item.signsAndSymptoms.split('~').map(signsAndSymptoms => signsAndSymptoms.split('+'));
                        //console.log(item.signsAndSymptoms); 
                    } else {
                        item.signsAndSymptoms = [item.signsAndSymptoms.split('+')];
                        //console.log(item.signsAndSymptoms); 
                    }

                    if (item.treatmentProcedure.includes('~')) {
                        item.treatmentProcedure = item.treatmentProcedure.split('~').map(treatmentProcedure => treatmentProcedure.split('+'));
                        //console.log(item.treatmentProcedure); // Use item.signsAndSymptoms here
                    } else {
                        item.treatmentProcedure = [item.treatmentProcedure.split('+')];
                        //console.log(item.treatmentProcedure); // Use item.signsAndSymptoms here
                    }

                    if (item.tests.includes('~')) {
                        item.tests = item.tests.split('~').map(tests => tests.split('+'));
                        //console.log(item.tests); 
                    } else {
                        item.tests = [item.tests.split('+')];
                        //console.log(item.tests); 
                    }

                    if (item.medications.includes('~')) {
                        item.medications= item.medications.split('~').map(medications => medications.split('+'));
                        //console.log(item.medications); 
                    } else {
                        item.medications = [item.medications.split('+')];
                        //console.log(item.medications); 
                    }

                    if (item.admission.includes('~')) {
                        item.admission = item.admission.split('~').map(admission => admission.split('+'));
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

                const medicalHistory = {
                    patientName,
                    patientAge,
                    patientDob,
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
                
                setFormData({
                    physician: medicalHistory.physicianName || '',
                    diagnosis: medicalHistory.diagnosis.names || '',
                    dateOfDiagnosis: medicalHistory.diagnosis.dates || '',
                    description: medicalHistory.diagnosis.descriptions || '',
                    symptoms: [{ noSymptom: 1, symptomName: '', symptomDuration: '', symptomSeverity: '', symptomLocation: '' }],
                    treatmentProcedure: [{noTP: 1, tp: '', medTeam: '', tpDateStarted: '', tpDateEnd: '', tpDuration: ''}],
                    test: [{noTest: 1, testType: '', orderingPhysician: '', testDate: '', reviewingPhysician: '', testResult: ''}],
                    medication: [{noMedication: 1, medicationType: '', dateOfPrescription: '', medicationPrescribingPhysician: '', medicationReviewingPhysician: '', medicationFrequency: '', medicationDuration: '', medicationEndDate: ''}],
                    admission: [{noAdmission: 1, hospitalName: '', admissionDate: '', dischargeDate: '', lengthOfStay: ''}] 
                });
                console.log(medicalHistory)
            } catch (error) {
                console.error('Error fetching medical history:', error);
            }
        }
        
        fetchMedicalHistory();
    }, [hospitalAddress]);
    
    const [formData, setFormData] = useState({ 
        physician: '',
        diagnosis: '',
        dateOfDiagnosis: '',
        description: '',
        symptoms: [{ noSymptom: 1, symptomName: '', symptomDuration: '', symptomSeverity: '', symptomLocation: '' }],
        treatmentProcedure: [{noTP: 1, tp: '', medTeam: '', tpDateStarted: '', tpDateEnd: '', tpDuration: ''}],
        test: [{noTest: 1, testType: '', orderingPhysician: '', testDate: '', reviewingPhysician: '', testResult: ''}],
        medication: [{noMedication: 1, medicationType: '', dateOfPrescription: '', medicationPrescribingPhysician: '', medicationReviewingPhysician: '', medicationFrequency: '', medicationDuration: '', medicationEndDate: ''}],
        admission: [{noAdmission: 1, hospitalName: '', admissionDate: '', dischargeDate: '', lengthOfStay: ''}] 
    });

    const handleChange = (e, index) => {
        const { name, value } = e.target;
        // console.log('Name:', name);
        // console.log('Value:', value);
        if (name === 'symptomName' || name === 'symptomDuration' || name === 'symptomSeverity' || name === 'symptomLocation') {
            const updatedSymptoms = formData.symptoms.map((symptom, i) => {
                if (i === index) {
                    return { ...symptom, [name]: value };
                }
                return symptom;
            });
            setFormData({ ...formData, symptoms: updatedSymptoms });

        } else if (name === 'tp' || name == 'medTeam'|| name === 'tpDateStarted' || name === 'tpDateEnd' || name === 'tpDuration') {
            const updatedTreatmentProcedure = formData.treatmentProcedure.map((treatmentProcedure, i) => {
                if (i === index) {
                    return { ...treatmentProcedure, [name]: value };
                }
                return treatmentProcedure;
            });
            setFormData({ ...formData, treatmentProcedure: updatedTreatmentProcedure });

        } else if (name === 'testType' || name === 'orderingPhysician' || name === 'testDate' || name === 'reviewingPhysician' || name === 'testResult') {
            const updatedTest = formData.test.map((test, i) => {
                if (i === index) {
                    return { ...test, [name]: value };
                }
                return test;
            });
            setFormData({ ...formData, test: updatedTest });

        } else if (name === 'medicationType' || name === 'dateOfPrescription' || name === 'medicationPrescribingPhysician' || name === 'medicationReviewingPhysician' || name === 'medicationFrequency' || name === 'medicationDuration' || name === 'medicationEndDate') {
            const updatedMedication = formData.medication.map((medication, i) => {
                if (i === index) {
                    return { ...medication, [name]: value };
                }
                return medication;
            });
            setFormData({ ...formData, medication: updatedMedication });

        } else if (name === 'hospitalName' || name === 'admissionDate' || name === 'dischargeDate' || name === 'lengthOfStay') {
            const updatedAdmission = formData.admission.map((admission, i) => {
                if (i === index) {
                    return { ...admission, [name]: value };
                }
                return admission;
            });
            setFormData({ ...formData, admission: updatedAdmission });
        } else if (e.target.name === 'patientName') {
            setFormData({
                ...formData,
                patientName: e.target.value,
            });
        } else if (e.target.name === 'patientAge') {
            setFormData({
                ...formData,
                patientAge: e.target.value,
            });
        } else if (e.target.name === 'patientDob') {
            setFormData({
                ...formData,
                patientDob: e.target.value,
            });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleAddRowSymptoms = () => {
        if (formData.symptoms.length < 3) {
            const newSymptom = { noSymptom: formData.symptoms.length + 1, symptomName: '', symptomDuration: '', symptomSeverity: '', symptomLocation: ''};
            setFormData({ ...formData, symptoms: [...formData.symptoms, newSymptom] });
        }
    };

    const handleAddRowTreatmentProcedure = () => {
        if (formData.treatmentProcedure.length < 3) {
            const newTreatmentProcedure = { noTP: formData.treatmentProcedure.length + 1, tp: '', tpDateStarted: '', tpDateEnd: '', tpDuration: '' };
            setFormData({ ...formData, treatmentProcedure: [...formData.treatmentProcedure, newTreatmentProcedure] });
        }
    };

    const handleAddRowTest = () => {
        if (formData.test.length < 3) {
            const newTest = { noTest: formData.test.length + 1, testType: '', orderingPhysician: '', testDate: '', reviewingPhysician: '', testResult: ''};
            setFormData({ ...formData, test: [...formData.test, newTest] });
        }
    };

    const handleAddRowMedication = () => {
        if (formData.medication.length < 3) {
            const newMedication = { noMedication: formData.medication.length + 1, medicationType: '', dateOfPrescription: '', medicationReviewingPhysician: '', medicationFrequency: '', medicationDuration: '', medicationEndDate: ''};
            setFormData({ ...formData, medication: [...formData.medication, newMedication] });
        }
    };

    const handleAddRowAdmission = () => {
        if (formData.admission.length < 3) {
            const newAdmission = { noAdmission: formData.admission.length + 1, hospitalName: '', admissionDate: '', dischargeDate: '', lengthOfStay: ''};
            setFormData({ ...formData, admission: [...formData.admission, newAdmission] });
        }
    };

    const mergeHistories = async (e) => {

        console.log('Form submitted:', formData);

        currentMedicalHistory.forEach(historyItem => {
            const { patientAddr, hospitalAddr, physician, diagnosis, signsAndSymptoms, treatmentProcedure, tests, medications, admission, creationDate } = historyItem;
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
        console.log("Current Med History" ,currentMedicalHistory);

        // Concatenate physician, diagnosis, and dateOfDiagnosis
        const patientDiagnosis =  formData.diagnosis + '+' + formData.dateOfDiagnosis + '+' + formData.description;

        // Concatenate arrays using symbols
        const countNonEmpty = obj => Object.values(obj).filter(value => value !== '' && value !== null).length;

        const concatenatedSymptoms = formData.symptoms.length > 0 && countNonEmpty(formData.symptoms[0]) >= 4 && formData.symptoms
          .map(symptom => Object.values(symptom).filter(value => value !== '' && value !== null).join('+'))
          .join('~');
        
        const concatenatedTreatmentProcedure = formData.treatmentProcedure.length > 0 && countNonEmpty(formData.treatmentProcedure[0]) >= 4 && formData.treatmentProcedure
          .map(tp => Object.values(tp).filter(value => value !== '' && value !== null).join('+'))
          .join('~');
        
        const concatenatedTest = formData.test.length > 0 && countNonEmpty(formData.test[0]) >= 4 && formData.test
          .map(test => Object.values(test).filter(value => value !== '' && value !== null).join('+'))
          .join('~');
        
        const concatenatedMedication = formData.medication.length > 0 && countNonEmpty(formData.medication[0]) >= 4 && formData.medication
          .map(medication => Object.values(medication).filter(value => value !== '' && value !== null).join('+'))
          .join('~');
        
        const concatenatedAdmission = formData.admission.length > 0 && countNonEmpty(formData.admission[0]) >= 4 && formData.admission
          .map(admission => Object.values(admission).filter(value => value !== '' && value !== null).join('+'))
          .join('~');

        console.log('Patient Consultation:', patientDiagnosis);
        console.log('Concatenated Symptoms:', concatenatedSymptoms);
        console.log('Concatenated Treatment/Procedure:', concatenatedTreatmentProcedure);
        console.log('Concatenated Test:', concatenatedTest);
        console.log('Concatenated Medication:', concatenatedMedication);
        console.log('Concatenated Admission:', concatenatedAdmission);

        // * need below 100 ung length ng diagnosis at description
        if (formData.diagnosis.length < 100 && formData.description.length < 100) {
            try {
                const accounts = await web3.eth.getAccounts(); // Get the accounts from MetaMask
                console.log("Account:", accounts[0]);

                const newMedicalRecord = {
                    patientAddr: formData.patientAddress,
                    hospitalAddr: formData.hospitalAddress,
                    physician: formData.physician,
                    diagnosis: patientDiagnosis,
                    signsAndSymptoms: concatenatedSymptoms,
                    treatmentProcedure: concatenatedTreatmentProcedure,
                    tests: concatenatedTest,
                    medications: concatenatedMedication,
                    admission: concatenatedAdmission,
                    creationDate: Math.floor(Date.now() / 1000).toString() // Get current Unix timestamp
                };
    
                // Add the new record to the existing medical history array
                const updatedMedicalHistory = [...currentMedicalHistory, newMedicalRecord];
    
                // Log the updated medical history
                console.log("Updated Medical History:", updatedMedicalHistory);

                const receipt = await mvContract.methods.addMedicalHistory(
                    newMedicalRecord.patientAddr,
                    newMedicalRecord.physician,
                    newMedicalRecord.diagnosis,
                    newMedicalRecord.signsAndSymptoms,
                    newMedicalRecord.treatmentProcedure,
                    newMedicalRecord.tests,
                    newMedicalRecord.medications,
                    newMedicalRecord.admission
                ).send({ from: accounts[0] });
                console.log("Transaction Hash:", receipt.transactionHash);
                router.push('/HOSPITAL/PatientRecordsHospital/');
                
            } catch (error) {
                alert('Patient is not registered.');
            };
        } else {
            //console.error('Error sending transaction:', error.message);
            alert('Diagnosis and Description should be below 100 letters');
            //
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission 
        mergeHistories();
    };

    const goBack = () => {
        window.history.back(); 
    };

    return (  
        <Layout pageName = "Update Medical History">
        <>
        <div className={styles.formContainer}>
                <form className={styles.medicalHistoryForm} onSubmit={handleSubmit}>   

                <div className={styles.formTitle}>Patient Information</div>
                    <div className={styles.formRow}>
                        <div className={styles.formField}>
                            <input type="text" id="patient-name" name="patientName" value={medicalHistory.patientName} placeholder="Patient Name" required onChange={handleChange} readOnly/>
                        </div>
                        <div className={styles.formField}>
                            <input type="text" id="patient-Age" name="patientAge" value={medicalHistory.patientAge} placeholder="Age" required onChange={handleChange}readOnly/>
                        </div>
                        <div className={styles.formField}>
                            <input type="date" id="patient-dob" name="patientDob"  value={medicalHistory.patientDob} placeholder="Gender" required onChange={handleChange} readOnly/>
                        </div>
                    </div>
            
                    <div className={styles.formTitle}>Patient Consultation</div>
                    <div className={styles.formRow}>
                        <div className={styles.formField}>
                            <input type="text" id="physician" name="physician" value={formData.physician} placeholder="Physician"  required onChange={handleChange} />
                        </div>
                        <div className={styles.formField}>
                            <input type="text" id="diagnosis" name="diagnosis" value={formData.diagnosis} placeholder="Diagnosis" required onChange={handleChange} />
                        </div>
                        <div className={styles.formField}>
                            <input type="date" id="date-of-diagnosis" name="dateOfDiagnosis"  value={formData.dateOfDiagnosis} placeholder="Date of Diagnosis" required onChange={handleChange} />
                        </div>
                    </div>
            
                    <div className={styles.formRow}>
                        <div className={styles.formField}>
                            <input type="text" id="description" name="description" value={formData.description} placeholder="Description" required onChange={handleChange} />
                        </div>
                    </div>

                    {/** ----------------------------------- Signs and Symptoms  ----------------------------------- */}
                    <div className={styles.formTitle}>Signs and Symptoms</div>

                    <div className={styles.table_container}>
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

                    <div className={styles.formRowTitle_sANDs}>
                        <div className={styles.formHeader}>No.</div>
                        <div className={styles.formHeader}>Symptoms</div>
                        <div className={styles.formHeader}>Duration</div>    
                        <div className={styles.formHeader}>Severity</div>
                        <div className={styles.formHeader}>Location</div>     
                    </div>

                    {formData.symptoms.map((symptom, index) => (
                        <div className={styles.formRow} key={index}>
                            <div className={styles.formFieldNum}>
                                <input type="text" id="no-symptom"  name="noSymptom" value={symptom.noSymptom} readOnly />
                            </div>
                            <div className={styles.formFieldRow}>
                                <input type="text" id="symptom-name"  name="symptomName" placeholder="Type of Symptoms" required onChange={(e) => handleChange(e, index)} />
                            </div>
                            <div className={styles.formFieldRow}>
                                <input type="number" id="symptom-duration" name="symptomDuration" placeholder="Days" required onChange={(e) => handleChange(e, index)} />
                            </div>
                            <div className={styles.formFieldRow}>
                            <select id="symptom-severity" name="symptomSeverity"  required onChange={(e) => handleChange(e, index)}>
                                <option value="" disabled selected>Severity</option>
                                <option value="Asymptomatic">Asymptomatic</option>
                                <option value="Mild">Mild</option>
                                <option value="Moderate">Moderate</option>
                                <option value="Severe">Severe</option>
                                <option value="Critical">Critical</option>
                                <option value="Life-threatening">Life-threatening</option>
                            </select>
                            </div>
                            <div className={styles.formFieldLastCol}>
                                <input type="text" id="symptom-location" name="symptomLocation" placeholder="Location" required onChange={(e) => handleChange(e, index)} />
                            </div>
                        </div>
                    ))}
                    
                    {formData.symptoms.length < 3 && (<button className={styles.addButton} onClick={handleAddRowSymptoms}>ADD MORE SIGNS AND SYMPTOMS</button>)}

                    {/** ----------------------------------- TREATMENT/PROCEDURE  ----------------------------------- */}
                    <div className={styles.formTitle}>Treatment/Procedure</div>

                    <div className={styles.table_container}>
                        <div className={styles.tp_heading}>
                            <p>Treatment/Procedure</p>
                            <p>Medical Team/Provider</p>
                            <p>Date Started</p>
                            <p>Date End</p>
                            <p>Duration</p>
                        </div>

                        <div className={styles.scrollableTable_container}>
                            {medicalHistory.treatmentProcedure.names.map((data, index) => (
                                <div key={index} className={styles.tp_data}>
                                    <p>{data}</p>
                                    <p>{medicalHistory.treatmentProcedure.medicalProviders[index]}</p>
                                    <p>{medicalHistory.treatmentProcedure.dateStarted[index]}</p>
                                    <p>{medicalHistory.treatmentProcedure.dateEnd[index]}</p>
                                    <p>{medicalHistory.treatmentProcedure.duration[index]}</p>
                                </div>
                        ))}
                        </div>
                    </div>

                    <div className={styles.formRowTitle_TP}>
                        <div className={styles.formHeader}>No.</div>
                        <div className={styles.formHeader}>Treatment/Procedure</div>
                        <div className={styles.formHeader}>Medical Team/Provider</div>    
                        <div className={styles.formHeader}>Date Started</div>
                        <div className={styles.formHeader}>Date End</div>    
                        <div className={styles.formHeader}>Duration</div>   
                    </div>
                    
                    {formData.treatmentProcedure.map((treatmentProcedure, index) => (
                        <div className={styles.formRow} key={index}>
                            <div className={styles.formFieldNum}>
                                <input type="text" id="noTP"  name="noTP" value={treatmentProcedure.noTP} readOnly />
                            </div>
                            <div className={styles.formFieldRow}>
                                <input type="text" id="t-p"  name="tp" placeholder="Type Treatment/Procedure" required onChange={(e) => handleChange(e, index)} />
                            </div>
                            <div className={styles.formFieldRow}>
                                <input type="text" id="med-team"  name="medTeam" placeholder="Type Medical Team/Provider" required onChange={(e) => handleChange(e, index)} />
                            </div>
                            <div className={styles.formFieldRow}>
                                <input type="date" id="date-started" name="tpDateStarted" placeholder="Date Started" required onChange={(e) => handleChange(e, index)} />
                            </div>
                            <div className={styles.formFieldRow}>
                                <input type="date" id="date-end"  name="tpDateEnd" placeholder="Date End" required onChange={(e) => handleChange(e, index)} />
                            </div>
                            <div className={styles.formFieldLastCol}>
                                <input type="number" id="tp-duration"  name="tpDuration" placeholder="Duration" required onChange={(e) => handleChange(e, index)} />
                            </div>
                        </div>
                    ))}

                    {formData.treatmentProcedure.length < 3 && (<button className={styles.addButton} onClick={handleAddRowTreatmentProcedure}>ADD MORE TREATMENT/PROCEDURE</button>)}

                    {/** ----------------------------------- TEST ----------------------------------- */}
                    
                    <div className={styles.formTitle}>Test</div>

                    <div className={styles.table_container}>
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

                    <div className={styles.formRowTitle_test}>
                        <div className={styles.formHeader}>No.</div>
                        <div className={styles.formHeader}>Test</div>
                        <div className={styles.formHeader}>Ordering Physician</div>    
                        <div className={styles.formHeader}>Date</div>
                        <div className={styles.formHeader}>Reviewing Physician</div>    
                        <div className={styles.formHeader}>Result</div>   
                    </div>
        
                    {formData.test.map((test, index) => (
                        <div className={styles.formRow} key={index}>
                            <div className={styles.formFieldNum}>
                                <input type="text" id="no-test"  name="noTest" value={test.noTest} readOnly />
                            </div>
                            <div className={styles.formFieldRow}>
                            <select id="test-type" name="testType" placeholder="Test Type" required onChange={(e) => handleChange(e, index)}>
                                <option value="" disabled selected> -----  Blood Tests -----</option>
                                <option value="Complete Blood Count (CBC)">Complete Blood Count (CBC)</option>
                                <option value="Basic Metabolic Panel (BMP)">Basic Metabolic Panel (BMP)</option>
                                <option value="Comprehensive Metabolic Panel (CMP)">Comprehensive Metabolic Panel (CMP)</option>
                                <option value="Blood Glucose Test">Blood Glucose Test</option>
                                <option value="Lipid Panel (Cholesterol Test)">Lipid Panel (Cholesterol Test)</option>
                                <option value="Liver Function Tests (LFTs)">Liver Function Tests (LFTs)</option>
                                <option value="Coagulation Panel (PT/INR, PTT)">Coagulation Panel (PT/INR, PTT)</option>
                                <option value="Blood Typing and Crossmatching">Blood Typing and Crossmatching</option>
                                
                                <option value="" disabled selected> ----- Urinalysis ----- </option>
                                <option value="Routine Urinalysis">Routine Urinalysis</option>
                                <option value="Urine Culture and Sensitivity">Urine Culture and Sensitivity</option>
                                <option value="Urine Microscopic Examination">Urine Microscopic Examination</option>

                                <option value="" disabled selected> ----- Imaging Studies ----- </option>
                                <option value="Computed Tomography (CT Scan)">Computed Tomography (CT Scan)</option>
                                <option value="Magnetic Resonance Imaging (MRI)">Magnetic Resonance Imaging (MRI)</option>
                                <option value="Ultrasound">Ultrasound</option>
                                <option value="Positron Emission Tomography (PET Scan)">Positron Emission Tomography (PET Scan)</option>
                                <option value="Bone Scans">Bone Scans</option>

                                <option value="" disabled selected> ----- Microbiology Tests ----- </option>
                                <option value="Culture and Sensitivity (C&S)">Culture and Sensitivity (C&S)</option>
                                <option value="Gram Stain">Gram Stain</option>
                                <option value="Acid-Fast Bacilli (AFB) Culture">Acid-Fast Bacilli (AFB) Culture</option>
                                <option value="Fungal Culture">Fungal Culture</option>
                                <option value="Viral Culture">Viral Culture</option>
                                <option value="Antigen and Antibody Tests">Antigen and Antibody Tests</option>

                                <option value="" disabled selected> ----- Serology Tests ----- </option>
                                <option value="Enzyme-Linked Immunosorbent Assay (ELISA)">Enzyme-Linked Immunosorbent Assay (ELISA)</option>
                                <option value="Rapid Plasma Reagin (RPR) Test">Rapid Plasma Reagin (RPR) Test</option>
                                <option value="Treponemal Antibody Tests (e.g., FTA-ABS)">Treponemal Antibody Tests (e.g., FTA-ABS)</option>
                                <option value="Rheumatoid Factor (RF)">Rheumatoid Factor (RF)</option>
                                <option value="C-Reactive Protein (CRP)">C-Reactive Protein (CRP)</option>

                                <option value="" disabled selected> ----- Hematology Tests ----- </option>
                                <option value="Hemoglobin A1c (HbA1c)">Hemoglobin A1c (HbA1c)</option>
                                <option value="Hemoglobin Electrophoresis">Hemoglobin Electrophoresis</option>
                                <option value="Blood Smear Examination">Blood Smear Examination</option>
                                <option value="Erythrocyte Sedimentation Rate (ESR)">Erythrocyte Sedimentation Rate (ESR)</option>
                                <option value="Peripheral Blood Film">Peripheral Blood Film</option>

                                <option value="" disabled selected> ----- Coagulation Studies ----- </option>
                                <option value="Prothrombin Time (PT)">Prothrombin Time (PT)</option>
                                <option value="International Normalized Ratio (INR)">International Normalized Ratio (INR)</option>
                                <option value="Partial Thromboplastin Time (PTT)">Partial Thromboplastin Time (PTT)</option>
                                <option value="D-dimer Test">D-dimer Test</option>
                                <option value="Platelet Count">Platelet Count</option>

                                <option value="" disabled selected> ----- Endocrine Tests ----- </option>
                                <option value="Thyroid Function Tests (TFTs)">Thyroid Function Tests (TFTs)</option>
                                <option value="Adrenal Function Tests">Adrenal Function Tests</option>
                                <option value="Insulin Levels">Insulin Levels</option>
                                <option value="Testosterone Levels">Testosterone Levels</option>
                                <option value="Follicle-Stimulating Hormone (FSH) Levels">Follicle-Stimulating Hormone (FSH) Levels</option>

                                <option value="" disabled selected> ----- Genetic Tests ----- </option>
                                <option value="Polymerase Chain Reaction (PCR)">Polymerase Chain Reaction (PCR)</option>
                                <option value="Fluorescence In Situ Hybridization (FISH)">Fluorescence In Situ Hybridization (FISH)</option>
                                <option value="Chromosomal Analysis (Karyotyping)">Chromosomal Analysis (Karyotyping)</option>
                                <option value="Genetic Screening and Counseling">Genetic Screening and Counseling</option>
                                
                                <option value="" disabled selected> ----- Toxicology Tests ----- </option>
                                <option value="Drug Screening (Urine, Blood, Hair)">Drug Screening (Urine, Blood, Hair)</option>
                                <option value="Alcohol Levels (Blood, Breath)">Alcohol Levels (Blood, Breath)</option>
                                <option value="Heavy Metal Testing">Heavy Metal Testing</option>
                                
                                <option value="" disabled selected> ----- Pathology Tests ----- </option>
                                <option value="Tissue Biopsy">Tissue Biopsy</option>
                                <option value="Fine Needle Aspiration (FNA)">Fine Needle Aspiration (FNA)</option>
                                <option value="Pap Smear">Pap Smear</option>
                                <option value="Histopathology">Histopathology</option>
                                <option value="Immunohistochemistry">Immunohistochemistry</option>

                                <option value="" disabled selected> Test Type </option>
                            </select>
                            </div>
                            <div className={styles.formFieldRow}>
                                <input type="text" id="ordering-physician"  name="orderingPhysician" placeholder="Ordering Physician" required onChange={(e) => handleChange(e, index)} />
                            </div>
                            <div className={styles.formFieldRow}>
                                <input type="date" id="test-date"  name="testDate" placeholder="Test Date" required onChange={(e) => handleChange(e, index)} />
                            </div>
                            <div className={styles.formFieldRow}>
                                <input type="text" id="reviewing-physician"  name="reviewingPhysician" placeholder="Reviewing Physician" required onChange={(e) => handleChange(e, index)} />
                            </div>
                            <div className={styles.formFieldLastCol}>
                                <input type="text" id="test-result"  name="testResult" placeholder="Test Result" required onChange={(e) => handleChange(e, index)} />
                            </div>
                        </div>
                    ))}

                    {formData.test.length < 3 && (<button className={styles.addButton} onClick={handleAddRowTest}>ADD MORE TEST</button>)} 
                    
                    {/** ----------------------------------- MEDICATION ----------------------------------- */}
                    
                    <div className={styles.formTitle}>Medication</div>

                    <div className={styles.table_container}>
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

                    <div className={styles.formRowTitle_medication}>
                        <div className={styles.formHeader}>No.</div>
                        <div className={styles.formHeader}>Medication</div>
                        <div className={styles.formHeader}>Date of Prescription</div>    
                        <div className={styles.formHeader}>Prescribing Physician</div>
                        <div className={styles.formHeader}>Reviewing Physician</div>    
                        <div className={styles.formHeader}>Frequency</div>   
                        <div className={styles.formHeader}>Duration</div>
                        <div className={styles.formHeader}>End Date</div>    
                    </div>
                    
                    {formData.medication.map((medication, index) => (
                        <div className={styles.formRow} key={index}>
                            <div className={styles.formFieldNum_med}>
                                <input type="text" id="noMedication"  name="noMedication" value={medication.noMedication} readOnly />
                            </div>
                            <div className={styles.formFieldRow}>
                                <input type="text" id="medication-type"  name="medicationType" placeholder="Medication Type" required onChange={(e) => handleChange(e, index)}/>
                            </div>
                            <div className={styles.formFieldRow}>
                                <input type="date" id="date-of-prescription"  name="dateOfPrescription" placeholder="Date of Prescription" required onChange={(e) => handleChange(e, index)}/>
                            </div>
                            <div className={styles.formFieldRow}>
                                <input type="text" id="medication-prescribing-physician"  name="medicationPrescribingPhysician" placeholder="Prescribing Physician" required onChange={(e) => handleChange(e, index)}/>
                            </div>
                            <div className={styles.formFieldRow}>
                                <input type="text" id="medication-reviewing-physician"  name="medicationReviewingPhysician" placeholder="Reviewing Physician" required onChange={(e) => handleChange(e, index)}/>
                            </div>
                            <div className={styles.formFieldRow}>
                                <input type="text" id="medication-frequency"  name="medicationFrequency" placeholder="Frequency" required onChange={(e) => handleChange(e, index)}/>
                            </div>
                            <div className={styles.formFieldRow}>
                                <input type="number" id="medication-duration"  name="medicationDuration" placeholder="Duration" required onChange={(e) => handleChange(e, index)}/>
                            </div>
                            <div className={styles.formFieldLastCol}>
                                <input type="date" id="medication-end-date"  name="medicationEndDate" placeholder="End Date" required onChange={(e) => handleChange(e, index)}/>
                            </div>
                        </div>
                    ))}

                    {formData.medication.length < 3 && (<button className={styles.addButton} onClick={handleAddRowMedication}>ADD MORE MEDICATION</button>)}
                    
                    {/** ----------------------------------- ADMISSION ----------------------------------- */}
                    
                    <div className={styles.formTitle}>Admission</div>

                    <div className={styles.table_container}>
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

                    <div className={styles.formRowTitle_admission}>
                        <div className={styles.formHeader}>No.</div>
                        <div className={styles.formHeader}>Hospital</div>
                        <div className={styles.formHeader}>Admission Date</div>    
                        <div className={styles.formHeader}>Discharge Date</div>
                        <div className={styles.formHeader}>Length of Stay</div>      
                    </div>
                    
                    {formData.admission.map((admission, index) => (
                        <div className={styles.formRow} key={index}>
                            <div className={styles.formFieldNum}>
                                <input type="text" id="noAdmission"  name="noAdmission" value={admission.noAdmission} readOnly />
                            </div>
                            <div className={styles.formFieldRow}>
                                <input type="text" id="hospital-name"  name="hospitalName" placeholder="Hospital Name" required onChange={(e) => handleChange(e, index)}/>
                            </div>
                            <div className={styles.formFieldRow}>
                                <input type="date" id="admission-date"  name="admissionDate" placeholder="Admission Date" required onChange={(e) => handleChange(e, index)}/>
                            </div>
                            <div className={styles.formFieldRow}>
                                <input type="date" id="discharge-date"  name="dischargeDate" placeholder="Discharge Date" required onChange={(e) => handleChange(e, index)}/>
                            </div>
                            <div className={styles.formFieldLastCol}>
                                <input type="number" id="length-of-stay"  name="lengthOfStay" placeholder="Length of Stay" required onChange={(e) => handleChange(e, index)}/>
                            </div>
                        </div>
                    ))}

                    {formData.admission.length < 3 && (<button className={styles.addButton} onClick={handleAddRowAdmission}>ADD MORE ADMISSION</button>)}        

                    <button className={styles.submitButton} onClick={handleSubmit}>Update
                            {/**<Link href="/PATIENT/Register3Patient/">Add Patient</Link> */}
                    </button>
    
                </form>
            </div>
        
        </>
        </Layout>
    );
}

export default UpdateMedicalHistoryHospital;
