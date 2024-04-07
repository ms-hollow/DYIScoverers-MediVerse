import styles from '../../styles/accountAccess.module.css';
import Layout from '../../components/HomeSidebarHeader.js'
import fs from 'fs';
import path from 'path';
import React, { useState } from 'react';

/**
 * TODO: Get name, doctor and date of consultation ng mga hospitals na may access sa lahat ng record
 * 
 */

export async function getStaticProps() {
    const filePath = path.join(process.cwd(), 'public/placeHolder/dummyData_AccountAccess.json');
    const jsonData = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(jsonData);

    return {
        props: {
            data
        }
    };
}

const AccountAccessPatient = ({data}) => {

    const [showAccountAccess, setShowAccountAccess] = useState(true);

    const handleAccountAccessClick = () => {
        setShowAccountAccess(true);
    };

    const handleRequestAccessClick = () => {
        setShowAccountAccess(false);
    };

    const handleRevokeAccessClick = () => {
        //onClick Function for Revoke Access Button
    }

    const handleAcceptAccessClick = () => {
        //onClick Function for Accept Account Access Request Button
    }

    const handleDeclineAccessClick = () => {
        //onClick Function for Decline Account Access Request Button
    }

    return ( 
        <Layout pageName="Account Access">
        <>
            <div className={styles.container}>
                <div className={styles.pageNavigator}>
                    <button className={showAccountAccess ? styles.activeButton_accAccess : ''} onClick={handleAccountAccessClick}>Account Access</button>
                    <button className={showAccountAccess ? '' : styles.activeButton_reqAccess} onClick={handleRequestAccessClick}>Request Access</button>
                </div>

                {showAccountAccess ? (
                    <div className={styles.tableContainer}>
                        <div className={styles.tableHeading}>
                            <p>Hospital Name</p>
                            <p>Doctor Consulted</p>
                            <p>Date of Consultation</p>
                            <p>Account Access</p>
                        </div>

                        <div className={styles.dataContainer}>
                            {data.map(data => (
                                <div key={data.id} className={styles.data}>
                                    <p>{data.hospitalName}</p>
                                    <p>{data.doctorConsulted}</p>
                                    <p>{data.dateConsultation}</p>
                                    <button onClick={handleRevokeAccessClick}>Revoke Access</button>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className={styles.tableContainer}>
                        <div className={styles.tableHeading_reqAccess}>
                            <p>Hospital Name</p>
                            <p>Account Access</p>
                        </div>

                        <div className={styles.dataContainer}>
                            {data.map(data => (
                                <div key={data.id} className={styles.data_reqAccess}>
                                    <p>{data.hospitalName}</p>
                                    <button onClick={handleAcceptAccessClick}>Accept</button>
                                    <button onClick={handleDeclineAccessClick}>Decline</button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </>
        </Layout>
    );
}
 
export default AccountAccessPatient;