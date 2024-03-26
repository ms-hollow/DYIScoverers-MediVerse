import styles from '../../styles/medicalHistory.module.css';
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
    return (  
        <div className={styles.container}>

            <div className={styles.tableHeading}>
                <p className={styles.diagnosis_position}>Diagnosis</p>
                <p className={styles.hosp_position}>Hospital</p>
                <p className={styles.phys_position}>Physician</p>
                <p className={styles.adm_position}>Admission Date</p>
                <p className={styles.dis_position}>Discharge Date</p>
            </div>

            {data.map(data => (
                <Link href="/" key={data.id} className={styles.data}>
                    <p className={styles.diagnosis_position}>{data.diagnosis}</p>
                    <p className={styles.hosp_position}>{data.hospital}</p>
                    <p className={styles.phys_position}>{data.physician}</p>
                    <p className={styles.adm_position}>{data.admissionDate}</p>
                    <p className={styles.dis_position}>{data.dischargeDate}</p>
                </Link>
            ))}
            
        </div>
    );
}
 
export default MedicalHistoryPatient;