import { motion } from "framer-motion";
import {
  GraduationCap,
  Bus,
  ShoppingBag,
  Hospital,
  UtensilsCrossed,
  Dumbbell,
  ArrowRight,
} from "lucide-react";

const places = [
  {
    title: "University",
    distance: "800 m",
    icon: GraduationCap,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Bus Stop",
    distance: "200 m",
    icon: Bus,
    color: "bg-green-100 text-green-600",
  },
  {
    title: "Shopping Centre",
    distance: "1.2 km",
    icon: ShoppingBag,
    color: "bg-orange-100 text-orange-600",
  },
  {
    title: "Hospital",
    distance: "2 km",
    icon: Hospital,
    color: "bg-red-100 text-red-600",
  },
  {
    title: "Restaurant",
    distance: "350 m",
    icon: UtensilsCrossed,
    color: "bg-yellow-100 text-yellow-600",
  },
  {
    title: "Gym",
    distance: "500 m",
    icon: Dumbbell,
    color: "bg-purple-100 text-purple-600",
  },
];

const NearbyPlaces = () => {
  return (
    <section className="bg-white py-24">

      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        <div className="mx-auto mb-16 max-w-3xl text-center">

          <span className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">
            CONVENIENT LOCATION
          </span>

          <h2 className="mt-4 text-5xl font-bold text-slate-900">
            Everything Close By
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            Our accommodation is located close to essential services,
            public transport and educational institutions.
          </p>

        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

          {places.map((place, index) => {

            const Icon = place.icon;

            return (

              <motion.div
                key={place.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.1,
                }}
                whileHover={{
                  y: -8,
                }}
                className="group rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:border-blue-300 hover:shadow-2xl cursor-pointer"
              >

                <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${place.color}`}>

                  <Icon size={30} />

                </div>

                <h3 className="mt-6 text-2xl font-bold text-slate-900">

                  {place.title}

                </h3>

                <p className="mt-2 text-slate-500">

                  {place.distance} away

                </p>

                <div className="mt-8 flex items-center gap-2 font-semibold text-blue-600 transition-all group-hover:gap-3">

                  Learn More

                  <ArrowRight size={18} />

                </div>

              </motion.div>

            );

          })}

        </div>

      </div>

    </section>
  );
};

export default NearbyPlaces;