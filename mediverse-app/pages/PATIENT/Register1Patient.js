import LandingPageHeader from "@/components/landingPageHeader";
import RegistrationProcess from "@/components/RegistrationProcess";
import styles from '../../styles/register.module.css'; /** "../" means, lalabas ka sa isang folder. Since nasa patient, then pages folder currently itong page, need niya lumabas 2 folder para ma-access ang styles folder. */
import Image from "next/image";
import Link from "next/link";
import React, { useState } from 'react';
import { useRouter } from 'next/router';



const Register1Patient = () => {
    const router = useRouter();
    const [walletAddress, setWalletAddress] = useState("")
    //connect wallet prompt
    const connectMetaMask = async () => {
        if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
            try{
                /* If metamask is installed */
                const accounts = await window.ethereum.request({method: "eth_requestAccounts"});
                setWalletAddress(accounts[0]); 
                console.log(accounts[0]);
            } catch(err) {
                console.error(err.message);
            }
        } else {
            /* if metamask is not installed */
            console.log("Please install MetaMask");
        }
    };
    
    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent default form submission
        // Check if the checkbox is checked
        const agreeCheckbox = document.getElementById('agreeCheckbox');
        if (!agreeCheckbox.checked) {
            alert('Please agree to the terms before proceeding.');
            return; 
        }
        // Redirect to the next page only if the checkbox is checked
        router.push('/PATIENT/register2Patient/');
    };

    const goBack = () => {
        window.history.back();
    };

    return (
        <>
            <div> {/* Pass here yung Text na want ilagay sa button pati yung link */}
                <LandingPageHeader buttonText="LOG IN" buttonLink= "/PATIENT/logInPatient/" />
            </div>

            <RegistrationProcess 
                firstShapeColor="shapeCyan"
                secondShapeColor="shapeBlue"
                thirdShapeColor="shapeBlue"
            />

            <div className={styles.connectWalletContainer}>
                <div className={styles.formTitle}>Connect Wallet</div>
                <button className={styles.backButton} onClick={goBack}>←</button>
                <button className={styles.connectMetamaskButton} onClick={connectMetaMask}>
                    <div className={styles.metaMaskLogo}>
                        <Image src="/MetamaskLogo.svg" width={35} height={35} />
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
