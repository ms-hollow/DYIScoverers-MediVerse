import RegistrationProcess from "@/components/RegistrationProcess";
import styles from '../../styles/register.module.css'; /** "../" means, lalabas ka sa isang folder. Since nasa patient, then pages folder currently itong page, need niya lumabas 2 folder para ma-access ang styles folder. */
import Image from "next/image";
import Link from "next/link";
import React, { useState } from 'react';
import { useRouter } from 'next/router';
// import web3 from "../../blockchain/web3";
import mvContract from '../../blockchain/mediverse';
import ToastWrapper from "@/components/ToastWrapper";
import { toast } from 'react-toastify';
import LandingPageHeader from '@/components/landingPageHeader';

const Register1Patient = () => {
    const router = useRouter();
    const [walletAddress, setWalletAddress] = useState("")
    const [patientList, setPatientList] = useState([]);
    const [hospitalList, setHospitalList] = useState([]);
    const [isPatient, setIsPatient] = useState(false);
    const [isHospital, setIsHospital] = useState(false);

    const isAddressInList = (address, list) => {
        return list.some(item => item.toLowerCase() === address.toLowerCase());
    };

    //connect wallet prompt
    const connectMetaMask = async () => {
        if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
            try {
                /* If MetaMask is installed */
                const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
                const walletAddress = accounts[0];
                setWalletAddress(walletAddress);
    
            } catch (err) {
                console.error(err.message);
            }
        } else {
            console.log("Please install MetaMask");
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const agreeCheckbox = document.getElementById('agreeCheckbox');
      
        if (!agreeCheckbox.checked) {
          toast.error('Please agree to the terms before proceeding.');
          return;
        } else {
            const patientList = await mvContract.methods.getPatientList().call();
            setPatientList(patientList);
        
            const hospitalList = await mvContract.methods.getHospitalList().call();
            setHospitalList(hospitalList);
        
            const isPatient = isAddressInList(walletAddress, patientList);
            if (isPatient) {
                setIsPatient(true);
                toast.error('This account is already registered as a patient.');
                return;
            }
        
            const isHospital = isAddressInList(walletAddress, hospitalList);
            if (isHospital) {
                setIsHospital(true);
                toast.error('This account is already registered as a hospital.');
                return;
            }
        
            if (!isPatient && !isHospital) {
                router.push('/PATIENT/register2Patient/');
                return;
            }
        }
    };

    const goBack = () => {
        window.history.back();
    };

    return (
        <>
            <div>
                <LandingPageHeader buttonText="LOG IN" buttonLink= "/PATIENT/logInPatient/"/> 
            </div>

            <div class={styles.container}>
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

                    <button className={styles.submitButton} onClick={handleSubmit}>PROCEED</button>
                </div>
            </div>
            <ToastWrapper/>
        </>
        
    );
};

export default Register1Patient;