import {
  ShieldCheck,
  BedDouble,
  MapPin,
  BadgeDollarSign,
  Wifi,
  Headset,
} from "lucide-react";

import Container from "./Container";
import SectionTitle from "./SectionTitle";
import FeatureCard from "./FeatureCard";

const features = [
  {
    icon: ShieldCheck,
    title: "Safe & Secure",
    description:
      "Enjoy a safe living environment with responsive support and secure accommodation.",
  },
  {
    icon: BedDouble,
    title: "Fully Furnished",
    description:
      "Move in comfortably with furnished rooms and essential amenities already provided.",
  },
  {
    icon: MapPin,
    title: "Prime Locations",
    description:
      "Conveniently located near public transport, shopping, universities, and workplaces.",
  },
  {
    icon: BadgeDollarSign,
    title: "Affordable Pricing",
    description:
      "Transparent monthly pricing with excellent value and no hidden surprises.",
  },
  {
    icon: Wifi,
    title: "High-Speed Internet",
    description:
      "Reliable Wi-Fi throughout the property for work, study, and entertainment.",
  },
  {
    icon: Headset,
    title: "Friendly Support",
    description:
      "Our team is here to assist you whenever you need help during your stay.",
  },
];

const WhyChooseSection = () => {
  return (
    <section className="bg-white py-24">
      <Container>
        <SectionTitle
          badge="WHY CHOOSE ALISHAN"
          title="Comfort, Security & Convenience"
          subtitle="Everything you need for a comfortable stay in Lithuania, all in one place."
        />

        <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard
              key={feature.title}
              {...feature}
            />
          ))}
        </div>
      </Container>
    </section>
  );
};

export default WhyChooseSection;