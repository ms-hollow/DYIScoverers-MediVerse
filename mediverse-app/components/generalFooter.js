import styles from '/styles/footer.module.css'
import Link from 'next/link';

const Footer = () => {
  return (
    <>
      <footer className={styles.footer}>
        <div className={styles.footerFormat}>
          <div className={styles.columnSection}>
            <Link href='/' className={styles.icon}><img src='/MediVerse Logo (with Text).svg' alt='Logo'/></Link>
            <div>@2024 DYIScoverers - MediVerse</div>
            <div>All Rights Reserved.</div>
          </div>
          <div className={styles.columnSection}>
            <p>Learn More </p>
            <Link href='/#features'>Features</Link>
            <Link href='/GENERAL/FAQs/'>FAQs</Link>
            <Link href='/GENERAL/ContactUs'>Contact Us</Link>
          </div>
          <div className={styles.columnSection}>
            <p>Legal</p>
            <Link href='/'>Privacy Policy</Link>
            <Link href='/'>Terms of Services</Link>
          </div> 
        </div>     
      </footer>
    </>
  );
}
 
export default Footer;