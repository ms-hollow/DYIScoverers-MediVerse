import LandingPageHeader from "@/components/landingPageHeader";
import RegistrationProcess from "@/components/RegistrationProcess";
import styles from '../../styles/register.module.css'; /** "../" means, lalabas ka sa isang folder. Since nasa patient, then pages folder currently itong page, need niya lumabas 2 folder para ma-access ang styles folder. */
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from 'react';
import web3 from "../../blockchain/web3";
import mvContract from "../../blockchain/mediverse"; // ABI


const Register3Patient = () => {
    const [patientFullName, setPatientFullName] = useState('');
    
    const [formData, setFormData] = useState({ 
        /**ADD HERE ALL THE NAMES OF VARIABLES IN THE FORM. Then you can use "formData.[variable]" to access the value of a field*/  
        firstName: '', 
        middleName: '', 
        lastName: '',
        age: '',
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

    useEffect(() => {
        async function fetchPatientInfo() {
            try {
                // Connect to the deployed smart contract
                const accounts = await web3.eth.getAccounts();
    
                //console.log("Account:", accounts[0]);
    
                // Call the getPatientInfo function on the smart contract
                const patientInfo = await mvContract.methods.getPatientInfo(accounts[0]).call(); // Assuming you have a method in your contract to get patient data by account address
            
                // Splitting the patient full name and full address to subcategories
                const patientFullName = patientInfo[0].split('+');
                const patientFullAddress = patientInfo[6].split('+');

                // Set patient full name state
                setPatientFullName(patientFullName);

                // Set form data with patient info
                setFormData({
                    ...formData,
                    firstName: patientFullName[0], // Set first name
                    middleName: patientFullName[1], // Set middle name
                    lastName: patientFullName[2], // Set last name
                    age: patientInfo[1], // Set age
                    // TODO: ayusin ung formatting sa solidity
                    // TODO: sa gender convert to string
                    dob: patientInfo[2],
                    phoneNumber: patientInfo[3],
                    height: patientInfo[4],
                    weight: patientInfo[5],
                    houseNo: patientFullAddress[0],
                    streetNo: patientFullAddress[1],
                    barangay: patientFullAddress[2],
                    cityMunicipality: patientFullAddress[3],
                    region: patientFullAddress[4]
                    // Set other form fields accordingly
                });
                console.log()
                // Log the patient information to the console
                /** 
                console.log('Patient First Name:', patientFullName[0]);
                console.log('Patient Middle Name:', patientFullName[1]);
                console.log('Patient Last Name:', patientFullName[2]);
                console.log('Gender:', patientInfo[1]);
                console.log('Date of Birth:', patientInfo[2]);
                console.log('Height:', patientInfo[3]);
                console.log('Weight:', patientInfo[4]);
                console.log('Contact Number:', patientInfo[5]);
                
                console.log('House No:', patientFullAddress[0]);
                console.log('Street No:', patientFullAddress[1]);
                console.log('Barangay:', patientFullAddress[2]);
                console.log('Municipality:', patientFullAddress[3]);
                console.log('Region:', patientFullAddress[4]);
    
                console.log('Authorized Hospitals:', patientInfo[7]);
                console.log('Registration Date:', patientInfo[8]);*/

                
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

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission

        
    };

   
    const goBack = () => {
        window.history.back(); // Go back to the previous page
    };

    return (
        <>
            {/*KUHANIN DATA, ILAGAY SA FIELD, THEN READ ONLY.*/}
            <div> {/* Pass here yung Text na want ilagay sa call-t-action button ng landingPage header */}
                <LandingPageHeader buttonText="LOG IN" />
            </div>

            <RegistrationProcess 
                firstShapeColor="shapeBlue"
                secondShapeColor="shapeBlue"
                thirdShapeColor="shapeCyan"
            />

            <div className={styles.formContainer}>

                <div className={styles.formTitle}>Confirmation</div>

                <button className={styles.backButton} onClick={goBack}>
                    ←
                </button>

                <form className={styles.registrationForm} onSubmit={handleSubmit}>
                    <div className={styles.formRow}>
                        <div className={styles.formField}>
                            <input type="text" id="first-name" name="firstName" placeholder="First Name" required onChange={handleChange} value={formData.firstName} readOnly />
                        </div>
                        <div className={styles.formField}>
                            <input type="text" id="middle-name" name="middleName" placeholder="Middle Name" required onChange={handleChange} value={formData.middleName} readOnly />
                        </div>
                        <div className={styles.formField}>
                            <input type="text" id="last-name" name="lastName" placeholder="Last Name" required onChange={handleChange} value={formData.lastName} readOnly />
                        </div>
                    </div>

                    <div className={styles.formRow}>
                        <div className={styles.formField}>
                            <input type="number" id="age" name="age" placeholder="Age" required onChange={handleChange} value={formData.age} readOnly />
                        </div>
                        <div className={styles.formField}>
                            <input type="text" id="gender" name="gender" placeholder="Gender" required onChange={handleChange} value={formData.gender} readOnly />
                        </div>
                        <div className={styles.formField}>
                            <input type="text" id="birth-date" name="dob" placeholder="Date of Birth" required onChange={handleChange} value={formData.dob} readOnly />
                        </div>
                    </div>

                    <div className={styles.formRow}>
                        <div className={styles.formField}>
                            <input type="tel" id="phone-number" name="phoneNumber" placeholder="Phone Number" required onChange={handleChange} value={formData.phoneNumber} readOnly />
                        </div>
                        <div className={styles.formField}>
                            <input type="text" id="height" name="height" placeholder="Height" required onChange={handleChange} value={formData.height} readOnly />
                        </div>
                        <div className={styles.formField}>
                            <input type="text" id="weight" name="weight" placeholder="Weight" required onChange={handleChange} value={formData.weight}  readOnly />
                        </div>
                    </div>

                    <div className={styles.formRow}>
                        <div className={styles.formField}>
                            <input type="text" id="house-no" name="houseNo" placeholder="House No." required onChange={handleChange} value={formData.houseNo} readOnly />
                        </div>
                        <div className={styles.formField}>
                            <input type="text" id="street-no" name="streetNo" placeholder="Street No." required onChange={handleChange} value={formData.streetNo} readOnly />
                        </div>
                        <div className={styles.formField}>
                            <input type="text" id="barangay" name="barangay" placeholder="Barangay" required onChange={handleChange} value={formData.barangay} readOnly />
                        </div>
                        <div className={styles.formField}>
                            <input type="text" id="city-municipality" name="cityMunicipality" placeholder="City/Municipality" required onChange={handleChange} value={formData.cityMunicipality} readOnly />
                        </div>
                        <div className={styles.formField}>
                            <input type="text" id="region" name="region" placeholder="Region" required onChange={handleChange} value={formData.region} readOnly />
                        </div>
                    </div>
                    
                    <button className={styles.submitButton} onClick={handleSubmit}>
                        <Link href="">REGISTER</Link>
                    </button>
                </form>
            </div>
        </>
        
    );
};
export default Register3Patient;
