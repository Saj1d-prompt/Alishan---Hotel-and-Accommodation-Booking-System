import { motion } from "framer-motion";
import { CalendarDays, Clock3 } from "lucide-react";

export default function WelcomeHero() {
  const now = new Date();

  const hour = now.getHours();

  const greeting =
    hour < 12
      ? "Good Morning"
      : hour < 18
      ? "Good Afternoon"
      : "Good Evening";

  const date = now.toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const time = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-violet-600 to-blue-500 p-8 text-white shadow-xl"
    >
      <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-3xl" />

      <div className="relative z-10">

        <h1 className="text-4xl font-bold">
          {greeting} 👋
        </h1>

        <p className="mt-2 text-indigo-100">
          Welcome back to Alishan Accommodation Management.
        </p>

        <div className="mt-8 flex flex-wrap gap-6 text-indigo-100">

          <div className="flex items-center gap-2">
            <CalendarDays size={18} />
            {date}
          </div>

          <div className="flex items-center gap-2">
            <Clock3 size={18} />
            {time}
          </div>

        </div>

      </div>
    </motion.div>
  );
}