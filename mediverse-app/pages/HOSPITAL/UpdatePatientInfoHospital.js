import styles from '../../styles/addPatient.module.css';
import Layout from '../../components/HomeSidebarHeaderHospital.js'
import path from 'path';
import Link from "next/link";
import React, { useState, useEffect } from 'react';

//! Hindi na tatanggalin, maglalagay nalang ng parameters
/**
 * TODO: Add restrictions, gamit yung getHospitalList method sa solidity, i-confirm mo kung hospital ba ang nakalogged in sa metamask
 * TODO: if hospital nakaloggedin, error siya dapat patient address
 * TODO: Gamit ang address kunin ang pinaka-latest date sa may creation date 
 * ? Gamit ang getPatientInfo method
 * TODO: Retrieve ang data then display sa forms
 * TODO: Add yung data gamit yung edit profile na method sa may solidity 
 * ! NOTE LAHAT NG DATA ISA-SAVE ULIT
 */

const UpdatePatientHOspital = () => {

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

    const [data, setData] = useState(null);

    //This is only for fetching dummy data.
    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch('/placeHolder/dummyData_PatientInformation.json');
            const json = await res.json();
            const item = json.find(item => item.id === 1); // Filter data for ID 1
            setData(item);
        };

        fetchData();
    }, []);

    //Makes the field editable
    const updateChange = (e) => {
        let newData = { ...data };
        if (e.target.name === 'age') {
            newData.age = e.target.value;
        }
        else if (e.target.name === 'phoneNumber') {
            newData.phoneNumber = e.target.value;
        }
        else if (e.target.name === 'height') {
            newData.height = e.target.value;
        }
        else if (e.target.name === 'weight') {
            newData.weight = e.target.value;
        }
        else if (e.target.name === 'houseNo') {
            newData.houseNo = e.target.value;
        }
        else if (e.target.name === 'streetNo') {
            newData.streetNo = e.target.value;
        }
        else if (e.target.name === 'barangay') {
            newData.barangay = e.target.value;
        }
        else if (e.target.name === 'cityMunicipality') {
            newData.cityMunicipality = e.target.value;
        }
        else if (e.target.name === 'region') {
            newData.region = e.target.value;
        }
        setData(newData);
    }

    if (!data) {
        return <div>Loading...</div>;
    }
    
    return (  
        <Layout pageName = "Update Patient Information">
        <>
        
            <div className={styles.formContainer}>
                <div className={styles.formTitle}>Patient Information</div>
                <form className={styles.registrationForm} onSubmit={handleSubmit}>
                    <div className={styles.formRow}>
                        <div className={styles.formField}>
                            <input type="text" id="first-name" name="firstName" value={data.firstName} placeholder="First Name" required onChange={handleChange} />
                        </div>
                        <div className={styles.formField}>
                            <input type="text" id="middle-name" name="middleName" value={data.middleName} placeholder="Middle Name" required onChange={handleChange} />
                        </div>
                        <div className={styles.formField}>
                            <input type="text" id="last-name" name="lastName" value={data.lastName} placeholder="Last Name" required onChange={handleChange} />
                        </div>
                    </div>

                    <div className={styles.formRow}>
                        <div className={styles.formField}>
                            <input type="number" id="age" name="age" value={data.age} placeholder="Age" required onChange={updateChange} />
                        </div>
                        <div className={styles.formField}>
                            <select id="gender" name="gender" value={data.gender} required onChange={handleChange}>
                                <option value="" disabled selected>Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div className={styles.formField}>
                            <input type="date" id="birth-date" name="dob" value={data.dob} placeholder="Date of Birth" required onChange={handleChange} />
                        </div>
                    </div>

                    <div className={styles.formRow}>
                        <div className={styles.formField}>
                            <input type="tel" id="phone-number" name="phoneNumber" value={data.phoneNumber} placeholder="Phone Number" required onChange={updateChange} />
                        </div>
                        <div className={styles.formField}>
                            <input type="text" id="height" name="height" value={data.height} placeholder="Height" required onChange={updateChange} />
                        </div>
                        <div className={styles.formField}>
                            <input type="text" id="weight" name="weight" value={data.weight} placeholder="Weight" required onChange={updateChange} />
                        </div>
                    </div>

                    <div className={styles.formRow}>
                        <div className={styles.formField}>
                            <input type="text" id="house-no" name="houseNo" value={data.houseNo} placeholder="House No." required onChange={updateChange} />
                        </div>
                        <div className={styles.formField}>
                            <input type="text" id="street-no" name="streetNo" value={data.streetNo} placeholder="Street No." required onChange={updateChange} />
                        </div>
                        <div className={styles.formField}>
                            <input type="text" id="barangay" name="barangay" value={data.barangay} placeholder="Barangay" required onChange={updateChange} />
                        </div>
                        <div className={styles.formField}>
                            <input type="text" id="city-municipality" name="cityMunicipality" value={data.cityMunicipality} placeholder="City/Municipality" required onChange={updateChange} />
                        </div>
                        <div className={styles.formField}>
                            <input type="text" id="region" name="region" value={data.region} placeholder="Region" required onChange={updateChange} />
                        </div>
                    </div>

                    <button className={styles.submitButton}>
                        <Link href="/PATIENT/Register3Patient/">Update</Link>
                    </button>
                </form>
            </div>
        </>
        </Layout>
    );
}
 
export default UpdatePatientHOspital;