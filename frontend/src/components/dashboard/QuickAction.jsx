import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

export default function QuickAction({
  title,
  description,
  icon: Icon,
  color = "bg-indigo-600",
  onClick,
}) {
  return (
    <motion.button
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-center gap-4">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl text-white ${color}`}
        >
          <Icon size={22} />
        </div>

        <div>
          <h3 className="font-semibold text-slate-900">
            {title}
          </h3>

          <p className="text-sm text-slate-500">
            {description}
          </p>
        </div>
      </div>

      <ChevronRight className="text-slate-400" size={20} />
    </motion.button>
  );
}