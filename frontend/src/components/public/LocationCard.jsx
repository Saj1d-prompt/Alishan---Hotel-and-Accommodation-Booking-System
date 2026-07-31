import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MapPin, BedDouble, ArrowRight } from "lucide-react";

const LocationCard = ({ location }) => {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.25 }}
      className="group overflow-hidden rounded-3xl bg-white shadow-lg"
    >
      <div className="overflow-hidden">
        <img
          src={location.image}
          alt={location.name}
          className="h-72 w-full object-cover transition duration-500 group-hover:scale-110"
        />
      </div>

      <div className="space-y-4 p-6">

        <div>

          <h3 className="text-2xl font-bold">
            {location.name}
          </h3>

          <div className="mt-2 flex items-center gap-2 text-gray-500">
            <MapPin size={18} />
            {location.city}
          </div>

        </div>

        <div className="flex items-center justify-between">

          <div>

            <p className="text-lg font-bold text-blue-600">
              {location.price}
            </p>

            <div className="mt-1 flex items-center gap-2 text-gray-500">

              <BedDouble size={18} />

              {location.rooms} Rooms

            </div>

          </div>

        </div>

        <Link
          to={`/properties/${location.slug}`}
          className="inline-flex items-center gap-2 font-semibold text-blue-600 transition hover:gap-3"
        >
          View Property

          <ArrowRight size={18} />

        </Link>

      </div>
    </motion.div>
  );
};

export default LocationCard;