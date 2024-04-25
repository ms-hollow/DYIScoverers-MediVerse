import LandingPageHeader from "@/components/landingPageHeader";
import RegistrationProcess from "@/components/RegistrationProcess";
import styles from '../../styles/registerHospital.module.css'; /** "../" means, lalabas ka sa isang folder. Since nasa patient, then pages folder currently itong page, need niya lumabas 2 folder para ma-access ang styles folder. */
import Link from "next/link";
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import web3 from "../../blockchain/web3";
import mvContract from "../../blockchain/mediverse";
import ToastWrapper from "@/components/ToastWrapper";
import { toast } from 'react-toastify';


const Register2Hospital = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

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

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission
        const requiredFields = ['hospitalName', 'contactNumber', 'hospitalAddress'];
        
        const isEmpty = requiredFields.some(field => !formData[field]);

        if (isEmpty) {
            toast.warning
            return; // Exit early if any required field is empty
        }
        
        //console.log('Form submitted:', formData);
        setIsLoading(true);
        try {
            const accounts = await web3.eth.getAccounts(); // Get the accounts from MetaMask
            //console.log("Account:", accounts[0]);
            const receipt = await mvContract.methods.registerHospital(formData.hospitalName, formData.contactNumber, formData.hospitalAddress).send({ from: accounts[0] });
            //console.log("Transaction Hash:", receipt.transactionHash);
            setIsLoading(false);
            router.push('/HOSPITAL/Register3Hospital/');
        } catch (error) {
            console.error('Error sending transaction:', error.message);
            toast.error('Error Registering.');
        }
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
                secondShapeColor="shapeCyan"
                thirdShapeColor="shapeBlue"
            />

            <div className={styles.formContainer}>
                <div className={styles.formTitle}>
                    <button className={styles.backButton} onClick={goBack}>←</button>
                    Hospital Details
                </div>
                <form className={styles.registrationForm} onSubmit={handleSubmit}>
                    <div className={styles.formRow}>
                        <div className={styles.formField}>
                            <input type="text" id="hospital-name" name="hospitalName" placeholder="Hospital Name" required onChange={handleChange} />
                        </div>
                        <div className={styles.formField}>
                            <input type="text" id="contact-number" name="contactNumber" placeholder="Contact Number" required onChange={handleChange} />
                        </div>
                    </div>

                    <div className={styles.formRow}>
                        <div className={styles.formField}>
                            <input type="text" id="hospital-address" name="hospitalAddress" placeholder="Hospital Address" required onChange={handleChange} />
                        </div>
                    </div>
                    
                    {/* <button className={styles.submitButton} onClick={handleSubmit}>PROCEED</button> */}
                    <button className={`${styles.submitButton} ${isLoading ? 'loading' : ''}`} onClick={handleSubmit} disabled={isLoading}> 
                        {isLoading ? 'PROCEEDING...' : 'PROCEED'}
                    </button>
                </form>
            </div>
            <ToastWrapper/>
        </>
        
    );
};

export default Register2Hospital;