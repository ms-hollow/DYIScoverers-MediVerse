
import React from 'react';
import { useRouter } from 'next/router';
import styles from '/styles/generalPages.module.css';
import Link from 'next/link';
import LandingPageLayout from '@/components/landingPageLayout'; 
import LandingPageHeader from "@/components/landingPageHeader";

const Features = () => {
    return (
        <>
            <div> 
                <LandingPageHeader buttonText="LOG IN" />
            </div>
             <div style={{position: 'absolute', top: '500px', left: '196.49px', backgroundColor: '#00838F', width: '253.31px', height: '2px'}}></div>
          
                 
        </>
    );
};

export default Features;
