import LandingPageHeader from "@/components/landingPageHeader";
import RegistrationProcess from "@/components/RegistrationProcess";
import styles from '../../styles/register.module.css'; /** "../" means, lalabas ka sa isang folder. Since nasa patient, then pages folder currently itong page, need niya lumabas 2 folder para ma-access ang styles folder. */
import Link from "next/link";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import web3 from "../../blockchain/web3";
import mvContract from "../../blockchain/mediverse";
import ToastWrapper from "@/components/ToastWrapper";
import { toast } from 'react-toastify';


const Register2Hospital = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    // const [formData, setFormData] = useState({ 
       
    //     hospitalName: '', contactNumber: '', hospitalAddress: ''
    // });

    const [formData, setFormData] = useState(() => {
        // Check if localStorage is available
        if (typeof window !== 'undefined' && window.localStorage) {
            // Retrieve form data from localStorage when the component mounts
            const savedFormData = localStorage.getItem('formData');
            return savedFormData ? JSON.parse(savedFormData) : {
                hospitalName: '', contactNumber: '', hospitalAddress: ''
         };
        } else {
            // If localStorage is not available, return default form data
            return {
                hospitalName: '', contactNumber: '', hospitalAddress: ''
            };
        }
    });
    
    useEffect(() => {
        // Convert formData to a string before storing in localStorage
        const formDataString = JSON.stringify(formData);
        // Save formData to localStorage
        localStorage.setItem('formData', formDataString);
        // console.log('Form data saved to localStorage:', formDataString);
    }, [formData]);

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
        router.push('/HOSPITAL/Register3Hospital/');
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
                                <input type="text" id="hospital-name" name="hospitalName" placeholder="Hospital Name" value={formData.hospitalName} required onChange={handleChange} />
                            </div>
                            <div className={styles.formField}>
                                <input type="text" id="contact-number" name="contactNumber" placeholder="Contact Number" value={formData.contactNumber} required onChange={handleChange} />
                            </div>
                        </div>

                        <div className={styles.formRow}>
                            <div className={styles.formField}>
                                <input type="text" id="hospital-address" name="hospitalAddress" placeholder="Hospital Address" value={formData.hospitalAddress} required onChange={handleChange} />
                            </div>
                        </div>
                        
                        <button className={styles.submitButton} onClick={handleSubmit}>PROCEED</button>
                        
                    </form>
                
                </div>

            <ToastWrapper/>
        </>
        
    );
};

export default Register2Hospital;