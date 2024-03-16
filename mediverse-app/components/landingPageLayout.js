import Footer from "./generalFooter"
import Header from "./landingPageHeader"

const LandingPageLayout = ({ children }) => {  {/* name of layout or component must start with uppercase */}
  return (
    <div className="content">
      <Header />
      { children }
      <Footer />
    </div>
  );
}
 
export default LandingPageLayout


