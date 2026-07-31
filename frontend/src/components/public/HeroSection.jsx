import { motion } from "framer-motion";
import Container from "./Container";
import SearchCard from "./SearchCard";

const HeroSection = () => {
    return (
        <section className="relative min-h-screen overflow-hidden">

            {/* Background */}
            <img
                src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267"
                alt="Accommodation"
                className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-slate-900/70" />

            <Container className="relative z-10 flex min-h-screen flex-col justify-center">

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-3xl"
                >
                    <h1 className="mt-6 text-5xl font-bold leading-tight text-white md:text-7xl">
                        Find Your Perfect Accommodation in Lithuania
                    </h1>

                    <p className="mt-6 max-w-2xl text-lg text-slate-200">
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