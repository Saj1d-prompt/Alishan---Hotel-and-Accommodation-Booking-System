import { motion } from "framer-motion";

export default function Logo({ collapsed = false }) {
  return (
    <div className="flex h-16 items-center justify-center border-b border-slate-200">
      <motion.div
        layout
        className="flex items-center gap-3"
        transition={{ duration: 0.25 }}
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 via-violet-600 to-blue-500 text-lg font-bold text-white shadow-md">
          A
        </div>

        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className="text-xl font-bold tracking-tight text-slate-800"
          >
            Alishan
          </motion.span>
        )}
      </motion.div>
    </div>
  );
}