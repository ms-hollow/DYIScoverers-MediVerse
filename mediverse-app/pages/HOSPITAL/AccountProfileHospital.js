import LandingPageHeader from "@/components/landingPageHeader";
import RegistrationProcess from "@/components/RegistrationProcess";
import Layout from '../../components/HomeSidebarHeaderHospital.js'
import styles from '../../styles/accountProfileHospital.module.css'; /** "../" means, lalabas ka sa isang folder. Since nasa patient, then pages folder currently itong page, need niya lumabas 2 folder para ma-access ang styles folder. */
import Link from "next/link";
import React, { useState, useEffect } from 'react';
import web3 from "../../blockchain/web3";
import mvContract from "../../blockchain/mediverse"; // ABI

import ToastWrapper from "@/components/ToastWrapper";
import { toast } from 'react-toastify';

/**
 * TODO: Gamit ang address kunin ang pinaka-latest date sa may creation date
 * ? Gamit ang getHospitalInfo method
 * TODO: Retrieve ang data then display sa forms
 * TODO: Add yung data gamit yung edit profile na method sa may solidity
 */

const AccountProfileHospital = () => {
    
    const [hospitalAddress, setHospitalAddress] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({ 
        /**ADD HERE ALL THE NAMES OF VARIABLES IN THE FORM. Then you can use "formData.[variable]" to access the value of a field*/  
        hospitalName: '', contactNumber: '', hospitalAddress: ''
    });

    const [editable, setEditable] = useState(false); // State variable to track edit mode

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
                const hospitalInfo = await mvContract.methods.getHospitalInfo(accounts[0]).call(); 
                setHospitalAddress(accounts[0]);
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
    }, []); 

    const handleEdit = (e) => {
        e.preventDefault();
        setEditable(!editable); // pagpinindot ang edit button, gagawing editable ang fields. 
    };
    
    const saveEditedProfile = async () => {
        setIsLoading(true);
        try {
            await mvContract.methods.editHospitalDetails(
                formData.hospitalName,
                formData.contactNumber,
                formData.hospitalAddress
            ).send({ from: hospitalAddress });
            console.log('Hospital details updated successfully');
            setEditable(false);
            setIsLoading(false);
        } catch (error) {
            console.error('Error updating hospital details:', error);
            toast.error('Error updating hospital details.');
        }
    }

    const goBack = () => {
        window.history.back(); // Go back to the previous page
    };

    return (
        <Layout pageName = "Account Profile">
        <>
            <div> {/* Pass here yung Text na want ilagay sa button pati yung link */}
                <LandingPageHeader buttonText="LOG IN" buttonLink= "/PATIENT/logInPatient/" />
            </div>

            <div className={styles.formContainer}>
                <div className={styles.formTitle}>Hospital Details</div>
                <form className={styles.registrationForm} onSubmit={handleEdit}>
                    <div className={styles.formRow}>
                        <div className={styles.formField}>
                            <label htmlFor="hospital-name" className={styles.formLabel}>Hospital Name</label>
                            <input type="text" id="hospital-name" name="hospitalName" required onChange={handleChange} value={formData.hospitalName} readOnly={!editable}/>
                        </div>
                        <div className={styles.formField}>
                            <label htmlFor="contact-number" className={styles.formLabel}>Contact Number</label>
                            <input type="text" id="contact-number" name="contactNumber" required onChange={handleChange} value={formData.contactNumber} readOnly={!editable}/>
                        </div>
                    </div>

                    <div className={styles.formRow}>
                        <div className={styles.formField}>
                            <label htmlFor="hospital-address" className={styles.formLabel}>Hospital Address</label>
                            <input type="text" id="hospital-address" name="hospitalAddress" required onChange={handleChange} value={formData.hospitalAddress} readOnly={!editable}/>
                        </div>
                    </div>
                    
                    <button className={styles.editButton} onClick={editable ? saveEditedProfile : handleEdit} disabled={isLoading}>
                        {isLoading ? <span>Loading...</span> : (editable ? <span>SAVE</span> : <span>EDIT</span>)}
                    </button>

                </form>
                
                <ToastWrapper/>
            </div>

            
        </>
        </Layout>
        
    );
};

export default AccountProfileHospital;
