import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  BedDouble,
  Users,
  Maximize,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

const RoomCard = ({ room }) => {
  return (
    <motion.article
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="group overflow-hidden rounded-3xl bg-white shadow-md transition-all duration-300 hover:shadow-2xl"
    >
      {/* Image */}

      <div className="relative overflow-hidden">

        <img
          src={room.image}
          alt={room.title}
          className="h-72 w-full object-cover transition duration-700 group-hover:scale-110"
        />

        {/* Overlay */}

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        {/* Price */}

        <div className="absolute left-5 top-5 rounded-full bg-white px-4 py-2 shadow">

          <span className="font-bold text-blue-600">

            {room.price}

          </span>

        </div>

        {/* Availability */}

        <div className="absolute right-5 top-5 rounded-full bg-green-600 px-4 py-2 text-sm font-semibold text-white">

          {room.available} Available

        </div>

      </div>

      {/* Content */}

      <div className="p-7">

        <div className="flex items-center justify-between">

          <div>

            <h3 className="text-2xl font-bold text-slate-900">

              {room.title}

            </h3>

            <p className="mt-1 text-slate-500">

              {room.subtitle}

            </p>

          </div>

          <div className="rounded-2xl bg-blue-50 p-3 text-blue-600">

            <BedDouble size={28} />

          </div>

        </div>

        {/* Stats */}

        <div className="mt-8 grid grid-cols-2 gap-4">

          <div className="rounded-2xl bg-slate-50 p-4">

            <div className="flex items-center gap-2 text-slate-500">

              <Users size={18} />

              Capacity

            </div>

            <h4 className="mt-2 text-xl font-bold">

              {room.capacity} Guest

            </h4>

          </div>

          <div className="rounded-2xl bg-slate-50 p-4">

            <div className="flex items-center gap-2 text-slate-500">

              <Maximize size={18} />

              Size

            </div>

            <h4 className="mt-2 text-xl font-bold">

              {room.size}

            </h4>

          </div>

        </div>

        {/* Amenities */}

        <div className="mt-8">

          <h5 className="mb-4 font-semibold text-slate-900">

            Included

          </h5>

          <div className="space-y-3">

            {room.amenities.slice(0, 4).map((item) => (

              <div
                key={item}
                className="flex items-center gap-3"
              >

                <CheckCircle2
                  size={18}
                  className="text-green-500"
                />

                <span className="text-slate-600">

                  {item}

                </span>

              </div>

            ))}

          </div>

        </div>

        {/* Button */}

        <Link
          to={`/rooms/${room.slug}`}
          className="
          mt-10
          flex
          items-center
          justify-center
          gap-2
          rounded-2xl
          bg-blue-600
          px-6
          py-4
          font-semibold
          text-white
          transition-all
          duration-300
          hover:bg-blue-700
          hover:gap-3
          hover:shadow-lg
          "
        >

          View Details

          <ArrowRight size={18} />

        </Link>

      </div>

    </motion.article>
  );
};

export default RoomCard;