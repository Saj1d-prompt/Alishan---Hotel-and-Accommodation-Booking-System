import { motion } from "framer-motion";

import Container from "./Container";
import SearchCard from "./SearchCard";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen overflow-hidden pt-20">
      {/* Background */}
      <img
        src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267"
        alt="Accommodation"
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-slate-900/70" />

      <Container
        className="
          relative z-10
          flex
          min-h-[calc(100svh-5rem)]
          flex-col
          justify-start
          py-10
          sm:py-14
          lg:justify-center
          lg:py-16
        "
      >
        <motion.div
          initial={{
            opacity: 0,
            y: 40,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
          }}
          className="min-w-0 max-w-3xl"
        >
          <h1
            className="
              max-w-full
              break-words
              text-4xl
              font-bold
              leading-[1.08]
              text-white
              sm:text-5xl
              md:text-6xl
              lg:text-7xl
            "
          >
            Find Your Perfect Accommodation in Lithuania
          </h1>

          <p
            className="
              mt-6
              max-w-2xl
              text-base
              leading-7
              text-slate-200
              sm:text-lg
            "
          >
            Comfortable, affordable, and secure accommodation
            for students, workers, and families.
          </p>
        </motion.div>

        <SearchCard />
      </Container>
    </section>
  );
};

export default HeroSection;