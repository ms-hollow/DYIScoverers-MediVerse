import LandingPageHeader from "@/components/LandingPageHeader";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div> {/* Pass here yung Text na want ilagay sa call-t-action button ng landingPage header */}
          <LandingPageHeader buttonText="REGISTER" />
      </div>



        



    </>
  );
}
