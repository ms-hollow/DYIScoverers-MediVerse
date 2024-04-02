import React, { useState } from 'react';
import { useRouter } from 'next/router';
import LandingPageHeader from "@/components/landingPageHeader";
import styles from '/styles/generalPages.module.css'; 
import Link from 'next/link';

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
            <div> 
                <LandingPageHeader buttonText="Connect Wallet" />
            </div>
            <div style={{ position: 'absolute', left: '74px', top: '169px', width: '1377px', height: '524px' }}>
                <img src="/ContactUsRectangle.png" alt="Contact Us" style={{ width: '100%', height: '100%' }} />
            </div>
            <div style={{ position: 'absolute', left: '877px', top: '215px', width: '450px', height: '408.54px' }}>
                <img src="/ContactUsPic1.png" alt="Contact Us Picture 1" style={{ width: '100%', height: '100%' }} />
            </div>
            <div style={{ position: 'absolute', left: '625px', top: '154px', width: 'px', height: 'px' }}>
                <img src="/ContactUsText.png" alt="Contact Us Text" style={{ width: '100%', height: '100%' }} />
            </div>
            <div style={{ position: 'absolute', left: '1400px', top: '595px', width: '50px', height: '100px' }}>
                <img src="/Frame5.png" alt="Frame 5" style={{ width: '100%', height: '100%' }} />
            </div>
            <div style={{ position: 'absolute', left: '1409px', top: '609px', width: '35px', height: '35px' }}>
                <img src="/ContactUsEmail.png" alt="Contact Us Email" style={{ width: '100%', height: '100%' }} />
            </div>
            <div style={{ position: 'absolute', left: '1410px', top: '647px', width: '35px', height: '35px' }}>
                <img src="/ContactUsCall.png" alt="Contact Us Email" style={{ width: '100%', height: '100%' }} />
            </div>
            <div style={{ position: 'absolute', left: '149px', top: '236px', width: '540px', height: '47px' }}>
                <img src="/ContactUsText2.png" alt="text2" style={{ width: '100%', height: '100%' }} />
            </div>
            <div style={{ position: 'absolute', left: '150px', top: '315px', fontFamily: 'Roboto Condensed', fontSize: '16px', color: 'black' }}>
                Name
            </div>
            <div style={{ position: 'absolute', left: '150px', top: '400px', fontFamily: 'Roboto Condensed', fontSize: '16px', color: 'black' }}>
                Email
            </div>
            <div style={{ position: 'absolute', left: '150px', top: '485px', fontFamily: 'Roboto Condensed', fontSize: '16px', color: 'black' }}>
                Message
            </div>

            {/* Text boxes for entering name, email, and message */}
            <input
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
            />

            {/* Submit button */}
            <button onClick={handleSubmit} className={styles.submitButton}>Submit</button>
        </>
    );
};

export default ContactUs;
