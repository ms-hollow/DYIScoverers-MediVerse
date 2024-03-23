import LandingPageHeader from "@/components/landingPageHeader";
import RegistrationProcess from "@/components/RegistrationProcess";
import styles from '../../styles/register.module.css'; /** "../" means, lalabas ka sa isang folder. Since nasa patient, then pages folder currently itong page, need niya lumabas 2 folder para ma-access ang styles folder. */
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from 'react';
import { useRouter } from 'next/router';


const Register1Patient = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({ 
        /**ADD HERE ALL THE NAMES OF VARIABLES IN THE FORM. Then you can use "formData.[variable]" to access the value of a field*/  
        firstName: '', middleName: '', lastName: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent default form submission
    
        // Check if the checkbox is checked
        const agreeCheckbox = document.getElementById('agreeCheckbox');
        if (!agreeCheckbox.checked) {
            alert('Please agree to the terms before proceeding.');
            return; // Stop further execution if checkbox is not checked
        }

        // Redirect to the next page only if the checkbox is checked
        router.push('/PATIENT/register2Patient/');
    };

    const goBack = () => {
        window.history.back(); // Go back to the previous page
    };

    return (
        <>
            <div> {/* Pass here yung Text na want ilagay sa call-t-action button ng landingPage header */}
                <LandingPageHeader buttonText="LOG IN" />
            </div>

            <RegistrationProcess 
                firstShapeColor="shapeCyan"
                secondShapeColor="shapeBlue"
                thirdShapeColor="shapeBlue"
            />

            <div className={styles.connectWalletContainer}>

                <div className={styles.formTitle}>Connect Wallet</div>

                <button className={styles.backButton} onClick={goBack}>
                    ←
                </button>

                <button className={styles.connectMetamaskButton}>
                    <div className={styles.metaMaskLogo}>
                        <Image src="/MetamaskLogo.png" width={35} height={35} />
                    </div>
                    <div className={styles.connectMetamaskText}>C O N N E C T &nbsp;&nbsp; M E T A M A S K</div>
                </button>

                <p className={styles.termsText}>
                    <input type="checkbox" id="agreeCheckbox" required />
                    <label htmlFor="agreeCheckbox">
                        I understand that if I lose access to my wallet, I must use my <br/>
                        <a href="#" className={styles.link}>Private Key Recovery Phrase to access my funds.</a>
                        <br/> <br/>
                    </label>

                    By creating an account, you agree to Mediverse’s{' '}
                    <a href="#" className={styles.link}>Terms of Services and Privacy Policy</a>
                </p>

                <button className={styles.submitButton} onClick={handleSubmit}>
                    <Link href="/PATIENT/register2Patient/">PROCEED</Link>
                </button>
                
                
            </div>
        </>
        
    );
};

export default Register1Patient;
