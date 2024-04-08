<<<<<<< HEAD
import HomeSidebarHeader from "@/components/HomeSidebarHeaderHospital";
import Image from "next/image";
import Link from "next/link";
=======
import styles from '../../styles/homeHospital.module.css'
import Layout from '../../components/HomeSidebarHeader.js'
import fs from 'fs';
import path from 'path';
import Link from 'next/link';
>>>>>>> front-end-kelvin

export async function getStaticProps() {
    const filePath1 = path.join(process.cwd(), 'public/placeHolder/dummyData_RecentPatients.json');
    const jsonData1 = fs.readFileSync(filePath1, 'utf8');
    const data1 = JSON.parse(jsonData1);

    const filePath2 = path.join(process.cwd(), 'public/placeHolder/dummyData_notifHospitalHome.json');
    const jsonData2 = fs.readFileSync(filePath2, 'utf8');
    const data2 = JSON.parse(jsonData2);

    return {
        props: {
            data1, data2
        }
    };
}

const HospitalHome = ({data1, data2}) => {
    return (  
        <Layout pageName="Home">
        <>
            <div className={styles.mainContainer}>
                <div className={styles.banner}>
                    <img src='/imageHome.svg' alt='Image Banner'/>
                    <div className={styles.banner_info}>
                        <div className={styles.infoFormat}>
                            <h5>1M</h5>
                            <p>Satisfied Patients</p>
                        </div>
                        <div className={styles.infoFormat}>
                            <h5>50k</h5>
                            <p>Renowed Doctors</p>
                        </div>
                        <div className={styles.infoFormat}>
                            <h5>5k</h5>
                            <p>Progressive Hospitals</p>
                        </div>
                    </div>
                </div>
                <div className={styles.bottomHalf_container}>
                    <div className={styles.recentPatients_container}>
                        <div className={styles.title}>
                            <p>Recent Patiens</p>
                            <Link href="/">
                                <p>View All &gt;</p>
                            </Link>
                        </div>
                        <div className={styles.tableHeading}>
                            <p>Patient Name</p>
                            <p>Admission Date</p>
                            <p>Discharge Date</p>
                            <p>Gender</p>
                            <p>Diagnosis</p>
                        </div>

                        <div className={styles.dataContainer}>
                            {data1.map(data => (
                                <Link href="/" key={data.id} className={styles.data}>
                                    <p className={styles.nameFormat}>{data.patientName}</p>
                                    <p>{data.admissionDate}</p>
                                    <p>{data.dischargeDate}</p>
                                    <p>{data.gender}</p>
                                    <p>{data.diagnosis}</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div className={styles.newPatientAndNotif_container}>
                        <div>
                            <Link href="/" className={styles.newPatient}>
                                <img src='/plus icon.svg' alt='Plus Icon'/>
                                <p>Add New Patients</p>
                            </Link>
                        </div>
                        <div className={styles.notifications}>
                            <Link href="/" className={styles.notif_title}>
                                <img src="/bell.svg" alt="bell-icon"/>
                                <p>Notifications</p>
                            </Link>
                            <div className={styles.notif_container}>
                                {data2.map(data => (
                                    <Link href="/" key={data.id} className={styles.notifData}>
                                        <p className={styles.notifIcon}>{data.icon && <img src={data.icon}/>}</p>
                                        <div className={styles.typeDesContainer}>
                                            <p className={styles.notifTypeFormat}>{data.notificationType}</p>
                                            <p className={styles.notifDesFormat}>{data.description}</p>
                                        </div>
                                        <p className={styles.timeStampFormat}>{data.timeStamp}</p>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
        </Layout>
    );
}
 
export default HospitalHome;
