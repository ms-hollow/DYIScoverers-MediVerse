import LandingPageHeader from "@/components/LandingPageHeader";
import Head from "next/head";
import Image from "next/image";
<<<<<<< HEAD
import Link from "next/link"; 
import { useRouter } from "next/router"; // Import useRouter hook
import LogInPatientHeader from "@/components/logInPatientHeader";
import LandingPageLayout from "@/components/landingPageLayout";
import styles from '/styles/logInPatientHeader.module.css';
=======
import Link from "next/link";
<<<<<<< HEAD
import web3 from "../../blockchain/web3";

export default function Home() {
  //connect wallet prompt
  const connectMetaMask = async () => {
      try {
          // Check if MetaMask is installed and prompt user to connect
          await web3.eth.requestAccounts();
          console.log("MetaMask connected successfully!");
          // Perform additional actions after successful connection
      } catch (error) {
          console.error('Error connecting MetaMask:', error);
          // Handle error connecting MetaMask
      }
  };
  
=======
>>>>>>> ab3699cbdc3c3b88f2a56828605bf83b637be237

export default function Home() {
  const router = useRouter(); // Initialize useRouter hook

  const handleCreateWallet = () => {
    router.push("/PATIENT/Register1Patient"); // Navigate to the Register2Patient page
  };

>>>>>>> front-end
  return (
    <>
<<<<<<< HEAD
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
=======
      <div> {/* Pass here yung Text na want ilagay sa call-t-action button ng landingPage header */}
          <LandingPageHeader buttonText="REGISTER" />
      </div>

      <button onClick={connectMetaMask}>Button</button>

        



>>>>>>> ab3699cbdc3c3b88f2a56828605bf83b637be237
    </>
  );
}
