import { motion } from "framer-motion";
import {
  ArrowRight,
  BedDouble,
  MapPin,
} from "lucide-react";
import { Link } from "react-router-dom";

import {
  getStartingRate,
  getTermConfig,
} from "@/lib/accommodation";

const LocationCard = ({ location }) => {
  const defaultTerm = location.defaultTerm;

  const termConfig = getTermConfig(
    location,
    defaultTerm
  );

  const startingRate = getStartingRate(
    location,
    defaultTerm
  );

  const locationUrl =
    `/locations/${location.slug}` +
    `?term=${encodeURIComponent(
      defaultTerm
    )}`;

  return (
    <motion.article
      whileHover={{
        y: -8,
      }}
      transition={{
        duration: 0.25,
      }}
      className="group overflow-hidden rounded-3xl bg-white shadow-lg"
    >
      <div className="overflow-hidden">
        <img
          src={location.image}
          alt={location.name}
          className="h-72 w-full object-cover transition duration-500 group-hover:scale-110"
        />
      </div>

      <div className="space-y-5 p-6">
        <div>
          <h3 className="text-2xl font-bold text-slate-900">
            {location.name}
          </h3>

          <div className="mt-2 flex items-center gap-2 text-slate-500">
            <MapPin size={18} />
            {location.city}
          </div>
        </div>

        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-2xl font-bold text-blue-600">
              €{startingRate}
            </p>

            <p className="mt-1 text-sm font-medium text-slate-500">
              Per person /{" "}
              {termConfig?.billingUnit}
            </p>
          </div>

          <div className="flex items-center gap-2 text-slate-500">
            <BedDouble size={18} />
            {location.totalRooms} rooms
          </div>
        </div>

        <Link
          to={locationUrl}
          className="inline-flex items-center gap-2 font-semibold text-blue-600 transition hover:gap-3"
        >
          View Location
          <ArrowRight size={18} />
        </Link>
      </div>
    </motion.article>
  );
};

export default LocationCard;