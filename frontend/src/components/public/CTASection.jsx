import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
} from "lucide-react";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="relative overflow-hidden pb-16 pt-20">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-sky-600 to-cyan-500" />

      <div className="absolute -left-24 top-0 h-80 w-80 rounded-full bg-white/10 blur-3xl" />

      <div className="absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-white/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{
            opacity: 0,
            y: 40,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.7,
          }}
          className="mx-auto max-w-4xl text-center"
        >
          <span className="rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-medium uppercase tracking-[0.3em] text-white backdrop-blur">
            Ready to move in?
          </span>

          <h2 className="mt-8 text-4xl font-bold leading-tight text-white lg:text-6xl">
            Find Your Accommodation
            <br />
            in Vilnius
          </h2>

          <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-blue-100">
            Compare the available locations, choose
            your accommodation term and select a room
            type before submitting a booking request.
          </p>

          <div className="mt-12 flex flex-col justify-center gap-5 sm:flex-row">
            <Link
              to="/locations"
              className="inline-flex items-center justify-center gap-3 rounded-2xl bg-white px-8 py-4 text-lg font-semibold text-blue-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
            >
              Explore Locations
              <ArrowRight size={20} />
            </Link>

            <Link
              to="/locations"
              className="inline-flex items-center justify-center gap-3 rounded-2xl border border-white/30 bg-white/10 px-8 py-4 text-lg font-semibold text-white backdrop-blur transition-all duration-300 hover:bg-white/20"
            >
              <CalendarDays size={20} />
              Start Booking
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;