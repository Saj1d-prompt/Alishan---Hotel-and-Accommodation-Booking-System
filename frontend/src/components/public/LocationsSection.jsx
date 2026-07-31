import { motion } from "framer-motion";

import Container from "./Container";
import SectionTitle from "./SectionTitle";

import LocationCard from "./LocationCard";

import locations from "../../data/locations";

const LocationsSection = () => {
  return (
    <section className="bg-gray-50 py-24">

      <Container>

        <SectionTitle
          badge="OUR LOCATIONS"
          title="Choose Your Preferred Location"
          subtitle="Discover our premium accommodation across Lithuania. Select the location that best suits your lifestyle."
        />

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: .5 }}
          className="mt-16 grid gap-8 lg:grid-cols-3"
        >
          {locations.map((location) => (
            <LocationCard
              key={location.id}
              location={location}
            />
          ))}
        </motion.div>

      </Container>

    </section>
  );
};

export default LocationsSection;