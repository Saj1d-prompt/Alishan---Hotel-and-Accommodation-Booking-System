import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import CTASection from "@/components/public/CTASection";

import LocationHero from "@/components/public/LocationHero";
import LocationGrid from "@/components/public/LocationGrid";

const Locations = () => {
  return (
    <>
      <Navbar />

      <main className="bg-slate-50">

        <LocationHero />

        <LocationGrid />

        <CTASection />

      </main>

      <Footer />
    </>
  );
};

export default Locations;