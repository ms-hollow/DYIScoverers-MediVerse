import styles from '../../styles/updateMedicalHistory.module.css';
import Layout from '../../components/HomeSidebarHeaderHospital.js'
import path from 'path';
import Link from "next/link";
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import web3 from "../../blockchain/web3";
import mvContract from '../../blockchain/mediverse';
import ToastWrapper from "@/components/ToastWrapper";
import { toast } from 'react-toastify';
// import { accounts } from 'web3/lib/commonjs/eth.exports';


const addMedicalHistory = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    // const [formData, setFormData] = useState({ 
    //     patientAddress: '',
    //     physician: '',
    //     diagnosis: '',
    //     dateOfDiagnosis: '',
    //     description: '',
    //     symptoms: [{ noSymptom: 1, symptomName: '', symptomDuration: '', symptomSeverity: '', symptomLocation: '' }],
    //     treatmentProcedure: [{noTP: 1, tp: '', medTeam: '' , tpDateStarted: '', tpDateEnd: '', tpDuration: ''}],
    //     test: [{noTest: 1, testType: '', orderingPhysician: '', testDate: '', reviewingPhysician: '', testResult: ''}],
    //     medication: [{noMedication: 1, medicationType: '', dateOfPrescription: '', medicationPrescribingPhysician: '', medicationReviewingPhysician: '', medicationFrequency: '', medicationDuration: '', medicationEndDate: ''}],
    //     admission: [{noAdmission: 1, hospitalName: '', admissionDate: '', dischargeDate: '', lengthOfStay: ''}] 
    // });

    const [hospitalAddress, setHospitalAddress] = useState('');
    const [hospital, setHospitalName] = useState('');;
    let hospitalNameHolder;
    
    const [formData, setFormData] = useState(() => {
        // Check if localStorage is available
        if (typeof window !== 'undefined' && window.localStorage) {
            // Retrieve form data from localStorage when the component mounts
            const savedFormData = localStorage.getItem('formData');
            return savedFormData ? JSON.parse(savedFormData) : {
                patientAddress: '',
                physician: '',
                diagnosis: '',
                dateOfDiagnosis: '',
                description: '',
                symptoms: [{ noSymptom: 1, symptomName: '', symptomDuration: '', symptomSeverity: '', symptomLocation: '' }],
                treatmentProcedure: [{ noTP: 1, tp: '', medTeam: '', tpDateStarted: '', tpDateEnd: '', tpDuration: '' }],
                test: [{ noTest: 1, testType: '', orderingPhysician: '', testDate: '', reviewingPhysician: '', testResult: '' }],
                medication: [{ noMedication: 1, medicationType: '', dateOfPrescription: '', medicationPrescribingPhysician: '', medicationReviewingPhysician: '', medicationFrequency: '', medicationDuration: '', medicationEndDate: '' }],
                admission: [{ noAdmission: 1, hospitalName: '', admissionDate: '', dischargeDate: '', lengthOfStay: '' }]
            };
        } else {
            // If localStorage is not available, return default form data
            return {
                patientAddress: '',
                physician: '',
                diagnosis: '',
                dateOfDiagnosis: '',
                description: '',
                symptoms: [{ noSymptom: 1, symptomName: '', symptomDuration: '', symptomSeverity: '', symptomLocation: '' }],
                treatmentProcedure: [{ noTP: 1, tp: '', medTeam: '', tpDateStarted: '', tpDateEnd: '', tpDuration: '' }],
                test: [{ noTest: 1, testType: '', orderingPhysician: '', testDate: '', reviewingPhysician: '', testResult: '' }],
                medication: [{ noMedication: 1, medicationType: '', dateOfPrescription: '', medicationPrescribingPhysician: '', medicationReviewingPhysician: '', medicationFrequency: '', medicationDuration: '', medicationEndDate: '' }],
                admission: [{ noAdmission: 1, hospitalName: '', admissionDate: '', dischargeDate: '', lengthOfStay: '' }]
            };
        }
    });

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
                // Ensure hospital address is set before fetching medical history
                if (!hospitalAddress) {
                    await setAddress();
                    return;
                }
    
                //* Retrieve muna ang hospital na currently naka logged in
                const hospitalInfo = await mvContract.methods.getHospitalInfo(hospitalAddress).call();
                const hospitalNameHolder = hospitalInfo[0];
                // console.log(hospitalNameHolder);
                setHospitalName(hospitalNameHolder);
    
                // Update formData with the new hospital name
                setFormData(prevFormData => ({
                    ...prevFormData,
                    admission: [{
                        ...prevFormData.admission[0],
                        hospitalName: hospitalNameHolder
                    }]
                }));
            } catch (error) {
                console.error('Error fetching medical history:', error);
            }
        }
        fetchMedicalHistory();
    }, [hospitalAddress]);
    
    useEffect(() => {
        // Convert formData to a string before storing in localStorage
        const formDataString = JSON.stringify(formData);
        // Save formData to localStorage
        localStorage.setItem('formData', formDataString);
        // console.log('Form data saved to localStorage:', formDataString);
    }, [formData]);


    const clearFormData = () => {
        localStorage.removeItem('formData');
        // console.log('Form data cleared from localStorage.');
    };

    useEffect(() => {
        const timeoutId = setTimeout(clearFormData, 1000);
        return () => clearTimeout(timeoutId);
    }, []);

    const [dateValues, setDateValues] = useState({});

    {/*Set one ref to all date fields*/}
    const dateInputRefs = {
        dateOfDiagnosis: useRef(null),
        tpDateStarted: useRef(null),
        tpDateEnd: useRef(null),
        testDate: useRef(null),
        dateOfPrescription: useRef(null),
        admissionDate: useRef(null),
        dischargeDate: useRef(null),
    };
    
    {/*If pinindot ang date field, lalabas ang mm/dd/yy na format*/}
    const handleDateFocus = (e) => {
        e.target.type = 'date';
    };

    {/*If naglagay ng value si user, set ang type sa date, else sa text to display placeholder.*/}
    const handleDateBlur = (e, name) => {
        const value = dateValues[name] || '';
        if (value) {
            e.target.type = 'date';
        } else {
            e.target.type = 'text';
        }
    };

    useEffect(() => {
        for (const [name, ref] of Object.entries(dateInputRefs)) {
            if (ref.current) {
                const value = dateValues[name] || '';
                ref.current.placeholder = value || ''; // Set an empty string when value is empty
            }
        }
    }, [dateValues]);

    const handleChange = (e, index) => {
        const { name, value } = e.target;
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
            const newTreatmentProcedure = { noTP: formData.treatmentProcedure.length + 1, tp: '', medTeam: '', tpDateStarted: '', tpDateEnd: '', tpDuration: '' };
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
            const newMedication = { noMedication: formData.medication.length + 1, medicationType: '', dateOfPrescription: '', medicationPrescribingPhysician: '', medicationReviewingPhysician: '', medicationFrequency: '', medicationDuration: '', medicationEndDate: ''};
            setFormData({ ...formData, medication: [...formData.medication, newMedication] });
        }
    };

    const handleAddRowAdmission = () => {
        if (formData.admission.length < 3) {
            const newAdmission = { noAdmission: formData.admission.length + 1, hospitalName: '', admissionDate: '', dischargeDate: '', lengthOfStay: ''};
            setFormData({ ...formData, admission: [...formData.admission, newAdmission] });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission 

        const isNegativeDuration = formData.treatmentProcedure.some(tp => parseInt(tp.tpDuration) < 0) ||
                               formData.medication.some(med => parseInt(med.medicationDuration) < 0) ||
                               formData.symptoms.some(symptom => parseInt(symptom.symptomDuration) < 0);
        if (isNegativeDuration) {
            // Handle the error, display a message, or prevent form submission
            toast.error("Duration cannot be negative.");
            return;
        }

        const hospitalInfo = await mvContract.methods.getHospitalInfo(hospitalAddress).call();
        let hospitalNameHolder = hospitalInfo[0];

        //console.log('Form submitted:', formData);
        let patientDiagnosis = '';
        let concatenatedSymptoms = '';
        let concatenatedTreatmentProcedure = '';
        let concatenatedTest = '';

        let formComplete = true; 

        if (!formData.diagnosis || !formData.dateOfDiagnosis || !formData.description) {
            toast.error("Diagnosis form fields are incomplete. Please fill them out."); 
            formComplete = false;
        } else {
            patientDiagnosis = formData.diagnosis + '+' + formData.dateOfDiagnosis + '+' + formData.description;
        }

        if (formData.symptoms.every(symptom => symptom.symptomName && symptom.symptomDuration && symptom.symptomSeverity && symptom.symptomLocation)) {
            concatenatedSymptoms = formData.symptoms.map(symptom => Object.values(symptom).join('+')).join('~');
        } else if (formData.symptoms.some(symptom => symptom.symptomName || symptom.symptomDuration || symptom.symptomSeverity || symptom.symptomLocation)) {
            toast.error("Symptoms form fields are incomplete. Please fill them out.");
            formComplete = false;
        }

        if (formData.treatmentProcedure.every(treatmentProcedure => treatmentProcedure.tp && treatmentProcedure.medTeam && treatmentProcedure.tpDateStarted && treatmentProcedure.tpDuration)) {
            concatenatedTreatmentProcedure = formData.treatmentProcedure.map(tp => Object.values(tp).join('+')).join('~');
        } else if (formData.treatmentProcedure.some(treatmentProcedure => treatmentProcedure.tp || treatmentProcedure.medTeam || treatmentProcedure.tpDateStarted || treatmentProcedure.tpDuration)) {
            toast.error("Treatment/Procedure form fields are incomplete. Please fill them out.");
            formComplete = false;
        }

        if (formData.test.every(test => test.testType && test.orderingPhysician && test.testDate && test.reviewingPhysician && test.testResult)) {
            concatenatedTest = formData.test.map(test => Object.values(test).join('+')).join('~');
        } else if (formData.test.some(test => test.testType || test.orderingPhysician || test.testDate || test.reviewingPhysician || test.testResult)) {
            toast.error("Test form fields are incomplete. Please fill them out.");
            formComplete = false;
        }

        let concatenatedMedication = '';

        if (formData.medication.length > 0) {
            const filledMedicationForms = formData.medication.filter(medication => {
                const filledFieldsCount = Object.values(medication).filter(value => value !== '' && value !== null).length;
                return filledFieldsCount >= 2 && filledFieldsCount <= 7;
            });

            if (filledMedicationForms.length > 0) {
                concatenatedMedication = filledMedicationForms.map(medication => Object.values(medication).join('+')).join('~');
            }
        }

        formData.admission.forEach(admission => {
            const admissionDate = new Date(admission.admissionDate); // Convert admission date string to Date object
            
            if (admission.dischargeDate) {
                // If discharge date is provided, calculate length of stay
                const dischargeDate = new Date(admission.dischargeDate); // Convert discharge date string to Date object
                let lengthOfStayInMs = dischargeDate - admissionDate; // Calculate difference in milliseconds
                
                // If admission and discharge dates are the same, set length of stay to 1 day
                if (lengthOfStayInMs === 0) {
                    lengthOfStayInMs = 1000 * 60 * 60 * 24; // 1 day in milliseconds
                }
                
                const lengthOfStayInDays = Math.ceil(lengthOfStayInMs / (1000 * 60 * 60 * 24));
                admission.lengthOfStay = lengthOfStayInDays; // Assign length of stay to the admission object
            }
        });
        const concatenatedAdmission = formData.admission.map(admission => Object.values(admission).join('+')).join('~');
        console.log(formData.admission);
        
        const patientList = await mvContract.methods.getPatientList().call();
        const isPatientIncluded = patientList.includes(formData.patientAddress);

        if (isPatientIncluded) {
            if (formComplete) {
                // * need below 100 ung length ng diagnosis at description
                if (formData.diagnosis.length < 100 && formData.description.length < 100) {
                    setIsLoading(true);
                    const loadingToastId = toast.info("Adding Medical History, Please wait...", { autoClose: false, draggable: false, closeOnClick: false });
                    try {
                        const receipt = await mvContract.methods.addMedicalHistory(
                            formData.patientAddress,
                            formData.physician,
                            patientDiagnosis,
                            concatenatedSymptoms,
                            concatenatedTreatmentProcedure,
                            concatenatedTest,
                            concatenatedMedication,
                            concatenatedAdmission
                        ).send({ from: hospitalAddress });
                        //console.log("Transaction Hash:", receipt.transactionHash);
                        localStorage.removeItem('formData');
                        toast.dismiss(loadingToastId);
                        toast.success('Medical History Successfully Added!');
                        setIsLoading(false);
                        router.push('/HOSPITAL/PatientRecordsHospital/');

                    } catch (error) {
                        toast.error('Invalid Patient Address');
                        //console.error('Error sending transaction:', error.message);
                    };
                } else {
                    //console.error('Error sending transaction:', error.message);
                    toast.error('Diagnosis and Description should be below 100 letters');
                }
            }
        } else {
            toast.error('Patient is not registered.');
        }
    };

    const goBack = () => {
        window.history.back(); 
    };

    return ( 
        <> 
        <Layout pageName = "Add Medical History">
            <div className={styles.formContainer}>
                <form className={styles.medicalHistoryForm} onSubmit={handleSubmit}>   
                    <div className={styles.formTitle}>Patient MetaMask Address</div>
                        <div className={styles.formRow}>
                            <div className={styles.formField}>
                                <input type="text" id="patient-address" name="patientAddress" placeholder="Patient Address" value={formData.patientAddress} required onChange={handleChange} />
                            </div>
                        </div>
                    <div className={styles.formTitle}>Patient Consultation</div>
                    <div className={styles.formRow}>
                        <div className={styles.formField}>
                            <input type="text" id="physician" name="physician" placeholder="Physician" value={formData.physician} required onChange={handleChange} />
                        </div>
                        <div className={styles.formField}>
                            <input type="text" id="diagnosis" name="diagnosis" placeholder="Diagnosis" value={formData.diagnosis} required onChange={handleChange} />
                        </div>
                        <div className={styles.formField}>
                            <input type="text" id="date-of-diagnosis" name="dateOfDiagnosis" placeholder="Date of Diagnosis" value={formData.dateOfDiagnosis} required onChange={handleChange} onFocus={handleDateFocus} onBlur={(e) => handleDateBlur(e, 'dateOfDiagnosis')}/>
                        </div>
                    </div>
            
                    <div className={styles.formRow}>
                        <div className={styles.formField}>
                            <input type="text" id="description" name="description" placeholder="Description" value={formData.description} required onChange={handleChange} />
                        </div>
                    </div>

                    {/** ----------------------------------- Signs and Symptoms  ----------------------------------- */}
                    <div className={styles.formTitle}>Signs and Symptoms</div>
                    <div className={styles.formRowTitle_sANDs}>
                        <div className={styles.formHeader}>No.</div>
                        <div className={styles.formHeader}>Symptoms</div>
                        <div className={styles.formHeader}>Duration</div>    
                        <div className={styles.formHeader}>Severity</div>
                        <div className={styles.formHeader}>Location</div>     
                    </div>

                    {formData.symptoms.map((symptom, index) => (
                        <div className={styles.formRow} key={index}>
                            <div className={styles.formFieldNum_med}>
                                <input type="text" id="no-symptom"  name="noSymptom" value={symptom.noSymptom} readOnly />
                            </div>
                            <div className={styles.formFieldRow}>
                                <input type="text" id="symptom-name"  name="symptomName" placeholder="Type of Symptoms" value={symptom.symptomName} required onChange={(e) => handleChange(e, index)} />
                            </div>
                            <div className={styles.formFieldRow}>
                                <input type="number" id="symptom-duration" name="symptomDuration" placeholder="Days" value={symptom.symptomDuration} required onChange={(e) => handleChange(e, index)} />
                            </div>
                            <div className={styles.formFieldRow}>
                            <select id="symptom-severity" name="symptomSeverity" value={symptom.symptomSeverity} required onChange={(e) => handleChange(e, index)}>
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
                                <input type="text" id="symptom-location" name="symptomLocation" placeholder="Location" value={symptom.symptomLocation} required onChange={(e) => handleChange(e, index)} />
                            </div>
                        </div>
                    ))}
                    
                    {formData.symptoms.length < 3 && (<button className={styles.addButton} onClick={handleAddRowSymptoms}>ADD MORE SIGNS AND SYMPTOMS</button>)}
                        
                    {/** ----------------------------------- TREATMENT/PROCEDURE  ----------------------------------- */}
                    <div className={styles.formTitle}>Treatment/Procedure</div>
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
                            <div className={styles.formFieldNum_med}>
                                <input type="text" id="noTP"  name="noTP" value={treatmentProcedure.noTP} readOnly />
                            </div>
                            <div className={styles.formFieldRow}>
                                <input type="text" id="t-p"  name="tp" placeholder="Type Treatment/Procedure" value={treatmentProcedure.tp} required onChange={(e) => handleChange(e, index)} />
                            </div>
                            <div className={styles.formFieldRow}>
                                <input type="text" id="med-team"  name="medTeam" placeholder="Type Medical Team/Provider" value={treatmentProcedure.medTeam} required onChange={(e) => handleChange(e, index)} />
                            </div>
                            <div className={styles.formFieldRow}>
                                <input type="text" id="date-started" name="tpDateStarted" placeholder="Date Started" value={treatmentProcedure.tpDateStarted} required onChange={(e) => handleChange(e, index)} onFocus={handleDateFocus} onBlur={(e) => handleDateBlur(e, 'tpDateStarted')} />
                            </div>
                            <div className={styles.formFieldRow}>
                                <input type="text" id="date-end"  name="tpDateEnd" placeholder="Date End" value={treatmentProcedure.tpDateEnd} required onChange={(e) => handleChange(e, index)} onFocus={handleDateFocus} onBlur={(e) => handleDateBlur(e, 'tpDateEnd')} />
                            </div>
                            <div className={styles.formFieldLastCol}>
                                <input type="number" id="tp-duration"  name="tpDuration" placeholder="Duration" value={treatmentProcedure.tpDuration} required onChange={(e) => handleChange(e, index)} />
                            </div>
                        </div>
                    ))}

                    {formData.treatmentProcedure.length < 3 && (<button className={styles.addButton} onClick={handleAddRowTreatmentProcedure}>ADD MORE TREATMENT/PROCEDURE</button>)}
                    
                    {/** ----------------------------------- TEST ----------------------------------- */}
                    
                    <div className={styles.formTitle}>Test</div>
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
                            <div className={styles.formFieldNum_med}>
                                <input type="text" id="no-test"  name="noTest" value={test.noTest} readOnly />
                            </div>
                            <div className={styles.formFieldRow}>
                            <select id="test-type" name="testType" placeholder="Test Type" value={test.testType} required onChange={(e) => handleChange(e, index)}>
                                <option value="" disabled selected>Test Type</option>
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
                                <input type="text" id="ordering-physician"  name="orderingPhysician" placeholder="Ordering Physician" value={test.orderingPhysician} required onChange={(e) => handleChange(e, index)} />
                            </div>
                            <div className={styles.formFieldRow}>
                                <input type="text" id="test-date"  name="testDate" placeholder="Test Date" value={test.testDate} required onChange={(e) => handleChange(e, index)} onFocus={handleDateFocus} onBlur={(e) => handleDateBlur(e, 'testDate')} />
                            </div>
                            <div className={styles.formFieldRow}>
                                <input type="text" id="reviewing-physician"  name="reviewingPhysician" placeholder="Reviewing Physician" value={test.reviewingPhysician} required onChange={(e) => handleChange(e, index)} />
                            </div>
                            <div className={styles.formFieldLastCol}>
                                <input type="text" id="test-result"  name="testResult" placeholder="Test Result" value={test.testResult} required onChange={(e) => handleChange(e, index)} />
                            </div>
                        </div>
                    ))}

                    {formData.test.length < 3 && (<button className={styles.addButton} onClick={handleAddRowTest}>ADD MORE TEST</button>)}        
                    
                    {/** ----------------------------------- MEDICATION ----------------------------------- */}
                    
                    <div className={styles.formTitle}>Medication</div>
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
                                <input type="text" id="medication-type"  name="medicationType" placeholder="Medication Type" value={medication.medicationType} required onChange={(e) => handleChange(e, index)}/>
                            </div>
                            <div className={styles.formFieldRow}>
                                <input type="text" id="date-of-prescription"  name="dateOfPrescription" placeholder="Date of Prescription" value={medication.dateOfPrescription} required onChange={(e) => handleChange(e, index)} onFocus={handleDateFocus} onBlur={(e) => handleDateBlur(e, 'dateOfPrescription')}/>
                            </div>
                            <div className={styles.formFieldRow}>
                                <input type="text" id="medication-prescribing-physician"  name="medicationPrescribingPhysician" placeholder="Prescribing Physician" value={medication.medicationPrescribingPhysician} required onChange={(e) => handleChange(e, index)}/>
                            </div>
                            <div className={styles.formFieldRow}>
                                <input type="text" id="medication-reviewing-physician"  name="medicationReviewingPhysician" placeholder="Reviewing Physician" value={medication.medicationReviewingPhysician} required onChange={(e) => handleChange(e, index)}/>
                            </div>
                            <div className={styles.formFieldRow}>
                                <input type="text" id="medication-frequency"  name="medicationFrequency" placeholder="Frequency" value={medication.medicationFrequency} required onChange={(e) => handleChange(e, index)}/>
                            </div>
                            <div className={styles.formFieldRow}>
                                <input type="number" id="medication-duration"  name="medicationDuration" placeholder="Duration" value={medication.medicationDuration} required onChange={(e) => handleChange(e, index)}/>
                            </div>
                            <div className={styles.formFieldLastCol}>
                                <input type="text" id="medication-end-date"  name="medicationEndDate" placeholder="End Date" value={medication.medicationEndDate} required onChange={(e) => handleChange(e, index)} onFocus={handleDateFocus} onBlur={(e) => handleDateBlur(e, 'medicationDate')}/>
                            </div>
                        </div>
                    ))}

                    {formData.medication.length < 3 && (<button className={styles.addButton} onClick={handleAddRowMedication}>ADD MORE MEDICATION</button>)}        
                    
                    {/** ----------------------------------- ADMISSION ----------------------------------- */}
                    
                    <div className={styles.formTitle}>Admission</div>
                    <div className={styles.formRowTitle_admission}>
                        <div className={styles.formHeader}>No.</div>
                        <div className={styles.formHeader}>Hospital</div>
                        <div className={styles.formHeader}>Admission Date</div>    
                        <div className={styles.formHeader}>Discharge Date</div>
                        {/* <div className={styles.formHeader}>Length of Stay</div>       */}
                    </div>
                    
                    {formData.admission.map((admission, index) => (
                        <div className={styles.formRow} key={index}>
                            <div className={styles.formFieldNum_med}>
                                <input type="text" id="noAdmission"  name="noAdmission" value={admission.noAdmission} readOnly />
                            </div>
                            <div className={styles.formFieldRow}>
                                <input type="text" id="hospital-name"  name="hospitalName" placeholder="Hospital Name" value={hospital} required onChange={(e) => handleChange(e, index)} readOnly/>
                            </div>
                            <div className={styles.formFieldRow}>
                                <input type="text" id="admission-date"  name="admissionDate" placeholder="Admission Date" value={admission.admissionDate} required onChange={(e) => handleChange(e, index)} onFocus={handleDateFocus} onBlur={(e) => handleDateBlur(e, 'admissionDate')}/>
                            </div>
                            <div className={styles.formFieldLastCol}>
                                <input type="text" id="discharge-date"  name="dischargeDate" placeholder="Discharge Date" value={admission.dischargeDate} required onChange={(e) => handleChange(e, index)} onFocus={handleDateFocus} onBlur={(e) => handleDateBlur(e, 'dischargeDate')}/>
                            </div>
                        </div>
                    ))}

                    {formData.admission.length < 3 && (<button className={styles.addButton} onClick={handleAddRowAdmission}>ADD MORE ADMISSION</button>)}        

                    <button className={`${styles.addMedicalHistoryButton} ${isLoading ? 'loading' : ''}`} onClick={handleSubmit} disabled={isLoading}> 
                        {isLoading ? 'Adding...' : 'Add Medical History'}
                    </button>
    
                </form>
            </div>
        </Layout>
        <ToastWrapper/>
        </>
    );
}

export default addMedicalHistory;