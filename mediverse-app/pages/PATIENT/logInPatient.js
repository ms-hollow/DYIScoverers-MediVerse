import LandingPageHeader from "@/components/landingPageHeader";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link"; 
import { useRouter } from "next/router"; // Import useRouter hook
import LogInPatientHeader from "@/components/logInPatientHeader";
import LandingPageLayout from "@/components/landingPageLayout";
import styles from '/styles/logInPatientHeader.module.css';
import React, { useState } from 'react';
import web3 from "../../blockchain/web3";
import mvContract from '../../blockchain/mediverse';
import ToastWrapper from "@/components/ToastWrapper";
import { toast } from 'react-toastify';

export default function Home() {
  const router = useRouter(); // Initialize useRouter hook
  const [walletAddress, setWalletAddress] = useState("")
  const [patientList, setPatientList] = useState([]);
  const [hospitalList, setHospitalList] = useState([]);

  const handleCreateWallet = () => {
    router.push("/PATIENT/Register1Patient"); // Navigate to the Register2Patient page
  };

  const isAddressInList = (address, list) => {
    return list.some(item => item.toLowerCase() === address.toLowerCase());
  };

  const connectMetaMask = async () => {
    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
        try {
            /* If MetaMask is installed */
            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
            const walletAddress = accounts[0];
            setWalletAddress(walletAddress);
            console.log(walletAddress);

            const patientList = await mvContract.methods.getPatientList().call();
            setPatientList(patientList);

            const hospitalList = await mvContract.methods.getHospitalList().call();
            setHospitalList(hospitalList);

            // console.log("Patient List:", patientList);
            // console.log("Hospital List:", hospitalList);

            const isPatient = isAddressInList(walletAddress, patientList);
            if (isPatient) {
                console.log("This account belongs to a patient.");
                toast.success("You have successfully logged into your account as a patient.");
                router.push("/PATIENT/HomePatient");
            } else {
                const isHospital = isAddressInList(walletAddress, hospitalList);
                if (isHospital) {
                    console.log("This account belongs to a hospital.");
                    toast.success("You have successfully logged into your account as a hospital.");
                    router.push("/HOSPITAL/HomeHospital");
                } else {
                    console.log("This address is not registered as a patient or a hospital.");
                    toast.error("This address is not registered as a patient or a hospital.");
                }
            }
        } catch (err) {
            console.error(err.message);
        }
    } else {
        /* If MetaMask is not installed */
        console.log("Please install MetaMask");
        toast.error("Please install MetaMask");
    }
  };

  return (
    <>
      <LandingPageLayout> 
        <LogInPatientHeader />
        <div className={styles.connectMetamaskContainer}>
          <button className={styles.connectMetamaskButton} onClick={connectMetaMask}>
            <div className={styles.metaMaskLogo}>
              <Image src="/MetamaskLogo.svg" width={35} height={35} />
            </div>
            <div className={styles.connectMetamaskText}>C O N N E C T &nbsp;&nbsp; M E T A M A S K</div>
          </button>
        </div>
      
        <div className={styles.signInWithWalletText}>
          SIGN IN WITH YOUR WALLET
        </div>
      
        <div className={styles.signInWithProviderText}>
          Sign in with one available wallet provider
        </div>
     
        <div className={styles.dontHaveMetamaskText}>
          Don't Have Metamask Wallet?{" "}
          <span className={styles.createOneLink} onClick={handleCreateWallet}>Create one.</span> {/* Use span instead of a */}
        </div>
        <ToastWrapper/>
      </LandingPageLayout>
    </>
  );
}
