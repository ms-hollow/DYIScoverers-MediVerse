import React, { useState } from 'react';
import { useRouter } from 'next/router';
import LandingPageHeader from "@/components/landingPageHeader";
import styles from '/styles/generalPages.module.css'; 

const ContactUs = () => {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = () => {
        // Handle form submission here
        console.log('Submitted:', { name, email, message });
        router.push('/PATIENT/Register1Patient/'); //di ko pa alam saan ang route, kayo na lang magchange
    };

    return (
        <>
            <LandingPageHeader buttonText="Connect Wallet" />

            <div className={styles.mainContainer}>

                <p className={styles.contactUS_txt}>C O N T A C T    U S</p>
                <div className={styles.contactUsContainer}>
                    <div className={styles.fieldContainer}>
                        <p>
                            If you have any questions, concerns, or feedback about the MediVerse app, please don't 
                            hesitate to reach out to us. Our dedicated customer support team is here to assist you.
                        </p>
                        <p>Name</p>
                        <input
                            type="text"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)} 
                        />
                        <p>Email</p>
                        <input
                            type="text"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <p>Message</p>
                        <input
                            type="text"
                            placeholder="Enter your message or concern"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <button onClick={handleSubmit} className={styles.submitButton}>Submit</button>
                    </div>
                    <img src= '/Contact Us img.svg' alt='Contact Us Image' className={styles.image}/>
                </div>
            </div>



            {/* Text boxes for entering name, email, and message */}
            
            {/*<input
                type="text"
                placeholder="Enter your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={styles.customInputName} 
            />
            <input
                type="text"
                placeholder="Enter your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.customInputEmail} 
            />
            <input
                type="text"
                placeholder="Enter your Message or Concern"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className={styles.customInputMessage} 
            />*/}

           
            {/*<button onClick={handleSubmit} className={styles.submitButton}>Submit</button>*/}
        
        </>
    );
};

export default ContactUs;
