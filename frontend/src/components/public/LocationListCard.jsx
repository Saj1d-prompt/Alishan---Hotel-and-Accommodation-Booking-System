import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  MapPin,
  BedDouble,
  ArrowRight,
  Wifi,
  CookingPot,
  WashingMachine,
  ShieldCheck,
} from "lucide-react";

const iconMap = {
  "High-Speed Wi-Fi": Wifi,
  "Wi-Fi": Wifi,
  Kitchen: CookingPot,
  "Shared Kitchen": CookingPot,
  Laundry: WashingMachine,
  Heating: ShieldCheck,
  Parking: ShieldCheck,
  Security: ShieldCheck,
};

const LocationListCard = ({ location }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4 }}
      className="group overflow-hidden rounded-3xl bg-white shadow-md transition-all duration-300 hover:shadow-2xl"
    >
      {/* Image */}

      <div className="relative overflow-hidden">
        <img
          src={location.image}
          alt={location.name}
          className="h-72 w-full object-cover transition duration-700 group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        <div className="absolute bottom-5 left-5">
          <span className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
            {location.city}
          </span>
        </div>
      </div>

      {/* Content */}

      <div className="p-7">

        <h2 className="text-3xl font-bold text-slate-900">
          {location.name}
        </h2>

        <div className="mt-3 flex items-center gap-2 text-slate-500">
          <MapPin size={18} />
          {location.city}
        </div>

        <p className="mt-5 line-clamp-3 leading-7 text-slate-600">
          {location.description}
        </p>

        {/* Amenities */}

        <div className="mt-6 flex flex-wrap gap-2">

          {location.amenities.map((item) => {
            const Icon = iconMap[item] || ShieldCheck;

            return (
              <div
                key={item}
                className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-sm"
              >
                <Icon
                  size={16}
                  className="text-blue-600"
                />

                {item}
              </div>
            );
          })}

        </div>

        {/* Bottom */}

        <div className="mt-8 flex items-center justify-between border-t pt-6">

          <div>

            <div className="flex items-center gap-2 text-slate-600">
              <BedDouble size={18} />

              {location.rooms} Rooms Available
            </div>

            <p className="mt-2 text-2xl font-bold text-blue-600">
              {location.price}
            </p>

          </div>

          <Link
            to={`/locations/${location.slug}`}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition-all duration-300 hover:bg-blue-700 hover:gap-3"
          >
            Explore

            <ArrowRight size={18} />
          </Link>

        </div>

      </div>
    </motion.div>
  );
};

export default LocationListCard;