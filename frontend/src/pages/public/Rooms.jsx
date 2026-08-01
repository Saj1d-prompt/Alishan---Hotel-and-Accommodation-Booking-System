import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import CTASection from "@/components/public/CTASection";

import RoomHero from "@/components/public/RoomHero";
import RoomGrid from "@/components/public/RoomGrid";

const Rooms = () => {
  return (
    <>
      <Navbar />

      <main className="bg-slate-50">

        <RoomHero />

        <RoomGrid />

        <CTASection />

      </main>

      <Footer />
    </>
  );
};

export default Rooms;