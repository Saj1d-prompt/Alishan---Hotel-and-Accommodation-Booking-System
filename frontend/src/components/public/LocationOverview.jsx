import { motion } from "framer-motion";
import {
  BedDouble,
  Building2,
  CheckCircle2,
  Euro,
  MapPin,
} from "lucide-react";

import {
  getStartingRate,
  getTermConfig,
} from "@/lib/accommodation";

const highlights = [
  "Fully furnished accommodation",
  "Comfortable and secure environment",
  "Excellent public transport connections",
  "High-speed Wi-Fi throughout the property",
];

const formatEuroAmount = (amount) => {
  const numericAmount = Number(amount);

  if (!Number.isFinite(numericAmount)) {
    return "Contact us";
  }

  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(numericAmount);
};

const InfoCard = ({
  icon: Icon,
  value,
  unit = null,
  description,
}) => {
  return (
    <article className="flex h-full min-h-[250px] min-w-0 flex-col rounded-3xl border border-slate-200 bg-slate-50 p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-8">
      <Icon
        aria-hidden="true"
        className="size-10 shrink-0 text-blue-600"
        strokeWidth={1.8}
      />

      <div className="mt-7 min-w-0">
        <p className="break-words text-3xl font-bold leading-tight tracking-tight text-slate-950">
          {value}
        </p>

        {unit ? (
          <p className="mt-2 text-base font-semibold leading-6 text-slate-700">
            {unit}
          </p>
        ) : null}

        <p className="mt-4 text-base leading-7 text-slate-600">
          {description}
        </p>
      </div>
    </article>
  );
};

const LocationOverview = ({
  location,
  selectedTerm,
}) => {
  const config = getTermConfig(
    location,
    selectedTerm
  );

  const startingRate = getStartingRate(
    location,
    selectedTerm
  );

  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
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
            className="min-w-0"
          >
            <span className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">
              About This Location
            </span>

            <h2 className="mt-6 max-w-2xl text-4xl font-bold leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Experience
              <span className="block">
                Comfortable Living
              </span>
            </h2>

            <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-600">
              {location.description}
            </p>

            <ul className="mt-10 space-y-5">
              {highlights.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-4 text-lg text-slate-700"
                >
                  <CheckCircle2
                    aria-hidden="true"
                    className="mt-0.5 size-6 shrink-0 text-emerald-500"
                  />

                  <span className="leading-7">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
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
            className="grid min-w-0 auto-rows-fr grid-cols-1 gap-6 sm:grid-cols-2"
          >
            <InfoCard
              icon={Building2}
              value={location.city}
              description="Accommodation location in Lithuania."
            />

            <InfoCard
              icon={BedDouble}
              value={location.totalRooms}
              description="Total physical rooms at this location."
            />

            <InfoCard
              icon={Euro}
              value={formatEuroAmount(
                startingRate
              )}
              unit={`Per person / ${
                config?.billingUnit ?? "month"
              }`}
              description="Starting accommodation rate."
            />

            <InfoCard
              icon={MapPin}
              value={location.city}
              description="Convenient access to the city and public transport."
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LocationOverview;