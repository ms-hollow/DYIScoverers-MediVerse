import LandingPageHeader from "@/components/landingPageHeader";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link"; 
import { useRouter } from "next/router"; // Import useRouter hook
import LogInPatientHeader from "@/components/logInPatientHeader";
import LandingPageLayout from "@/components/landingPageLayout";
import styles from '/styles/logInPatientHeader.module.css';
import React, { useState } from 'react';

export default function Home() {
  const router = useRouter(); // Initialize useRouter hook
  const [walletAddress, setWalletAddress] = useState("")

  const handleCreateWallet = () => {
    router.push("/PATIENT/Register1Patient"); // Navigate to the Register2Patient page
  };

  const connectMetaMask = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
        try{
            /* If metamask is installed */
            const accounts = await window.ethereum.request({method: "eth_requestAccounts"});
            setWalletAddress(accounts[0]); 
            console.log(accounts[0]);
            router.push("/PATIENT/Register1Patient"); // Navigate to the User dashboard
        } catch(err) {
            console.error(err.message);
        }
    } else {
        /* if metamask is not installed */
        console.log("Please install MetaMask");
        alert('Please install MetaMask');
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
      </LandingPageLayout>
    </>
  );
}
