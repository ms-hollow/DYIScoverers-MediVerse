import LandingPageHeader from "@/components/landingPageHeader";
import RegistrationProcess from "@/components/RegistrationProcess";
import styles from '../../styles/register.module.css'; /** "../" means, lalabas ka sa isang folder. Since nasa patient, then pages folder currently itong page, need niya lumabas 2 folder para ma-access ang styles folder. */
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import web3 from "../../blockchain/web3";
import mvContract from "../../blockchain/mediverse"; // ABI
{/*FOR TOAST NOTIFICATION */}
import ToastWrapper from "@/components/ToastWrapper";
import { toast } from 'react-toastify';


const Register3Patient = () => {
    const router = useRouter();
    const [patientFullName, setPatientFullName] = useState('');
    
    const [formData, setFormData] = useState({ 
        /**ADD HERE ALL THE NAMES OF VARIABLES IN THE FORM. Then you can use "formData.[variable]" to access the value of a field*/  
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

    useEffect(() => {
        async function fetchPatientInfo() {
            try {
                // Connect to the deployed smart contract
                const accounts = await web3.eth.getAccounts();
    
                //console.log("Account:", accounts[0]);
    
                // Call the getPatientInfo function on the smart contract
                const patientInfo = await mvContract.methods.getPatientInfo(accounts[0]).call(); // Assuming you have a method in your contract to get patient data by account address
                
                // console.log(patientInfo)
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

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission
        toast.success('Successfully Registered!'); {/*can also be: .info, .warning, .error */}
        router.push('/PATIENT/HomePatient');
    };

   
    const goBack = () => {
        window.history.back(); // Go back to the previous page
    };

    return (
        <>
            {/*KUHANIN DATA, ILAGAY SA FIELD, THEN READ ONLY.*/}
            <div> {/* Pass here yung Text na want ilagay sa button pati yung link */}
                <LandingPageHeader buttonText="LOG IN" buttonLink= "/PATIENT/logInPatient/" />
            </div>
            <div className= {styles.registrationContainer}>
                <RegistrationProcess 
                    firstShapeColor="shapeBlue"
                    secondShapeColor="shapeBlue"
                    thirdShapeColor="shapeCyan"
                />

                <div className={styles.formContainer}>

                    <div className={styles.formTitle}>
                        <button className={styles.backButton} onClick={goBack}>←</button>
                        Confirmation
                    </div>

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
                                <input type="text" id="street-no" name="streetNo" placeholder="Street" required onChange={handleChange} value={formData.streetNo} readOnly />
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
                        
                        <button className={styles.submitButton}>REGISTER</button>
                    </form>

                    <ToastWrapper/> {/*Lagy to sa dulo ng container, */}
                    
                </div>
                <ToastWrapper/>
            </div>
        </>
        
    );
};
export default Register3Patient;