{/* Tried modifying this para either Landing or Login Header pwedeng
i call out using only one layout. Then if ayaw nyo, hinidi ko na lang muna binura yung hiwalay na
loginpatientlayout incase na buggy ang ganito*/}

import Footer from "./generalFooter";
import LandingPageHeader from "./landingPageHeader"; 
import LogInPatientHeader from "./logInPatientHeader"; 

const LandingPageLayout = ({ children }) => {
  return (
    <div className="content">
      {/* Depending on the page, use the appropriate header */}
      <LandingPageHeader />
      <LogInPatientHeader />  
      {children}
      <Footer />
    </div>
  );
}
<<<<<<< HEAD

export default LandingPageLayout;
=======
 
export default LandingPageLayout
>>>>>>> ab3699cbdc3c3b88f2a56828605bf83b637be237
