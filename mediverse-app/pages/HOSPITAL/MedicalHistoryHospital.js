import Layout from '../../components/HomeSidebarHeader.js'
import styles from '../../styles/medicalHistoryHospital.module.css';
import React, { useState, useEffect } from 'react';

const MedicalHistoryHospital = () => {

    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch('/placeHolder/dummyData_MedicalHistory_Hospital.json');
            const json = await res.json();
            const item = json.find(item => item.id === 1); // Filter data for ID 1
            setData(item);
        };

        fetchData();
    }, []);

    if (!data) {
        return <div>Loading...</div>;
    }

    return ( 
        <Layout pageName = "Medical History">
        <>
            <div className={styles.container}>
                <div className={styles.basicInfoContainer}>
                    <div className={styles.headingAttrb_formatting}>
                        <p className={styles.headingAttrb}>Doctor Consulted</p>   
                        <p className={styles.dataFormat}>{data.basicInfo.doctor}</p>
                        <p className={styles.doctorTypeFormat}>{data.basicInfo.doctorType}</p>
                    </div>
                    <div className={styles.headingAttrb_formatting}>
                        <p className={styles.headingAttrb}>Date of Diagnosis</p>  
                        <p className={styles.dataFormat}>{data.basicInfo.dateDiagnosis}</p> 
                    </div>
                    <div className={styles.headingAttrb_formatting}>
                        <p className={styles.headingAttrb}>Diagnosis</p>   
                        <p className={styles.dataFormat_diag}>{data.basicInfo.diagnosis}</p> 
                    </div>
                    <div className={styles.headingAttrb_des}>
                        <p className={styles.headingAttrb}>Description</p>   
                        <p className={styles.dataFormat_des}>{data.basicInfo.description}</p> 
                    </div>
                </div>

                <div className={styles.table_container}>
                    <p className={styles.table_title}>Signs and Symptoms</p>
                    <div className={styles.sANDs_heading}>
                        <p>Symptoms</p>
                        <p>Duration</p>
                        <p>Severity</p>
                        <p>Location</p>
                    </div>

                    <div className={styles.scrollableTable_container}>
                        {data.signsAndSymptoms.map(data => (
                            <div key={data.sANDs_ID} className={styles.sANDs_data}>
                                <p>{data.symptoms}</p>
                                <p>{data.duration}</p>
                                <p>{data.severity}</p>
                                <p>{data.location}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.table_container}>
                    <p className={styles.table_title}>Treatment/Procedure</p>
                    <div className={styles.treatment_heading}>
                        <p>Treatment/Procedure</p>
                        <p>Medical Team/Provider</p>
                        <p>Date Started</p>
                        <p>Date End</p>
                        <p>Duration</p>
                    </div>

                    <div className={styles.scrollableTable_container}>
                        {data.treatment.map(data => (
                            <div key={data.treatment_ID} className={styles.treatment_data}>
                                <p>{data.treatment}</p>
                                <p>{data.medicalTeam}</p>
                                <p>{data.dateStarted}</p>
                                <p>{data.dateEnd}</p>
                                <p>{data.duration}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.table_container}>
                    <p className={styles.table_title}>Test</p>
                    <div className={styles.test_heading}>
                        <p>Type of Test</p>
                        <p>Ordering Physician</p>
                        <p>Date</p>
                        <p>Reviewing Physician</p>
                        <p>Result</p>
                    </div>

                    <div className={styles.scrollableTable_container}>
                        {data.test.map(data => (
                            <div key={data.test_ID} className={styles.test_data}>
                                <p>{data.testType}</p>
                                <p>{data.orderingPhysician}</p>
                                <p>{data.date}</p>
                                <p>{data.reviewingPhysician}</p>
                                <p>{data.result}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
        </Layout>
     );
}
 
export default MedicalHistoryHospital;