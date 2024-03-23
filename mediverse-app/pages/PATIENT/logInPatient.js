import LandingPageHeader from "@/components/landingPageHeader";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link"; 
import { useRouter } from "next/router"; // Import useRouter hook
import LogInPatientHeader from "@/components/logInPatientHeader";
import LandingPageLayout from "@/components/landingPageLayout";
import styles from '/styles/logInPatientHeader.module.css';

export default function Home() {
  const router = useRouter(); // Initialize useRouter hook

  const handleCreateWallet = () => {
    router.push("/PATIENT/Register1Patient"); // Navigate to the Register2Patient page
  };

  return (
    <>
      <LandingPageLayout> 
        <LogInPatientHeader />
        <div className={styles.connectMetamaskContainer}>
          <button className={styles.connectMetamaskButton}>
            <div className={styles.metaMaskLogo}>
              <Image src="/MetamaskLogo.png" width={35} height={35} />
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
