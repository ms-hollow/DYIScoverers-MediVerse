import LandingPageHeader from "@/components/landingPageHeader";
import RegistrationProcess from "@/components/RegistrationProcess";
import Layout from '../../components/HomeSidebarHeader.js';
import styles from '../../styles/accountProfilePatient.module.css'; /** "../" means, lalabas ka sa isang folder. Since nasa patient, then pages folder currently itong page, need niya lumabas 2 folder para ma-access ang styles folder. */
import Link from "next/link";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import web3 from "../../blockchain/web3";
import mvContract from "../../blockchain/mediverse"; // ABI
import ToastWrapper from "@/components/ToastWrapper";
import { toast } from 'react-toastify';

const AccountProfilePatient = () => {
    const router = useRouter();
    const [patientFullName, setPatientFullName] = useState('');
    const [patientAddress, setPatientAddress] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const [formData, setFormData] = useState({ 
        firstName: '', 
        middleName: '', 
        lastName: '',
        age: '',
        gender: '',
        dob: '',
        phoneNumber: '',
        height: '',
        weight: '',
        houseNo: '',
        streetNo: '',
        barangay: '',
        cityMunicipality: '',
        region: ''
    });

    const [editable, setEditable] = useState(false); // State variable to track edit mode

    useEffect(() => {
        async function fetchPatientInfo() {
            try {
                // Connect to the deployed smart contract
                const accounts = await web3.eth.getAccounts();
                setPatientAddress(accounts[0]);
                //console.log("Account:", accounts[0]);
    
                // Call the getPatientInfo function on the smart contract
                const patientInfo = await mvContract.methods.getPatientInfo(accounts[0]).call(); 
                
                console.log(patientInfo)
                // Splitting the patient full name and full address to subcategories
                const patientFullName = patientInfo[0].split('+');
                const patientFullAddress = patientInfo[7].split('+');

                // Set patient full name state
                setPatientFullName(patientFullName);

                // Set form data with patient info
                setFormData({
                    ...formData,
                    firstName: patientFullName[0], // Set first name
                    middleName: patientFullName[1], // Set middle name
                    lastName: patientFullName[2], // Set last name
                    age: patientInfo[1], // Set age
                    gender: patientInfo[2],
                    dob: patientInfo[3],
                    phoneNumber: patientInfo[4],
                    height: patientInfo[5],
                    weight: patientInfo[6],
                    houseNo: patientFullAddress[0],
                    streetNo: patientFullAddress[1],
                    barangay: patientFullAddress[2],
                    cityMunicipality: patientFullAddress[3],
                    region: patientFullAddress[4]
                    // Set other form fields accordingly
                });

            } catch (error) {
                console.error('Error retrieving patient information:', error);
            }
        }

        fetchPatientInfo();
    }, []); // Empty dependency array to run only once when component mounts
    

    {/** Function that handles changes in the form fields. It is triggered by the 'onChange' event. */}
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleEdit = (e) => {
        e.preventDefault();
        setEditable(!editable); // pagpinindot ang edit button, gagawing editable ang fields. 
    };

    const saveEditedProfile = async () => {
        setIsLoading(true);

        const address = `${formData.houseNo}+${formData.streetNo}+${formData.barangay}+${formData.cityMunicipality}+${formData.region}`;
        const name = `${formData.firstName}+${formData.middleName}+${formData.lastName}`;

        try {
           await mvContract.methods.editPatientDetails(
                name,
                formData.age,
                formData.gender,
                formData.dob,
                formData.phoneNumber,
                formData.height,
                formData.weight,
                address
            ).send({ from: patientAddress });
            console.log('Patient details updated successfully');
            setEditable(false);
            setIsLoading(false);
        } catch (error) {
            console.error('Error updating patient details:', error);
            toast.error('Error updating patient details.');
        }
    }

    return (
        <>
        <Layout pageName = "Account Profile">

            {/*KUHANIN DATA, ILAGAY SA FIELD, THEN READ ONLY.*/}
            <div> {/* Pass here yung Text na want ilagay sa button pati yung link */}
                <LandingPageHeader buttonText="LOG IN" buttonLink= "/PATIENT/logInPatient/" />
            </div>

            <div className={styles.formTitle}>Account Information</div>
            <form className={styles.registrationForm} onSubmit={handleEdit}>
                <div className={styles.formContainer}>
                    <div className={styles.formRow}>
                        <div className={styles.formField}>
                            <label htmlFor="first-name" className={styles.formLabel}>First Name:</label>
                            <input type="text" id="first-name" name="firstName" required onChange={handleChange} value={formData.firstName} readOnly={!editable} />
                        </div>
                        <div className={styles.formField}>
                            <label htmlFor="middle-name" className={styles.formLabel}>Middle Name:</label>
                            <input type="text" id="middle-name" name="middleName" required onChange={handleChange} value={formData.middleName} readOnly={!editable} />
                        </div>
                        <div className={styles.formField}>
                            <label htmlFor="last-name" className={styles.formLabel}>Last Name:</label>
                            <input type="text" id="last-name" name="lastName" required onChange={handleChange} value={formData.lastName} readOnly={!editable} />
                        </div>
                    </div>

                    <div className={styles.formRow}>
                        <div className={styles.formField}>
                            <label htmlFor="age" className={styles.formLabel}>Age:</label>
                            <input type="number" id="age" name="age" required onChange={handleChange} value={formData.age} readOnly={!editable} />
                        </div>
                        <div className={styles.formField}>
                            <label htmlFor="gender" className={styles.formLabel}>Gender:</label>
                            <input type="text" id="gender" name="gender" required onChange={handleChange} value={formData.gender} readOnly={!editable} />
                        </div>
                        <div className={styles.formField}>
                            <label htmlFor="birth-date" className={styles.formLabel}>Date of Birth:</label>
                            <input type="text" id="birth-date" name="dob" required onChange={handleChange} value={formData.dob} readOnly={!editable} />
                        </div>
                        <div className={styles.formField}>
                            <label htmlFor="height" className={styles.formLabel}>Height:</label>
                            <input type="text" id="height" name="height" required onChange={handleChange} value={formData.height} readOnly={!editable} />
                        </div>
                        <div className={styles.formField}>
                            <label htmlFor="weight" className={styles.formLabel}>Weight:</label>
                            <input type="text" id="weight" name="weight" required onChange={handleChange} value={formData.weight} readOnly={!editable} />
                        </div>
                    </div>
                </div>
            
                <div className={styles.formTitle2}>Contact Information</div>
                <div className={styles.formContainer}>
                    <div className={styles.formRow}>
                        <div className={styles.formField}>
                            <label htmlFor="phone-number" className={styles.formLabel}>Phone Number:</label>
                            <input type="tel" id="phone-number" name="phoneNumber" required onChange={handleChange} value={formData.phoneNumber} readOnly={!editable} />
                        </div>
                        <div className={styles.formField}>
                            <label htmlFor="house-no" className={styles.formLabel}>House No:</label>
                            <input type="text" id="house-no" name="houseNo" required onChange={handleChange} value={formData.houseNo} readOnly={!editable} />
                        </div>
                        <div className={styles.formField}>
                            <label htmlFor="street-no" className={styles.formLabel}>Street No:</label>
                            <input type="text" id="street-no" name="streetNo" required onChange={handleChange} value={formData.streetNo} readOnly={!editable} />
                        </div>
                    </div>

                    <div className={styles.formRow}>
                        <div className={styles.formField}>
                            <label htmlFor="barangay" className={styles.formLabel}>Barangay:</label>
                            <input type="text" id="barangay" name="barangay" required onChange={handleChange} value={formData.barangay} readOnly={!editable} />
                        </div>
                        <div className={styles.formField}>
                            <label htmlFor="city-municipality" className={styles.formLabel}>City/Municipality:</label>
                            <input type="text" id="city-municipality" name="cityMunicipality" required onChange={handleChange} value={formData.cityMunicipality} readOnly={!editable} />
                        </div>
                        <div className={styles.formField}>
                            <label htmlFor="region" className={styles.formLabel}>Region:</label>
                            <input type="text" id="region" name="region" required onChange={handleChange} value={formData.region} readOnly={!editable} />
                        </div>
                    </div>
                </div>
            </form>

            <button className={styles.editButton} onClick={editable ? saveEditedProfile : handleEdit} disabled={isLoading}>
                {isLoading ? <span>Loading...</span> : (editable ? <span>SAVE</span> : <span>EDIT</span>)}
            </button>
            
        </Layout>
        <ToastWrapper/>
        </>
        
    );
};
export default AccountProfilePatient;
