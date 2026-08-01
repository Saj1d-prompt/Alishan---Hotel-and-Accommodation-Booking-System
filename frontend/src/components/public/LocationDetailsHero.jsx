import { motion } from "framer-motion";
import {
  MapPin,
  BedDouble,
  Euro,
  ArrowRight,
  Star,
} from "lucide-react";

const LocationDetailsHero = ({ location }) => {
  return (
    <section className="relative h-[75vh] min-h-[650px] overflow-hidden">

      {/* Background */}

      <img
        src={location.image}
        alt={location.name}
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/25" />

      {/* Content */}

      <div className="relative mx-auto flex h-full max-w-7xl items-center px-6 lg:px-8">

        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >

          <span className="inline-flex items-center rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-white">
            ALISHAN ACCOMMODATION
          </span>

          <h1 className="mt-6 text-5xl font-bold leading-tight text-white lg:text-7xl">
            {location.name}
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-6 text-white">

            <div className="flex items-center gap-2">
              <MapPin size={20} />
              <span>{location.city}</span>
            </div>

            <div className="flex items-center gap-2">
              <BedDouble size={20} />
              <span>{location.rooms} Rooms</span>
            </div>

            <div className="flex items-center gap-2">
              <Star
                size={20}
                className="fill-yellow-400 text-yellow-400"
              />
              <span>4.9 Rating</span>
            </div>

          </div>

          <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-200">
            {location.description}
          </p>

          <div className="mt-10 flex flex-wrap gap-4">

            <button
              className="
              inline-flex
              items-center
              gap-2
              rounded-xl
              bg-blue-600
              px-8
              py-4
              font-semibold
              text-white
              transition-all
              duration-300
              hover:bg-blue-700
              hover:gap-3
              hover:shadow-xl
              active:scale-95
              "
            >
              View Rooms

              <ArrowRight size={18} />
            </button>

            <button
              className="
              rounded-xl
              border
              border-white/30
              bg-white/10
              px-8
              py-4
              font-semibold
              text-white
              backdrop-blur-md
              transition
              hover:bg-white
              hover:text-slate-900
              "
            >
              Contact Us
            </button>

          </div>

        </motion.div>

        {/* Floating Info Card */}

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="ml-auto hidden w-[340px] rounded-3xl border border-white/20 bg-white/10 p-8 text-white backdrop-blur-xl lg:block"
        >

          <h3 className="text-2xl font-bold">
            Starting From
          </h3>

          <div className="mt-5 flex items-center gap-2">

            <Euro size={30} />

            <span className="text-5xl font-bold">
              {location.price.replace("From €", "").replace("/month", "")}
            </span>

          </div>

          <p className="mt-2 text-slate-200">
            Per Month
          </p>

          <div className="my-8 border-t border-white/20" />

          <div className="space-y-5">

            <div className="flex justify-between">
              <span>Available Rooms</span>
              <strong>{location.rooms}</strong>
            </div>

            <div className="flex justify-between">
              <span>Location</span>
              <strong>{location.city}</strong>
            </div>

            <div className="flex justify-between">
              <span>Availability</span>
              <strong className="text-green-400">
                Available
              </strong>
            </div>

          </div>

        </motion.div>

      </div>

    </section>
  );
};

export default LocationDetailsHero;