import LandingPageHeader from "@/components/landingPageHeader";
import RegistrationProcess from "@/components/RegistrationProcess";
import styles from '../../styles/register.module.css'; /** "../" means, lalabas ka sa isang folder. Since nasa patient, then pages folder currently itong page, need niya lumabas 2 folder para ma-access ang styles folder. */
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from 'react';


const Register2Patient = () => {
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
                secondShapeColor="shapeCyan"
                thirdShapeColor="shapeBlue"
            />

            <div className={styles.formContainer}>

                <div className={styles.formTitle}>Personal Details</div>

                <button className={styles.backButton} onClick={goBack}>
                    ←
                </button>

                <form className={styles.registrationForm} onSubmit={handleSubmit}>
                    <div className={styles.formRow}>
                        <div className={styles.formField}>
                            <input type="text" id="first-name" name="firstName" placeholder="First Name" required onChange={handleChange} />
                        </div>
                        <div className={styles.formField}>
                            <input type="text" id="middle-name" name="middleName" placeholder="Middle Name" required onChange={handleChange} />
                        </div>
                        <div className={styles.formField}>
                            <input type="text" id="last-name" name="lastName" placeholder="Last Name" required onChange={handleChange} />
                        </div>
                    </div>

                    <div className={styles.formRow}>
                        <div className={styles.formField}>
                            <input type="number" id="age" name="age" placeholder="Age" required onChange={handleChange} />
                        </div>
                        <div className={styles.formField}>
                            <select id="gender" name="gender" required onChange={handleChange}>
                                <option value="" disabled selected>Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div className={styles.formField}>
                            <input type="date" id="birth-date" name="dob" placeholder="Date of Birth" required onChange={handleChange} />
                        </div>
                    </div>

                    <div className={styles.formRow}>
                        <div className={styles.formField}>
                            <input type="tel" id="phone-number" name="phoneNumber" placeholder="Phone Number" required onChange={handleChange} />
                        </div>
                        <div className={styles.formField}>
                            <input type="text" id="height" name="height" placeholder="Height" required onChange={handleChange} />
                        </div>
                        <div className={styles.formField}>
                            <input type="text" id="weight" name="weight" placeholder="Weight" required onChange={handleChange} />
                        </div>
                    </div>

                    <div className={styles.formRow}>
                        <div className={styles.formField}>
                            <input type="text" id="house-no" name="houseNo" placeholder="House No." required onChange={handleChange} />
                        </div>
                        <div className={styles.formField}>
                            <input type="text" id="street-no" name="streetNo" placeholder="Street No." required onChange={handleChange} />
                        </div>
                        <div className={styles.formField}>
                            <input type="text" id="barangay" name="barangay" placeholder="Barangay" required onChange={handleChange} />
                        </div>
                        <div className={styles.formField}>
                            <input type="text" id="city-municipality" name="cityMunicipality" placeholder="City/Municipality" required onChange={handleChange} />
                        </div>
                        <div className={styles.formField}>
                            <input type="text" id="region" name="region" placeholder="Region" required onChange={handleChange} />
                        </div>
                    </div>
                    
                    <button className={styles.submitButton}>
                        <Link href="/PATIENT/Register3Patient/">PROCEED</Link>
                    </button>


                </form>
            </div>
        </>
        
    );
};

export default Register2Patient;
