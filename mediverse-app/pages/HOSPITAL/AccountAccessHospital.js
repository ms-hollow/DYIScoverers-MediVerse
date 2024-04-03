import styles from '../../styles/accountAccess.module.css';
import Layout from '../../components/HomeSidebarHeader.js'
import React, { useState, useEffect  } from 'react';

const AccountAccessHospital = () => {

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


    //for fetching dummy data
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch('/placeHolder/dummyData_AccountAccessHospital.json');
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
        <Layout pageName="Account Access">
        <>
            <div className={styles.container}>
                <div className={styles.pageNavigator}>
                    <button className={showAccountAccess ? styles.activeButton_accAccess : ''} onClick={handleAccountAccessClick}>Account Access</button>
                    <button className={showAccountAccess ? '' : styles.activeButton_reqAccess} onClick={handleRequestAccessClick}>Request Access</button>
                </div>

                {showAccountAccess ? (
                    <div className={styles.tableContainer}>
                        <div className={styles.tableHeading_hospital}>
                            <p>Patient Name</p>
                            <p>Date of Consultation</p>
                            <p>Account Access</p>
                        </div>

                        <div className={styles.dataContainer}>
                            {data.accountAccess.map(data => (
                                <div key={data.accountAccess_ID} className={styles.data_hospital}>
                                    <p>{data.patientName}</p>
                                    <p>{data.dateConsultation}</p>
                                    <button onClick={handleRevokeAccessClick}>View Medical Records</button>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className={styles.tableContainer}>
                        <div className={styles.tableHeading_reqAccess_hospital}>
                            <p>Patient Name</p>
                            <p>Status of Account Access</p>
                        </div>

                        <div className={styles.dataContainer}>
                            {data.requestAccess.map(data => (
                                <div key={data.request_ID} className={styles.data_reqAccess}>
                                    <p>{data.patientName}</p>
                                    <p>{data.status}</p>
                                    <button onClick={handleAcceptAccessClick}>Add Patient</button>
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
 
export default AccountAccessHospital;;