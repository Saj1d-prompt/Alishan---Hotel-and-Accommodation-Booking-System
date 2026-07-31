import { motion } from "framer-motion";

const SectionTitle = ({ badge, title, subtitle }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
        >
            {badge && (
                <span className="inline-block rounded-full bg-blue-100 px-4 py-1 text-sm font-medium text-blue-600">
                    {badge}
                </span>
            )}

            <h2 className="mt-4 text-4xl font-bold text-slate-900">
                {title}
            </h2>

            {subtitle && (
                <p className="mt-4 text-lg text-slate-600">
                    {subtitle}
                </p>
            )}
        </motion.div>
    );
};

export default SectionTitle;