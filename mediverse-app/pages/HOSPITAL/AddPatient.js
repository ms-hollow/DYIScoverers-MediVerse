import styles from '../../styles/addPatient.module.css';
import Layout from '../../components/HomeSidebarHeaderHospital.js'
import path from 'path';
import Link from "next/link";
import React, { useState } from 'react';
import web3 from "../../blockchain/web3";
import mvContract from '../../blockchain/mediverse';


const AddPatient = () => {
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
        const accounts = await web3.eth.getAccounts(); // Get the accounts from MetaMask
        console.log("Account:", accounts[0]);
        console.log('Form submitted:', formData);
        // Concatenate the address fields
        const address = `${formData.houseNo}+${formData.streetNo}+${formData.barangay}+${formData.cityMunicipality}+${formData.region}`;
        const name = `${formData.firstName}+${formData.middleName}+${formData.lastName}`;
        console.log("name: ", name)
        console.log("address:", address)
        
        try {
            const receipt = await mvContract.methods.registerPatient(
                name,
                formData.age,
                formData.gender,
                formData.dob,
                formData.phoneNumber,
                formData.height,
                formData.weight,
                address
            ).send({ from: accounts[0] });

            console.log("Transaction Hash:", receipt.transactionHash);
            // router.push('/PATIENT/Register3Patient/');
            // Transaction successful, you can do further processing here if needed
        } catch (error) {
            console.error('Error sending transaction:', error.message);
        }
        
    };

    const goBack = () => {
        window.history.back(); 
    };
    
    return (  
        <Layout pageName = "Add Patient">
        <>
        
            <div className={styles.formContainer}>
                <div className={styles.formTitle}>Patient Information</div>
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
                        <Link href="/PATIENT/Register3Patient/">Add Patient</Link>
                    </button>
                </form>
            </div>
        </>
        </Layout>
    );
}
 
export default AddPatient;