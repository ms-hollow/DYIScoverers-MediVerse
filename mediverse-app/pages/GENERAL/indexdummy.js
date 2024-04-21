import Link from 'next/link';
import styles from '/styles/landingPageDummy.module.css';
import LandingPageHeader from '@/components/landingPageHeader';
import LandingPageLayout from '@/components/landingPageLayout';

const  LandingPage = () => {
    return (
        <LandingPageLayout>
        <>
            <LandingPageHeader buttonText="LOG IN" buttonLink= "/PATIENT/logInPatient"/>
            
            <div className={styles.container}>
                <section id='landingPage' className={styles.landingPage}>
                    <div className={styles.welcomeMessage}>
                        <p className={styles.slogan}>Your Health, Your Universe, Connected.</p>
                        <p className={styles.subSlogan}>Secure your medical history, simplify your healthcare – Sign Up for MediVerse now!</p>                        
                        <Link href="/PATIENT/Register1Patient/" className={styles.getStarted}>Get Started</Link>
                    </div>
                    <img src='/landingPage banner pic.svg' alt='Landing Page Banner Illustration' className={styles.pageBanner}/>
                </section>

                <section id='features'>
                    <div className={styles.featuresBanner}>
                        <img src='/features banner.svg' alt='Features Banner'/>
                        <div className={styles.bannerInfo}>
                            <div>
                                <p className={styles.infoTextLarge}>1M</p>
                                <p className={styles.infoTextSmall}>Satisfied Patients</p>
                            </div>
                            <div>
                                <p className={styles.infoTextLarge}>50k</p>
                                <p className={styles.infoTextSmall}>Renowed Doctors</p>
                            </div>
                            <div>
                                <p className={styles.infoTextLarge}>5k</p>
                                <p className={styles.infoTextSmall}>Progressive Hospitals</p>
                            </div>
                        </div>
                    </div>
                    <div className={styles.whyMediverse}>
                        <div className={styles.question}>
                            <p>Why Mediverse?</p>
                            <div></div>
                        </div>
                        <div className={styles.featuresItem}>
                            <div className={styles.columnFeatureSection}>
                                <div className={styles.feature}>
                                    <img src='/f1.svg' alt='Feature 1'/>
                                    <div className={styles.featureTxtContainer}>
                                        <p className={styles.featureInfo}>Digital Medical Record Management.</p>
                                        <div className={styles.lineStyle}></div>
                                        <p className={styles.featureDesc}>Patients access, update medical records digitally with lab results, medication tracking, appointment scheduling, and reminders for follow-ups.</p>
                                    </div>
                                </div>

                                <div className={styles.feature}>
                                    <img src='/f2.svg' alt='Feature 2'/>
                                    <div className={styles.featureTxtContainer}>
                                        <p className={styles.featureInfo}>Security and Privacy.</p>
                                        <div className={styles.lineStyle}></div>
                                        <p className={styles.featureDesc}>MediVerse prioritizes patient data security, offering control and privacy through advanced measures.</p>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.columnFeatureSection}>
                                <div className={styles.feature}>
                                    <img src='/f3.svg' alt='Feature 3'/>
                                    <div className={styles.featureTxtContainer}>
                                        <p className={styles.featureInfo}>Seamless Record Transfer.</p>
                                        <div className={styles.lineStyle}></div>
                                        <p className={styles.featureDesc}>Patients transfer records between institutions, managing access, reducing administrative burden, ensuring care continuity.</p>
                                    </div>
                                </div>

                                <div className={styles.feature}>
                                    <img src='/f4.svg' alt='Feature 4'/>
                                    <div className={styles.featureTxtContainer}>
                                        <p className={styles.featureInfo}>Transparency and Auditability.</p>
                                        <div className={styles.lineStyle}></div>
                                        <p className={styles.featureDesc}>MediVerse provides clear, traceable records, fostering accountability and trust in healthcare transactions.</p>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.columnFeatureSection}>
                                <div className={styles.feature}>
                                    <img src='/f5.svg' alt='Feature 5'/>
                                    <div className={styles.featureTxtContainer}>
                                        <p className={styles.featureInfo}>Immutable Records.</p>
                                        <div className={styles.lineStyle}></div>
                                        <p className={styles.featureDesc}>MediVerse secures patient records, making them tamper-proof for trust and reliability.</p>
                                    </div>
                                </div>

                                <div className={styles.feature}>
                                    <img src='/f6.svg' alt='Feature 6'/>
                                    <div className={styles.featureTxtContainer}>
                                        <p className={styles.featureInfo}>Consent Management & Patient Ownership.</p>
                                        <div className={styles.lineStyle}></div>
                                        <p className={styles.featureDesc}>MediVerse empowers patients, giving them control over their data and ensuring privacy through consent management.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </section>

                <section id='subscription' className={styles.subscriptionContainer}>
                    <p className={styles.subscriptionTextBanner}>Subscribe To Our Newsletter</p>
                    <p className={styles.subscriptionDesc}>Get latest news of our Mediverse</p>
                    <div className={styles.forNewsletterContainer}>
                        <span className={styles.forNewsletterTxt}>For Newsletter</span>
                        <div className={styles.emailContainer}>
                            <input
                                type="email"
                                placeholder="Enter your email here"
                                className={styles.emailInput}
                            />
                            <button className={styles.subscribeButton}>Subscribe</button>
                        </div>
                    </div>
                </section>
            </div>
        </>
        </LandingPageLayout>
    );
}
 
export default LandingPage;