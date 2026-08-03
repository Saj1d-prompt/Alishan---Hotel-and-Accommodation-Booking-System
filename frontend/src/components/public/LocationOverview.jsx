import { motion } from "framer-motion";
import {
  BedDouble,
  Building2,
  CheckCircle2,
  Euro,
  MapPinned,
} from "lucide-react";

import {
  formatRate,
  getStartingRate,
  getTermConfig,
} from "@/lib/accommodation";

const highlights = [
  "Fully furnished accommodation",
  "Comfortable and secure environment",
  "Excellent public transport connections",
  "High-speed Wi-Fi throughout the property",
];

const LocationOverview = ({
  location,
  selectedTerm,
}) => {
  const config = getTermConfig(
    location,
    selectedTerm
  );

  const startingRate =
    getStartingRate(
      location,
      selectedTerm
    );

  return (
    <section className="bg-white py-24">

      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        <div className="grid items-center gap-20 lg:grid-cols-2">

          <motion.div
            initial={{
              opacity: 0,
              x: -40,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.6,
            }}
          >

            <span className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">
              About This Location
            </span>

            <h2 className="mt-4 text-5xl font-bold leading-tight text-slate-900">
              Experience Comfortable Living
            </h2>

            <p className="mt-8 text-lg leading-9 text-slate-600">
              {location.description}
            </p>

            <div className="mt-10 space-y-5">

              {highlights.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-4"
                >
                  <CheckCircle2
                    size={24}
                    className="mt-1 text-green-500"
                  />

                  <p className="text-lg text-slate-700">
                    {item}
                  </p>
                </div>
              ))}

            </div>

          </motion.div>

          <motion.div
            initial={{
              opacity: 0,
              x: 40,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.6,
            }}
            className="grid gap-6 sm:grid-cols-2"
          >

            <InfoCard
              icon={Building2}
              title={location.city}
              description="Accommodation location in Lithuania."
            />

            <InfoCard
              icon={BedDouble}
              title={location.totalRooms}
              description="Total physical rooms at this location."
            />

            <InfoCard
              icon={Euro}
              title={formatRate(
                startingRate,
                config?.billingUnit
              )}
              description="Starting accommodation rate."
            />

            <InfoCard
              icon={MapPinned}
              title="Vilnius"
              description="Convenient access to nearby facilities."
            />

          </motion.div>

        </div>

      </div>
    </section>
  );
};

const InfoCard = ({
  icon: Icon,
  title,
  description,
}) => {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">

      <Icon
        size={38}
        className="text-blue-600"
      />

      <h3 className="mt-6 text-3xl font-bold text-slate-900">
        {title}
      </h3>

      <p className="mt-3 text-slate-600">
        {description}
      </p>

    </div>
  );
};

export default LocationOverview;