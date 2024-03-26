import HomeSidebarHeader from "@/components/HomeSidebarHeader";
import React, { useState } from 'react';
import styles from '../../styles/medicalHistory.module.css';
import styles2 from '/styles/homeSidebarHeader.module.css';
import fs from 'fs';
import path from 'path';
import Link from 'next/link';


export async function getStaticProps() {
    const filePath = path.join(process.cwd(), 'public/placeHolder/dummyData.json');
    const jsonData = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(jsonData);

    return {
        props: {
            data
        }
    };
}

const MedicalHistoryPatient = ({ data }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    }

    return (  
        <>
            <HomeSidebarHeader/>
            <div className={`${styles2.contentContainer} ${isSidebarOpen ? styles2.contentShifted : ''}`}>
                <div className={styles.container}>
                    <div className={styles.tableHeading}>
                        <p>Diagnosis</p>
                        <p>Hospital</p>
                        <p>Physician</p>
                        <p>Admission Date</p>
                        <p>Discharge Date</p>
                    </div>

                    {data.map(data => (
                        <Link href="/" key={data.id} className={styles.data}>
                            <p className={styles.diaAttrb}>{data.diagnosis}</p>
                            <p>{data.hospital}</p>
                            <p>{data.physician}</p>
                            <p>{data.admissionDate}</p>
                            <p>{data.dischargeDate}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </>
    );
}
 
export default MedicalHistoryPatient;