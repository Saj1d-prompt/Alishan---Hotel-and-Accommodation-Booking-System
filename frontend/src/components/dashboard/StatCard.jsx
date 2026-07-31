import { motion } from "framer-motion";

export default function StatCard({
    title,
    value,
    icon: Icon,
    color = "from-indigo-600 to-violet-600",
}) {
    return (
        <motion.div
            whileHover={{
                y: -4,
                scale: 1.02,
            }}
            transition={{
                duration: 0.2,
            }}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-slate-500">
                        {title}
                    </p>

                    <h2 className="mt-2 text-3xl font-bold text-slate-800">
                        {value}
                    </h2>
                </div>

                <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${color} text-white`}
                >
                    <Icon size={22} />
                </div>
            </div>
        </motion.div>
    );
}