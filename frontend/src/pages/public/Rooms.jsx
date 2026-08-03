import RoomHero from "@/components/public/RoomHero";
import RoomGrid from "@/components/public/RoomGrid";
import CTASection from "@/components/public/CTASection";

const Rooms = () => {
  return (
    <main className="bg-slate-50">
      <RoomHero />

      <RoomGrid />

      <CTASection />
    </main>
  );
};

export default Rooms;