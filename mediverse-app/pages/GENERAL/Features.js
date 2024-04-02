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
            <div style={{ position: 'absolute', left: '73px', top: '110px', width: '1379px', height: '84px' }}>
            <img src="/FeaturesHead.png" alt="Features" style={{ width: '100%', height: '100%' }} />
            </div>
            <div style={{ position: 'absolute', left: '172.94px', top: '255px', width: '317.47px', height: '322.75px' }}>
            <img src="/Features1.png" alt="Features" style={{ width: '100%', height: '100%' }} />
            </div>
            <div style={{ position: 'absolute', left: '609.5px', top: '255px', width: '317.47px', height: '322.75px' }}>
            <img src="/Features2.png" alt="Features" style={{ width: '100%', height: '100%' }} />
            </div>
            <div style={{ position: 'absolute', left: '1036.04px', top: '255px', width: '317.47px', height: '322.75px' }}>
            <img src="/Features3.png" alt="Features" style={{ width: '100%', height: '100%' }} />
            </div>
            <div style={{ position: 'absolute', left: '163px', top: '595px', width: '317.47px', height: '302.57px' }}>
            <img src="/Features4.png" alt="Features" style={{ width: '100%', height: '100%' }} />
            </div>
            <div style={{ position: 'absolute', left: '609.11px', top: '595px', width: '317.47px', height: '302.57px' }}>
            <img src="/Features5.png" alt="Features" style={{ width: '100%', height: '100%' }} />
            </div>
            <div style={{ position: 'absolute', left: '1036.04px', top: '595px', width: '317.47px', height: '302.57px' }}>
            <img src="/Features6.png" alt="Features" style={{ width: '100%', height: '100%' }} />
            </div>

             {/*
            <div style={{ position: 'absolute', left: '160px', top: '260px', width: '1190.05px', height: '680.32px' }}>
            <img src="/FeaturesBody.png" alt="Features Body" style={{ width: '100%', height: '100%' }} />
            </div>
             ito buong image to ng features, tell if I should code it one by one and ayaw nyo ng ganito*/}

        </>
    );
};

export default Features;
