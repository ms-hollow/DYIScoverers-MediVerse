import LandingPageHeader from "@/components/LandingPageHeader";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
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
  
  return (
    <>
      <div> {/* Pass here yung Text na want ilagay sa call-t-action button ng landingPage header */}
          <LandingPageHeader buttonText="REGISTER" />
      </div>

      <button onClick={connectMetaMask}>Button</button>

        



    </>
  );
}
