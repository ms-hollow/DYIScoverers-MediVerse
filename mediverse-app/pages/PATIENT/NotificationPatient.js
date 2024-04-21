import styles from '../../styles/notification.module.css';
import Layout from '../../components/HomeSidebarHeader.js'
import fs from 'fs';
import path from 'path';
import Link from 'next/link';

export async function getStaticProps() {
    const filePath = path.join(process.cwd(), 'public/placeHolder/dummyData_notification.json');
    const jsonData = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(jsonData);

    return {
        props: {
            data
        }
    };
}

const NotificationHospital = ({ data }) => {
    
    // IDs to display
    const idsToDisplay = [1, 1, 2 , 3 , 3 , 3, 2, 1, 1, 2, 2, 3, 2];

    // Filter data based on IDs
    const filteredData= idsToDisplay.map(id => {
        return data.filter(item => item.id === id);
    }).flat();
    
    return (  
        <Layout pageName="Notification">
        <>
            <div className={styles.container}>
                {filteredData.map(data => (
                    <Link href="/" key={data.id} className={styles.notifContainer}>
                        <p>{data.icon && <img src={data.icon}/>}</p>
                        <div className={styles.typeDes_format}>
                            <p className={styles.notifTypeFormat}>{data.notificationType}</p>
                            <p className={styles.des}>{data.description}</p>
                        </div>
                        <p className={styles.timeStampFormat}>{data.timeStamp}</p>
                    </Link>
                ))}
            </div>
        </>
        </Layout>
    );
}
 
export default NotificationHospital;