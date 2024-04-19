import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import styles from '/styles/landingPage.module.css';
import styles2 from '/styles/accountIconDropdown.module.css';
import LandingPageHeader from '@/components/landingPageHeader';


export default function LandingPage() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
      setIsOpen(!isOpen);
  };

  return (
    <>
      <div>
        <LandingPageHeader buttonText="LOG IN" buttonLink= "/PATIENT/logInPatient/"/> 
      </div>

      <div className={styles.container}>

        <section id="landingPage">
          <div className={styles.paragraph}>
            <p>Your Health, Your Universe, Connected.</p>
          </div>
          <div className={styles.text2}>
            <p>Secure your medical history, simplify your healthcare – Sign Up for MediVerse now!</p>
          </div>
          <div className={styles.absolutePosition1}>
            <img src="/landingPagePic1.png" alt="Pic 1" className={styles.image} />
          </div>

          <div className={styles2.registerDropdown}></div>
            <div className={styles.button} onClick={toggleMenu}> 
                Get Started
                  {isOpen && (
                      <div className={styles2.registerDropdownContent}>
                          <Link href="/PATIENT/Register1Patient/">As Patient</Link>
                          <Link href="/HOSPITAL/Register1Hospital/">As Hospital</Link>
                      </div>
                  )}
          </div>

        </section>

        {/*---------------------------FREATURES----------------------------------------*/}

        <section id="features">

          <div className={styles.absolutePosition2}>
            <img src="/landingPagePic2.png" alt="Pic 2" className={styles.image} />
          </div>
          <div className={styles.text5}>
            <p>Why Mediverse?</p>
          </div>
          <div className={styles.lineHead}></div>
          
          {/*FEATURE 1*/}
          <div className={styles.feature1}>
            <img src="F1.png" alt="Pic 1" style={{ width: '100%', height: '100%' }} />
          </div>
          <div className={styles.whiteRectangle1}>
            <p className={styles.Ftxt1}>Digital Medical Record Management.</p>
            <p className={styles.Ftxt11}>Patients access, update medical records digitally with lab results, medication tracking, appointment scheduling, and reminders for follow-ups</p>
          </div>
          <div className={styles.lineStyle1}></div>

          {/*FEATURE 2*/}
          <div className={styles.feature2}>
            <img src="F2.png" alt="Pic 2" style={{ width: '100%', height: '100%' }} />
          </div>
          <div className={styles.whiteRectangle2}>
          <p className={styles.Ftxt1}>Seamless Record Transfer.</p>
          <p className={styles.Ftxt11}>MediVerse secures patient records, making them tamper-proof for trust and reliability.</p>
          </div>
          <div className={styles.lineStyle2}></div>

          {/*FEATURE 3*/}
          <div className={styles.feature3}>
            <img src="F3.png" alt="Pic 3" style={{ width: '100%', height: '100%' }} />
          </div>
          <div className={styles.whiteRectangle3}>
          <p className={styles.Ftxt3}>Immutable Records.</p>
          <p className={styles.Ftxt11}>Patients transfer records between institutions, managing access, reducing administrative burden, ensuring care continuity</p>
          </div>
          <div className={styles.lineStyle3}></div>

          {/*FEATURE 4*/}
          <div className={styles.feature4}>
            <img src="F4.png" alt="Pic 4" style={{ width: '100%', height: '100%' }} />
          </div>
          <div className={styles.whiteRectangle4}>
          <p className={styles.Ftxt4}>Security and Privacy.</p>
          <p className={styles.Ftxt11}>MediVerse prioritizes patient data security, offerinG control and privacy through advanced measures.</p>
          </div>
          <div className={styles.lineStyle4}></div>

          {/*FEATURE 5*/}
          <div className={styles.feature5}>
            <img src="F5.png" alt="Pic 5" style={{ width: '100%', height: '100%' }} />
          </div>
          <div className={styles.whiteRectangle5}>
          <p className={styles.Ftxt1}>Transparency and Auditability.</p>
          <p className={styles.Ftxt11}>MediVerse provides clear, traceable records, fostering accountability and trust in healthcare transactions.</p>
          </div>
          <div className={styles.lineStyle5}></div>

          {/*FEATURE 6*/}
          <div className={styles.feature6}>
            <img src="F6.png" alt="Pic 6" style={{ width: '100%', height: '100%' }} />
          </div>
          <div className={styles.whiteRectangle6}>
          <p className={styles.Ftxt1}>Consent Management & Patient Ownership.</p>
          <p className={styles.Ftxt11}>MediVerse empowers patients, giving them control over their data and ensuring privacy through consent management.</p>
          </div>
          <div className={styles.lineStyle6}></div>
        </section>

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
