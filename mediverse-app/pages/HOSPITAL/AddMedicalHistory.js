import styles from '../../styles/addMedicalHistory.module.css';
import Layout from '../../components/HomeSidebarHeader.js'
import path from 'path';
import Link from "next/link";
import React, { useState } from 'react';
import web3 from "../../blockchain/web3";
import mvContract from '../../blockchain/mediverse';


const addMedicalHistory = () => {

    const [formData, setFormData] = useState({ 
        physician: '',
        diagnosis: '',
        dateOfDiagnosis: '',
        description: '',
        symptoms: [{ no: 1, name: '', duration: '', severity: '', location: '' }]
    });

    const handleChange = (e, index) => {
        const { name, value } = e.target;
        if (name === 'symptomName' || name === 'symptomDuration' || name === 'symptomSeverity' || name === 'symptomLocation') {
            const updatedSymptoms = [...formData.symptoms];
            updatedSymptoms[index][name] = value;
            setFormData({ ...formData, symptoms: updatedSymptoms });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleAddRow = () => {
        if (formData.symptoms.length < 3) {
            const newSymptom = { no: formData.symptoms.length + 1, name: '', duration: '', severity: '', location: '' };
            setFormData({ ...formData, symptoms: [...formData.symptoms, newSymptom] });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission 
        console.log('Form submitted:', formData);
    };

    const goBack = () => {
        window.history.back(); 
    };

    return (  
        <Layout pageName = "Add Medical History">
        <>
        <div className={styles.formContainer}>
                <form className={styles.medicalHistoryForm} onSubmit={handleSubmit}>   
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

                    {/**SIGNS AND SYMPTOMS */}
                    <div className={styles.formTitle}>Signs and Symptoms</div>
                    <div className={styles.formRowTitle}>
                        <div className={styles.formHeader}>No.</div>
                        <div className={styles.formHeader}>Symptoms</div>
                        <div className={styles.formHeader}>Duration</div>    
                        <div className={styles.formHeader}>Severity</div>
                        <div className={styles.formHeader}>Location</div>     
                    </div>

                    {/** HERE */}
                    {formData.symptoms.map((symptom, index) => (
                        <div className={styles.formRow} key={index}>
                            <div className={styles.formFieldNum}>
                                <input type="text" id="no"  name="no" value={symptom.no} readOnly />
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
                            <div className={styles.formFieldRow}>
                                <input type="text" id="symptom-location" name="symptomLocation" placeholder="Location" required onChange={(e) => handleChange(e, index)} />
                            </div>
                        </div>
                    ))}
                    
                    {formData.symptoms.length < 3 && (<button className={styles.addButton} onClick={handleAddRow}>ADD MORE SIGNS AND SYMPTOMS</button>)}

                    <button className={styles.submitButton}>Add Patient
                        {/**<Link href="/PATIENT/Register3Patient/">Add Patient</Link> */}
                    </button>


                </form>
            </div>
        
        </>
        </Layout>
    );
}

export default addMedicalHistory;
