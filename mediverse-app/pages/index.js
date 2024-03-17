import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import LandingPageLayout from "@/components/LandingPageLayout";
import styles from '/styles/landingPage.module.css';
import styles2 from '/styles/landingPageHeader.module.css';
import LandingPageHeader from "@/components/LandingPageHeader";

export default function LandingPage() {
  return (
    <>

      <LandingPageLayout /> 
        <div className={styles.container}>
          <h1>Landing Page</h1>
          <div className={styles.paragraph}>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a fringilla tortor. Donec eu diam ut velit auctor ultrices. Mauris in augue pellentesque mauris dignissim hendrerit at in purus. Praesent nisi sem, vehicula quis mi non, interdum iaculis mi. Sed sit amet dui fermentum, blandit felis sit amet, laoreet lorem.</p>
          </div>

          <div className={styles2.button}>
            <Link href="/PATIENT/Register2Patient/">Get Started</Link>
          </div>

        </div>

    </>
  );
}