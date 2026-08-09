import { motion } from "framer-motion";

import Container from "./Container";
import LocationCard from "./LocationCard";
import SectionTitle from "./SectionTitle";

import locations from "@/data/locations";

/*
 * Public-facing location order.
 *
 * 1. Pylimo
 * 2. Latgalių
 * 3. Šeškinės
 *
 * We define the order explicitly here so the
 * homepage cards always appear in the required
 * sequence regardless of IDs or any future changes
 * to the source array.
 */
const LOCATION_ORDER = [
  "pylimo",
  "latgaliu",
  "seskines",
];

const orderedLocations =
  LOCATION_ORDER
    .map((slug) =>
      locations.find(
        (location) =>
          location.slug === slug,
      ),
    )
    .filter(Boolean);

const LocationsSection = () => {
  return (
    <section className="bg-gray-50 py-24">
      <Container>
        <SectionTitle
          badge="OUR LOCATIONS"
          title="Choose Your Preferred Location"
          subtitle="Explore our accommodation locations in Vilnius and select the one that best suits your stay."
        />

        <motion.div
          initial={{
            opacity: 0,
          }}
          whileInView={{
            opacity: 1,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.5,
          }}
          className="mt-16 grid gap-8 lg:grid-cols-3"
        >
          {orderedLocations.map(
            (location) => (
              <LocationCard
                key={location.id}
                location={location}
              />
            ),
          )}
        </motion.div>
      </Container>
    </section>
  );
};

export default LocationsSection;