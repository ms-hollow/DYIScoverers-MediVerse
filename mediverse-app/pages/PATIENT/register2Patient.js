import LandingPageHeader from "@/components/landingPageHeader";
import RegistrationProcess from "@/components/RegistrationProcess";
import styles from '../../styles/register.module.css'; /** "../" means, lalabas ka sa isang folder. Since nasa patient, then pages folder currently itong page, need niya lumabas 2 folder para ma-access ang styles folder. */
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import web3 from "../../blockchain/web3";
import mvContract from "../../blockchain/mediverse";
import ToastWrapper from "@/components/ToastWrapper";
import { toast } from 'react-toastify';

const Register2Patient = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    // const [formData, setFormData] = useState({ 
    //     /**ADD HERE ALL THE NAMES OF VARIABLES IN THE FORM. Then you can use "formData.[variable]" to access the value of a field*/  
    //     firstName: '', 
    //     middleName: '', 
    //     lastName: '',
    //     age: '',
    //     gender: '',
    //     dob: '',
    //     phoneNumber: '',
    //     height: '',
    //     weight: '',
    //     houseNo: '',
    //     streetNo: '',
    //     barangay: '',
    //     cityMunicipality: '',
    //     region: ''
    // });

    const [formData, setFormData] = useState(() => {
        if (typeof window !== 'undefined' && window.localStorage) {
            // Retrieve form data from localStorage when the component mounts
            const savedFormData = localStorage.getItem('formData');
            return savedFormData ? JSON.parse(savedFormData) : {
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
         };
        } else {
            // If localStorage is not available, return default form data
            return {
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

    const dobInputRef = useRef(null);
    const [dobValue, setDobValue] = useState('');

    const handleChange = (e) => {
        if (e.target.name === 'gender') {
            setFormData({
                ...formData,
                gender: e.target.value,
            });
        } else if (e.target.name === 'dob') {
            setDobValue(e.target.value); // Update dobValue with the selected date
            setFormData({
              ...formData,
              dob: e.target.value,
            });
        } else {
            setFormData({
                ...formData,
                [e.target.name]: e.target.value,
            });
        }
    };

    const handleDobFocus = () => {
        if (dobInputRef.current) {
            dobInputRef.current.type = 'date';
        }
    };

    const handleDobBlur = () => {
        if (dobInputRef.current) {
            dobInputRef.current.type = dobValue ? 'date' : 'text';
        }
    };


    const handleSubmit = async (e) => {

        e.preventDefault(); // Prevent default form submission

        const requiredFields = ['firstName', 'middleName', 'lastName', 'age', 'gender', 'dob', 'phoneNumber', 'height', 'weight', 'houseNo', 'streetNo', 'barangay', 'cityMunicipality', 'region'];
        const isEmpty = requiredFields.some(field => !formData[field]);

        if (isEmpty) {
            toast.error('Please fill in all required fields.');
            return; // Exit early if any required field is empty
        }

        // Check if age is negative
        if (parseInt(formData.age) < 0) {
            toast.error('Age cannot be negative.');
            return; // Exit early if age is negative
        }

        router.push('/PATIENT/Register3Patient/');
    };

    const goBack = () => {
        window.history.back(); // Go back to the previous page
    };

    return (
        <>
            <div> {/* Pass here yung Text na want ilagay sa button pati yung link */}
                <LandingPageHeader buttonText="LOG IN" buttonLink= "/PATIENT/logInPatient/" />
            </div>

            <div className= {styles.registrationContainer}>

                <RegistrationProcess 
                    firstShapeColor="shapeBlue"
                    secondShapeColor="shapeCyan"
                    thirdShapeColor="shapeBlue"
                />

                <div className={styles.formContainer}>
                    <div className={styles.formTitle}>
                        <button className={styles.backButton} onClick={goBack}>←</button>
                        Personal Details
                    </div>
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
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className={styles.formField}>
                                <input type="text" id="birth-date" name="dob" placeholder="Date of Birth" required ref={dobInputRef} onChange={handleChange} onFocus={handleDobFocus} onBlur={handleDobBlur} value={dobValue}/>
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
                        
                        {/* <button className={styles.submitButton} onClick={handleSubmit}>PROCEED</button> */}
                        <button className={`${styles.submitButton} ${isLoading ? 'loading' : ''}`} onClick={handleSubmit} disabled={isLoading}> 
                            {isLoading ? 'PROCEEDING...' : 'PROCEED'}
                        </button>
                    </form>
                </div>
                <ToastWrapper/>
            </div>
        </>
        
    );
};

export default Register2Patient;