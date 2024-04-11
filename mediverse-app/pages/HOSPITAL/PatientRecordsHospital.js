import styles from '../../styles/medicalHistory.module.css';
import Layout from '../../components/HomeSidebarHeaderHospital.js'
import fs from 'fs';
import path from 'path';
import Link from 'next/link';


export async function getStaticProps() {
    const filePath = path.join(process.cwd(), 'public/placeHolder/dummyData_PatientRecords.json');
    const jsonData = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(jsonData);

    return {
        props: {
            data
        }
    };
}

const MedicalHistoryPatient = ({ data }) => {
    const handleAdd = () => {
        console.log('Button clicked');
    };
    
    return (  
        <Layout pageName = "Patient Records">
        <>
            <div className={styles.container}>
                <div className={styles.tableHeading}>
                    <p>Patient Name</p>
                    <p>Hospital</p>
                    <p>Admission Date</p>
                    <p>Discharge Date</p>
                    <p>Length of Stay</p>
                </div>

                <div className={styles.dataContainer}>
                    {data.map(data => (
                        < div className={styles.perSection}>
                            <div className={styles.forResponsiveness}>
                                <p>Patient Name</p>
                                <p>Hospital</p>
                                <p>Admission Date</p>
                                <p>Discharge Date</p>
                                <p>Length of Stay</p>
                            </div>
                            <Link href="/HOSPITAL/MedicalHistory1Hospital" key={data.id} className={styles.data}>
                                <p className={styles.diaAttrb}>{data.name}</p>
                                <p>{data.hospital}</p>
                                <p>{data.admissionDate}</p>
                                <p>{data.dischargeDate}</p>
                                <p>{data.stayLength}</p>
                            </Link> 
                        </div>
                    ))}
                </div>
                <button className={styles.submitButton} onClick={handleAdd}>
                    <Link href="/HOSPITAL/AddPatient">+</Link>
                </button>
            </div>
        </>
        </Layout>
    );
}
 
export default MedicalHistoryPatient;