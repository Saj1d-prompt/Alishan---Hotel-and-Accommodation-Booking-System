import { motion } from "framer-motion";
import {
  CheckCircle2,
  Building2,
  BedDouble,
  Euro,
  MapPinned,
} from "lucide-react";

const highlights = [
  "Fully furnished accommodation",
  "Comfortable and secure environment",
  "Excellent public transport connections",
  "High-speed Wi-Fi throughout the property",
];

const LocationOverview = ({ location }) => {
  return (
    <section className="bg-white py-24">

      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        <div className="grid items-center gap-20 lg:grid-cols-2">

          {/* Left Side */}

          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >

            <span className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">
              ABOUT THIS LOCATION
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

          {/* Right Side */}

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid gap-6 sm:grid-cols-2"
          >

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">

              <Building2
                size={38}
                className="text-blue-600"
              />

              <h3 className="mt-6 text-4xl font-bold text-slate-900">
                {location.city}
              </h3>

              <p className="mt-3 text-slate-600">
                Prime accommodation location in Lithuania.
              </p>

            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">

              <BedDouble
                size={38}
                className="text-blue-600"
              />

              <h3 className="mt-6 text-4xl font-bold text-slate-900">
                {location.rooms}
              </h3>

              <p className="mt-3 text-slate-600">
                Available fully furnished rooms.
              </p>

            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">

              <Euro
                size={38}
                className="text-blue-600"
              />

              <h3 className="mt-6 text-3xl font-bold text-slate-900">
                {location.price}
              </h3>

              <p className="mt-3 text-slate-600">
                Affordable monthly accommodation.
              </p>

            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">

              <MapPinned
                size={38}
                className="text-blue-600"
              />

              <h3 className="mt-6 text-3xl font-bold text-slate-900">
                Excellent
              </h3>

              <p className="mt-3 text-slate-600">
                Public transport & nearby facilities.
              </p>

            </div>

          </motion.div>

        </div>

      </div>

    </section>
  );
};

export default LocationOverview;