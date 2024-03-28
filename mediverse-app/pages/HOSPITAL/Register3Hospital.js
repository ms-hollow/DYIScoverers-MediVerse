import LandingPageHeader from "@/components/landingPageHeader";
import RegistrationProcess from "@/components/RegistrationProcess";
import styles from '../../styles/registerHospital.module.css'; /** "../" means, lalabas ka sa isang folder. Since nasa patient, then pages folder currently itong page, need niya lumabas 2 folder para ma-access ang styles folder. */
import Link from "next/link";
import React, { useState } from 'react';


const Register2Hospital = () => {
    const [formData, setFormData] = useState({ 
        /**ADD HERE ALL THE NAMES OF VARIABLES IN THE FORM. Then you can use "formData.[variable]" to access the value of a field*/  
        firstName: '', middleName: '', lastName: '',
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent default form submission
        // Add form submission logic here
        console.log('Form submitted:', formData);
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
                            <input type="text" id="hospital-name" name="hospitalName" placeholder="Hospital Name" required onChange={handleChange} readOnly/>
                        </div>
                        <div className={styles.formField}>
                            <input type="text" id="contact-number" name="contactNumber" placeholder="Contact Number" required onChange={handleChange} readOnly/>
                        </div>
                    </div>

                    <div className={styles.formRow}>
                        <div className={styles.formField}>
                            <input type="text" id="hospital-address" name="hospitalAddress" placeholder="Hospital Address" required onChange={handleChange} readOnly/>
                        </div>
                    </div>
                    
                    <button className={styles.submitButton}>
                        <Link href="/HOSPITAL/HomeHospital/">REGISTER</Link>
                    </button>

                </form>
            </div>
        </>
        
    );
};

export default Register2Hospital;
