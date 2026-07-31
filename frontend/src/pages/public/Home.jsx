import HeroSection from "@/components/public/HeroSection";
import LocationsSection from "@/components/public/LocationsSection";
import WhyChooseSection from "@/components/public/WhyChooseSection";
import ExperienceSection from "@/components/public/ExperienceSection";
import StatsSection from "@/components/public/StatsSection";
import  Footer  from "@/components/public/Footer";
import CTASection from "@/components/public/CTASection";

const Home = () => {
  return (
    <>
      <HeroSection />
      <LocationsSection />
      <WhyChooseSection />
      <ExperienceSection />
      <StatsSection />
      <CTASection />
      <Footer />
    </>
  );
};

export default Home;