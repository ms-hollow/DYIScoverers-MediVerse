import styles from '../../styles/homePatient.module.css'
import Layout from '../../components/HomeSidebarHeader.js'
import fs from 'fs';
import path from 'path';
import Link from 'next/link';


export async function getStaticProps() {
    const filePath1 = path.join(process.cwd(), 'public/placeHolder/dummyData_HomePatient.json');
    const jsonData1 = fs.readFileSync(filePath1, 'utf8');
    const data1 = JSON.parse(jsonData1);

    const filePath2 = path.join(process.cwd(), 'public/placeHolder/dummyData_notifHome.json');
    const jsonData2 = fs.readFileSync(filePath2, 'utf8');
    const data2 = JSON.parse(jsonData2);

    return {
        props: {
            data1, data2
        }
    };
}

const HomePatient = ({ data1, data2 }) => {
    return ( 
        <Layout pageName="Home">
        <>
            <div className={styles.container}>
                <div className={styles.welcomeText}>
                    <p>Welcome Back, Nick Holster</p>
                </div>

                <div className={styles.tableHeading}>
                    <p>Diagnosis</p>
                    <p>Hospital</p>
                    <p>Physician</p>
                    <p>Admission Date</p>
                    <p>Discharge Date</p>
                </div>

                <div className={styles.dataContainer}>
                    {data1.map(data => (
                        <Link href="/" key={data.id} className={styles.data}>
                            <p>{data.diagnosis}</p>
                            <p>{data.hospital}</p>
                            <p>{data.physician}</p>
                            <p>{data.admissionDate}</p>
                            <p>{data.dischargeDate}</p>
                        </Link>
                    ))}
                </div>

                <div className={styles.notifContainer}>
                    <div className={styles.notifSection_header}>
                        <div className={styles.notifTitle}>
                            <img src="/bell.svg" alt="bell-icon"/>
                            <p>Notifications</p>
                        </div>
                        <div className={styles.threeDot}>
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                    </div>
                    
                    <div className={styles.tableContainer}>
                        {data2.map(data => (
                            <Link href="/" key={data.id} className={styles.notifDataContainer}>
                                <p className={styles.icon}>{data.icon && <img src={data.icon}/>}</p>
                                <div className={styles.typedes}>
                                    <p className={styles.notifTypeFormat}>{data.notificationType}</p>
                                    <p className={styles.desFormat}>{data.description}</p>
                                </div>
                                <p className={styles.timeStampFormat}>{data.timeStamp}</p>
                            </Link>
                        ))}
                    </div>
                    
                </div>
            </div>
        </>
        </Layout>
     );
}
 
export default HomePatient;