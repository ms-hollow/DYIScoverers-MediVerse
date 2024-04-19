import React, { useState } from 'react';
import styles from '/styles/generalPages.module.css';
import LandingPageHeader from "@/components/landingPageHeader";

const FAQs = () => {
    const [selectedQuestion, setSelectedQuestion] = useState(null); // State to store the selected question

    // Function to handle dropdown click
    const handleDropdownClick = (questionId) => {
        setSelectedQuestion(selectedQuestion === questionId ? null : questionId);
    };

    // Array of questions and answers
    const faqs = [
        { id: 1, question: "Can I access my medical records from any device?", answer: "Yes, MediVerse is a web-based application, allowing you to access your medical records securely from any device with an internet connection." },
        { id: 2, question: "How can I transfer my records to a new hospital?", answer: "Transferring your records to a new hospital is simple with MediVerse. You can revoke access from your previous hospital and grant access to the new one, ensuring a seamless transition of your medical history." },
        { id: 3, question: "Is my data shared with third parties?", answer: "No, your data is not shared with third parties without your explicit consent. MediVerse prioritizes patient privacy and confidentiality, adhering to strict data protection regulations." },
        { id: 4, question: "Can family members or caregivers access my medical records through MediVerse?", answer: "With your permission, family members or caregivers can be granted access to your medical records through designated sharing options within the platform. This feature ensures efficient coordination of care among loved ones." },
        { id: 5, question: "What happens to my medical records if I move to a different country?", answer: "MediVerse is designed to facilitate global access to medical records. Even if you move to a different country, you can securely access and transfer your records as long as you have an internet connection." },
        { id: 6, question: "What happens to my medical records if I deactivate my account?", answer: "If you choose to deactivate your account, your medical records will remain securely stored within the MediVerse system. However, access to your records will be revoked until you reactivate your account or transfer your records to another platform." },
        { id: 7, question: "Is my personal information shared with other users on the MediVerse platform?", answer: "No, your personal information is kept confidential and is not shared with other users on the MediVerse platform. Access to your medical records is strictly controlled, and sharing permissions are managed by you." },
        { id: 8, question: "How does MediVerse handle data backup and disaster recovery?", answer: "MediVerse employs robust data backup and disaster recovery protocols to ensure the continuity and availability of medical records. Regular backups are performed, and redundant systems are in place to mitigate the risk of data loss in the event of unforeseen circumstances." },
        { id: 9, question: "How does MediVerse ensure the accuracy of medical records?", answer: "MediVerse employs stringent data verification processes to ensure the accuracy and integrity of medical records. Additionally, users can review their records, report any discrepancies, and collaborate with healthcare providers to update information as needed." },
        { id: 10, question: "How does MediVerse ensure data interoperability and compatibility with other healthcare systems and electronic health record (EHR) platforms?", answer: "MediVerse prioritizes data interoperability and compatibility with other healthcare systems and EHR platforms. Standards-based interoperability protocols and data exchange mechanisms are implemented to facilitate seamless data sharing and collaboration between different healthcare stakeholders." },
    ];

    return (
        <>
            <div> 
                <LandingPageHeader buttonText="LOG IN" buttonLink= "/PATIENT/logInPatient/"/> 
            </div>
            <div className={styles.faqTextContainer}>
                <h2 className={styles.faqText}>FREQUENTLY ASKED QUESTIONS</h2>
            </div>
            <div style={{ position: 'absolute', left: '71px', top: '160px', width: '1379.01px', height: 'px' }}>
                <img src="/FAQsLine.png" alt="FAQSLINE" style={{ width: '100%', height: '100%' }} />
            </div>
            <div className={styles.helpText}>HOW CAN WE HELP YOU?</div>
            <div className={styles.searchBar}>
                <img src="/SearchIcon.png" alt="Search" className={styles.searchIcon} />
                <input type="text" placeholder="Search..." className={styles.searchInput} />
            </div>


            <div className={styles.dropdownContainer}>
                {faqs.map((faq) => (
                    <div key={faq.id} className={styles.dropdownItem}>
                        <div className={styles.dropdownQuestion} onClick={() => handleDropdownClick(faq.id)}>
                            <span>{faq.question}</span>
                            {selectedQuestion === faq.id ? <span>&#x25BC;</span> : <span>&#x25B6;</span>}
                        </div>
                        {selectedQuestion === faq.id && (
                            <div className={styles.answer}>{faq.answer}</div>
                        )}
                    </div>
                ))}
            </div>
        </>
    );
};

export default FAQs;
