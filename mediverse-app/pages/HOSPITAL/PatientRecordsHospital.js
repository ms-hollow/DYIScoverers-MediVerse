import styles from '../../styles/medicalHistory.module.css';
import Layout from '../../components/HomeSidebarHeader.js'
import fs from 'fs';
import path from 'path';
import Link from 'next/link';

/**
 * TODO: Retrieve lahat ng patients record from the blockchain then display/populate the table
 * ! Note: Bali i-reretrieve ang record then display lang yung patient name, hospital name, admission and discharge data, and Lenght of stay
 * * nakatuple and array ang data na i-reretrieve, need gumawa ng function na naghihiwalay ng data at siya na bahala magpopulate ng table
 */


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
                        <Link href="/" key={data.id} className={styles.data}>
                            <p className={styles.diaAttrb}>{data.name}</p>
                            <p>{data.hospital}</p>
                            <p>{data.admissionDate}</p>
                            <p>{data.dischargeDate}</p>
                            <p>{data.stayLength}</p>
                        </Link>
                    ))}
                </div>

                <button className={styles.submitButton} onClick={handleAdd}>
                    <Link href="/">Add Patient</Link>
                </button>
            </div>
        </>
        </Layout>
    );
}
 
export default MedicalHistoryPatient;