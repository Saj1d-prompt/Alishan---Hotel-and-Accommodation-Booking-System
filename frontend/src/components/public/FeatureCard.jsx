import { motion } from "framer-motion";

const FeatureCard = ({
  icon: Icon,
  title,
  description,
}) => {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.25 }}
      className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:shadow-xl"
    >
      <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
        <Icon className="h-7 w-7 text-blue-600" />
      </div>

      <h3 className="mb-3 text-xl font-bold text-slate-900">
        {title}
      </h3>

      <p className="leading-7 text-slate-600">
        {description}
      </p>
    </motion.div>
  );
};

export default FeatureCard;