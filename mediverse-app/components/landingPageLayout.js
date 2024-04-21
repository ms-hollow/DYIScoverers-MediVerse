{/* Tried modifying this para either Landing or Login Header pwedeng
i call out using only one layout. Then if ayaw nyo, hinidi ko na lang muna binura yung hiwalay na
loginpatientlayout incase na buggy ang ganito*/}

import Footer from "./generalFooter";
import LandingPageHeader from "./landingPageHeader"; 

const LandingPageLayout = ({ children }) => {
  return (
    <div className="content">
      <LandingPageHeader />
        {children}
      <Footer />
    </div>
  );
}

export default LandingPageLayout;
