import { motion } from "framer-motion";
import {
  Wifi,
  CookingPot,
  WashingMachine,
  ShieldCheck,
  ParkingCircle,
  Heater,
} from "lucide-react";

const amenityMap = {
  "High-Speed Wi-Fi": {
    icon: Wifi,
    title: "High-Speed Wi-Fi",
    desc: "Stay connected with fast and reliable internet throughout the property.",
    color: "from-sky-500 to-blue-600",
  },

  "Wi-Fi": {
    icon: Wifi,
    title: "Wi-Fi",
    desc: "Reliable internet access in all rooms and common areas.",
    color: "from-sky-500 to-blue-600",
  },

  Kitchen: {
    icon: CookingPot,
    title: "Shared Kitchen",
    desc: "Modern fully equipped kitchen available for all residents.",
    color: "from-orange-400 to-red-500",
  },

  "Shared Kitchen": {
    icon: CookingPot,
    title: "Shared Kitchen",
    desc: "Cook your favorite meals in a spacious shared kitchen.",
    color: "from-orange-400 to-red-500",
  },

  Laundry: {
    icon: WashingMachine,
    title: "Laundry",
    desc: "Convenient laundry facilities available on-site.",
    color: "from-green-400 to-emerald-600",
  },

  Heating: {
    icon: Heater,
    title: "Heating",
    desc: "Comfortable indoor temperatures throughout the year.",
    color: "from-yellow-400 to-orange-500",
  },

  Parking: {
    icon: ParkingCircle,
    title: "Parking",
    desc: "Secure parking spaces available for residents.",
    color: "from-indigo-400 to-purple-600",
  },

  Security: {
    icon: ShieldCheck,
    title: "24/7 Security",
    desc: "Safe and secure accommodation with monitored access.",
    color: "from-blue-500 to-cyan-500",
  },
};

const LocationAmenities = ({ location }) => {
  return (
    <section className="bg-white py-24">

      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        <div className="mx-auto mb-16 max-w-3xl text-center">

          <span className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">
            PREMIUM FACILITIES
          </span>

          <h2 className="mt-4 text-5xl font-bold text-slate-900">
            Everything You Need
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            Designed to provide a comfortable and enjoyable living experience
            with modern facilities and thoughtful amenities.
          </p>

        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">

          {location.amenities.map((item, index) => {

            const amenity = amenityMap[item];

            if (!amenity) return null;

            const Icon = amenity.icon;

            return (

              <motion.div
                key={item}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.1,
                }}
                whileHover={{
                  y: -10,
                }}
                className="group rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:border-blue-200 hover:shadow-2xl"
              >

                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r ${amenity.color} text-white transition duration-300 group-hover:scale-110 group-hover:rotate-6`}
                >
                  <Icon size={30} />
                </div>

                <h3 className="mt-8 text-2xl font-bold text-slate-900">
                  {amenity.title}
                </h3>

                <p className="mt-4 leading-7 text-slate-600">
                  {amenity.desc}
                </p>

              </motion.div>

            );

          })}

        </div>

      </div>

    </section>
  );
};

export default LocationAmenities;