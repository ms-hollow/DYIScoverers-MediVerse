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
                    <LandingPageHeader buttonText="Connect Wallet" />
                </div>
                
        </>
    );
};

export default Features;


