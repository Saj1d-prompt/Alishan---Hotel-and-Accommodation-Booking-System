import { motion } from "framer-motion";

import Container from "./Container";
import SectionTitle from "./SectionTitle";
import ExperienceSlider from "./ExperienceSlider";

const ExperienceSection = () => {
  return (
    <section className="bg-slate-50 py-24">

      <Container>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <SectionTitle
            badge="EXPERIENCE ALISHAN"
            title="Take a Look Inside Your Future Home"
            subtitle="Explore our accommodation through real photos of our rooms, shared spaces, and facilities."
          />
        </motion.div>

        <div className="mt-16">
          <ExperienceSlider />
        </div>

      </Container>

    </section>
  );
};

export default ExperienceSection;