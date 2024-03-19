import Footer from "./GeneralFooter"
import Header from "./LandingPageHeader"

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