import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import styles from '/styles/landingPage.module.css';
import styles2 from '/styles/landingPageHeader.module.css';
import LandingPageHeader from '@/components/landingPageHeader';


export default function LandingPage() {
  return (
    <>
      <div>
        <LandingPageHeader buttonText="LOG IN" buttonLink= "/PATIENT/logInPatient/"/> 
      </div>

      <div className={styles.container}>
        <div className={styles.paragraph}>
          <p>Your Health, Your Universe, Connected.</p>
        </div>
        <div className={styles.text2}>
          <p>Secure your medical history, simplify your healthcare – Sign Up for MediVerse now!</p>
        </div>
        <div className={styles.absolutePosition1}>
          <img src="/landingPagePic1.png" alt="Pic 1" className={styles.image} />
        </div>
        <div className={styles.absolutePosition2}>
          <img src="/landingPagePic2.png" alt="Pic 2" className={styles.image} />
        </div>
        <div className={styles.text5}>
          <p>Why Mediverse?</p>
        </div>
        <div className={styles.absolutePosition3}>
          <img src="lineLandingPage.png" alt="Pic 2" className={styles.image} />
        </div>
        <div className={styles.feature1}>
          <img src="Features1.png" alt="Pic 1" style={{ width: '100%', height: '100%' }} />
        </div>
        <div className={styles.feature2}>
          <img src="Features2.png" alt="Pic 2" style={{ width: '100%', height: '100%' }} />
        </div>
        <div className={styles.feature3}>
          <img src="Features3.png" alt="Pic 3" style={{ width: '100%', height: '100%' }} />
        </div>
        <div className={styles.feature4}>
          <img src="Features4.png" alt="Pic 4" style={{ width: '100%', height: '100%' }} />
        </div>
        <div className={styles.feature5}>
          <img src="Features5.png" alt="Pic 5" style={{ width: '100%', height: '100%' }} />
        </div>
        <div className={styles.feature6}>
          <img src="Features6.png" alt="Pic 6" style={{ width: '100%', height: '100%' }} />
        </div>
        <div className={styles.text6}>
          <p>Subscribe To Our Newsletter</p>
        </div>
        <div className={styles.clickableText}>
          <p>Get latest news of our Mediverse</p>
        </div>
        <div className={styles.container34}>
        <span className={styles.text7}>For Newsletter</span>
        <input
          type="email"
          placeholder="Enter your email here"
          className={styles.input}
        />
        <button className={styles.button34}>Subscribe</button>
        </div>


        <div className={styles2.button} style={{ position: 'absolute', left: '5px', top: '340px' }}>
          <Link href="/PATIENT/Register1Patient/">Get Started</Link>
        </div>

        {/*Text above nong mahabang pic sa gitna */}
        <div className={styles.textContainer3}>
          <div className={styles.text3}>1M</div>
          <div className={styles.text3}>50K</div>
          <div className={styles.text3}>5K</div>
        </div>

        {/* Text above nong mahabang pic sa gitna*/}
        <div className={styles.textContainer4}>
          <div className={styles.text4}>Satisfied Patients</div>
          <div className={styles.text4}>Renowned Doctors</div>
          <div className={styles.text4}>Progressive Hospitals</div>
        </div>
      </div>
    </>
  );
}
