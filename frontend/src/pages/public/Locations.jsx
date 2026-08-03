import LocationHero from "@/components/public/LocationHero";
import LocationGrid from "@/components/public/LocationGrid";
import CTASection from "@/components/public/CTASection";

const Locations = () => {
  return (
    <main className="bg-slate-50">
      <LocationHero />

      <LocationGrid />

      <CTASection />
    </main>
  );
};

export default Locations;