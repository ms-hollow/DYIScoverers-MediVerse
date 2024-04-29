import styles from '../../styles/addPatient.module.css';
import Layout from '../../components/HomeSidebarHeaderHospital.js'
import path from 'path';
import Link from "next/link";
import React, { useState, useEffect } from 'react';
import web3 from "../../blockchain/web3";
import mvContract from '../../blockchain/mediverse';
import ToastWrapper from "@/components/ToastWrapper";
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';

const AddPatient = () => {

    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    // const [formData, setFormData] = useState({ 
    //     patientAddress: '',
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
                patientAddress: '',
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
                patientAddress: '',
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

    const clearFormData = () => {
        localStorage.removeItem('formData');
        console.log('Form data cleared from localStorage.');
    };

    useEffect(() => {
        const timeoutId = setTimeout(clearFormData, 1000);
        return () => clearTimeout(timeoutId);
    }, []);

    const handleChange = (e) => {
        if (e.target.name === 'gender') {
            setFormData({
                ...formData,
                gender: e.target.value,
            });
        } else if (e.target.name === 'dob') {
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
    
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission
        const requiredFields = ['firstName', 'middleName', 'lastName', 'age', 'gender', 'dob', 'phoneNumber', 'height', 'weight', 'houseNo', 'streetNo', 'barangay', 'cityMunicipality', 'region'];
        const isEmpty = requiredFields.some(field => !formData[field]);

        if (isEmpty) {
            toast.error('Please fill in all required fields.');
            return; // Exit early if any required field is empty
        }
        const accounts = await web3.eth.getAccounts(); // Get the accounts from MetaMask
        // console.log("Account:", accounts[0]);
        // console.log('Form submitted:', formData);

        const patientList = await mvContract.methods.getPatientList().call();
        const isPatientIncluded = patientList.includes(formData.patientAddress);
       
        const address = `${formData.houseNo}+${formData.streetNo}+${formData.barangay}+${formData.cityMunicipality}+${formData.region}`;
        const name = `${formData.firstName}+${formData.middleName}+${formData.lastName}`;
        //console.log("name: ", name)
        //console.log("address:", address)
        if (isPatientIncluded) {
            toast.error('Patient is already registered.');
        } else {
            try {
                setIsLoading(true);
                const receipt = await mvContract.methods.addPatient(
                    formData.patientAddress,
                    name,
                    formData.age,
                    formData.gender,
                    formData.dob,
                    formData.phoneNumber,
                    formData.height,
                    formData.weight,
                    address
                ).send({ from: accounts[0] });
                toast.success('Successfully Registered!');
                localStorage.removeItem('formData');
                setIsLoading(false);
                router.push('/HOSPITAL/HomeHospital');
            } catch (error) {
                console.error('Error sending transaction:', error.message);
            }
        }
    };

    const goBack = () => {
        window.history.back(); 
    };
    
    return (  
        <>
        <Layout pageName = "Register New Patient">
            <div className={styles.formContainer}>
                <div className={styles.formTitle}>Patient Information</div>
                <form className={styles.registrationForm} onSubmit={handleSubmit}>

                    <div className={styles.formRow}>
                        <div className={styles.formField}>
                            <input type="text" id="patient-address" name="patientAddress" placeholder="Patient Address" value={formData.patientAddress} required onChange={handleChange} />
                        </div>
                    </div>

                    <div className={styles.formRow}>
                        <div className={styles.formField}>
                            <input type="text" id="first-name" name="firstName" placeholder="First Name" value={formData.firstName} required onChange={handleChange} />
                        </div>
                        <div className={styles.formField}>
                            <input type="text" id="middle-name" name="middleName" placeholder="Middle Name" value={formData.middleName} required onChange={handleChange} />
                        </div>
                        <div className={styles.formField}>
                            <input type="text" id="last-name" name="lastName" placeholder="Last Name" value={formData.lastName} required onChange={handleChange} />
                        </div>
                    </div>

                    <div className={styles.formRow}>
                        <div className={styles.formField}>
                            <input type="number" id="age" name="age" placeholder="Age" value={formData.age} required onChange={handleChange} />
                        </div>
                        <div className={styles.formField}>
                            <select id="gender" name="gender" value={formData.gender} required onChange={handleChange}>
                                <option value="" disabled selected>Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div className={styles.formField}>
                            <input type="date" id="birth-date" name="dob" placeholder="Date of Birth" value={formData.dob} required onChange={handleChange} />
                        </div>
                    </div>

                    <div className={styles.formRow}>
                        <div className={styles.formField}>
                            <input type="tel" id="phone-number" name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} required onChange={handleChange} />
                        </div>
                        <div className={styles.formField}>
                            <input type="text" id="height" name="height" placeholder="Height" value={formData.height} required onChange={handleChange} />
                        </div>
                        <div className={styles.formField}>
                            <input type="text" id="weight" name="weight" placeholder="Weight" value={formData.weight} required onChange={handleChange} />
                        </div>
                    </div>

                    <div className={styles.formRow}>
                        <div className={styles.formField}>
                            <input type="text" id="house-no" name="houseNo" placeholder="House No." value={formData.houseNo} required onChange={handleChange} />
                        </div>
                        <div className={styles.formField}>
                            <input type="text" id="street-no" name="streetNo" placeholder="Street" value={formData.streetNo} required onChange={handleChange} />
                        </div>
                        <div className={styles.formField}>
                            <input type="text" id="barangay" name="barangay" placeholder="Barangay" value={formData.barangay} required onChange={handleChange} />
                        </div>
                        <div className={styles.formField}>
                            <input type="text" id="city-municipality" name="cityMunicipality" placeholder="City/Municipality" value={formData.cityMunicipality} required onChange={handleChange} />
                        </div>
                        <div className={styles.formField}>
                            <input type="text" id="region" name="region" placeholder="Region" value={formData.region} required onChange={handleChange} />
                        </div>
                    </div>

                    {/* <button className={styles.submitButton}>
                        <Link href="/HOSPITAL/AddMedicalHistory/">Add Patient</Link>
                    </button> */}

                    <button className={`${styles.submitButton} ${isLoading ? 'loading' : ''}`} onClick={handleSubmit} disabled={isLoading}> 
                        {isLoading ? 'Adding...' : 'Add Patient'}
                    </button>
                </form>
            </div>
        </Layout>
        <ToastWrapper/>
        </>
    );
}
 
export default AddPatient;