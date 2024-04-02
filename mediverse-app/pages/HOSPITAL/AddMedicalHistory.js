import styles from '../../styles/UpdateMedicalHistory.module.css';
import Layout from '../../components/HomeSidebarHeader.js'
import path from 'path';
import Link from "next/link";
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import web3 from "../../blockchain/web3";
import mvContract from '../../blockchain/mediverse';

/**
 * TODO: Concatenate physician, diagnosis and dateOfDiagnosis then save sa isang variable
 * TODO: Concatenate ang arrays ng symptoms, treatmentProcedure, test, medication and admission. Use symbols like "+" or anything para may mark siya
 * ! Note: sa solidity natin ito lang lahat ng variables for medical history ay patientAddress, physician, diagnosis, signsAndSymptoms, treatmentProcedure,
 * ! tests, medication, and admission
 * * Lagi i-test ang smart contract sa remix then tignan kung paano ito gumagana.
 */

const addMedicalHistory = () => {
    const router = useRouter();

    const [formData, setFormData] = useState({ 
        patientAddress: '',
        physician: '',
        diagnosis: '',
        dateOfDiagnosis: '',
        description: '',
        symptoms: [{ noSymptom: 1, symptomName: '', symptomDuration: '', symptomSeverity: '', symptomLocation: '' }],
        treatmentProcedure: [{noTP: 1, tp: '', medTeam: '' , tpDateStarted: '', tpDateEnd: '', tpDuration: ''}],
        test: [{noTest: 1, testType: '', orderingPhysician: '', testDate: '', reviewingPhysician: '', testResult: ''}],
        medication: [{noMedication: 1, medicationType: '', dateOfPrescription: '', medicationPrescribingPhysician: '', medicationReviewingPhysician: '', medicationFrequency: '', medicationDuration: '', medicationEndDate: ''}],
        admission: [{noAdmission: 1, hospitalName: '', admissionDate: '', dischargeDate: '', lengthOfStay: ''}] 
    });

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

        } else if (name === 'tp' || name === 'tpDateStarted' || name === 'tpDateEnd' || name === 'tpDuration') {
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

        } else if (name === 'medicationType' || name === 'dateOfPrescription' || name === 'medicationReviewingPhysician' || name === 'medicationFrequency' || name === 'medicationDuration' || name === 'medicationEndDate') {
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

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission 
        console.log('Form submitted:', formData);
        // Concatenate physician, diagnosis, and dateOfDiagnosis
        const patientDiagnosis =  formData.diagnosis + '+' + formData.dateOfDiagnosis + '+' + formData.description;

        // Concatenate arrays using symbols
        const concatenatedSymptoms = formData.symptoms.map(symptom => Object.values(symptom).join('+')).join('/');
        const concatenatedTreatmentProcedure = formData.treatmentProcedure.map(tp => Object.values(tp).join('+')).join('/');
        const concatenatedTest = formData.test.map(test => Object.values(test).join('+')).join('/');
        const concatenatedMedication = formData.medication.map(medication => Object.values(medication).join('+')).join('/');
        const concatenatedAdmission = formData.admission.map(admission => Object.values(admission).join('+')).join('/');
        
        // console.log('Patient Consultation:', patientDiagnosis);
        // console.log('Concatenated Symptoms:', concatenatedSymptoms);
        // console.log('Concatenated Treatment/Procedure:', concatenatedTreatmentProcedure);
        // console.log('Concatenated Test:', concatenatedTest);
        // console.log('Concatenated Medication:', concatenatedMedication);
        // console.log('Concatenated Admission:', concatenatedAdmission);

        try {
            const accounts = await web3.eth.getAccounts(); // Get the accounts from MetaMask
            console.log("Account:", accounts[0]);
            const receipt = await mvContract.methods.addMedicalHistory(
                formData.patientAddress,
                formData.physician,
                patientDiagnosis,
                concatenatedSymptoms,
                concatenatedTreatmentProcedure,
                concatenatedTest,
                concatenatedMedication,
                concatenatedAdmission
            ).send({ from: accounts[0] });
            console.log("Transaction Hash:", receipt.transactionHash);
            router.push('/HOSPITAL/Register1Hospital/');
        } catch (error) {
            //console.error('Error sending transaction:', error.message);
            alert('Patient is not registered.');
        }
    };

    const goBack = () => {
        window.history.back(); 
    };

    return (  
        <Layout pageName = "Add Medical History">
        <>
        <div className={styles.formContainer}>
                <form className={styles.medicalHistoryForm} onSubmit={handleSubmit}>   
                    <div className={styles.formTitle}>Patient Address</div>
                        <div className={styles.formRow}>
                            <div className={styles.formField}>
                                <input type="text" id="patient-address" name="patientAddress" placeholder="Patient Address" required onChange={handleChange} />
                            </div>
                        </div>
                    <div className={styles.formTitle}>Patient Consultation</div>
                    <div className={styles.formRow}>
                        <div className={styles.formField}>
                            <input type="text" id="physician" name="physician" placeholder="Physician" required onChange={handleChange} />
                        </div>
                        <div className={styles.formField}>
                            <input type="text" id="diagnosis" name="diagnosis" placeholder="Diagnosis" required onChange={handleChange} />
                        </div>
                        <div className={styles.formField}>
                            <input type="date" id="date-of-diagnosis" name="dateOfDiagnosis" placeholder="Date of Diagnosis" required onChange={handleChange} />
                        </div>
                    </div>
            
                    <div className={styles.formRow}>
                        <div className={styles.formField}>
                            <input type="text" id="description" name="description" placeholder="Description" required onChange={handleChange} />
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
                            <div className={styles.formFieldNum}>
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

                    <button className={styles.submitButton} onClick={handleSubmit}>Add Medical History
                            {/**<Link href="/PATIENT/Register3Patient/">Add Patient</Link> */}
                    </button>
    
                </form>
            </div>
        
        </>
        </Layout>
    );
}

export default addMedicalHistory;
