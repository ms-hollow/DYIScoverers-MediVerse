import LandingPageHeader from "@/components/landingPageHeader";
import RegistrationProcess from "@/components/RegistrationProcess";
import styles from '../../styles/registerHospital.module.css'; /** "../" means, lalabas ka sa isang folder. Since nasa patient, then pages folder currently itong page, need niya lumabas 2 folder para ma-access ang styles folder. */
import Link from "next/link";
import React, { useState, useEffect } from 'react';
import web3 from "../../blockchain/web3";
import mvContract from "../../blockchain/mediverse"; // ABI
import { useRouter } from 'next/router';


const Register2Hospital = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({ 
        /**ADD HERE ALL THE NAMES OF VARIABLES IN THE FORM. Then you can use "formData.[variable]" to access the value of a field*/  
        hospitalName: '', contactNumber: '', hospitalAddress: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    useEffect(() => {
        async function fetchPatientInfo() {
            try {
                // Connect to the deployed smart contract
                const accounts = await web3.eth.getAccounts();
    
                //console.log("Account:", accounts[0]);
    
                // Call the getPatientInfo function on the smart contract
                const hospitalInfo = await mvContract.methods.getHospitalInfo(accounts[0]).call(); // Assuming you have a method in your contract to get patient data by account address
                
                console.log(hospitalInfo)
                

                // Set form data with patient info
                setFormData({
                    ...formData,
                    hospitalName: hospitalInfo[0], 
                    contactNumber: hospitalInfo[1], 
                    hospitalAddress: hospitalInfo[2]
                });

                
            } catch (error) {
                console.error('Error retrieving patient information:', error);
            }
        }

        fetchPatientInfo();
    }, []); // Empty dependency array to run only once when component mounts

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent default form submission
        console.log('Form submitted:', formData);
        alert('User Register Successfully!');
        router.push('/HOSPITAL/HomeHospital');
        
    };

    const goBack = () => {
        window.history.back(); // Go back to the previous page
    };

    return (
        <>
            <div> {/* Pass here yung Text na want ilagay sa button pati yung link */}
                <LandingPageHeader buttonText="LOG IN" buttonLink= "/PATIENT/logInPatient/" />
            </div>

            <RegistrationProcess 
                firstShapeColor="shapeBlue"
                secondShapeColor="shapeBlue"
                thirdShapeColor="shapeCyan"
            />

            <div className={styles.formContainer}>
                <button className={styles.backButton} onClick={goBack}>←</button>
                <div className={styles.formTitle}>Hospital Details</div>
                <form className={styles.registrationForm} onSubmit={handleSubmit}>
                    <div className={styles.formRow}>
                        <div className={styles.formField}>
                            <input type="text" id="hospital-name" name="hospitalName" placeholder="Hospital Name" required onChange={handleChange} value={formData.hospitalName} readOnly/>
                        </div>
                        <div className={styles.formField}>
                            <input type="text" id="contact-number" name="contactNumber" placeholder="Contact Number" required onChange={handleChange} value={formData.contactNumber} readOnly/>
                        </div>
                    </div>

                    <div className={styles.formRow}>
                        <div className={styles.formField}>
                            <input type="text" id="hospital-address" name="hospitalAddress" placeholder="Hospital Address" required onChange={handleChange} value={formData.hospitalAddress} readOnly/>
                        </div>
                    </div>
                    
                    <button className={styles.submitButton} onClick={handleSubmit}>PROCEED</button>

                </form>
            </div>
        </>
        
    );
};

export default Register2Hospital;
