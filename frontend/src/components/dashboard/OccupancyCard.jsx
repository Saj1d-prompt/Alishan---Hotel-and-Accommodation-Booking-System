import { BedDouble, Users } from "lucide-react";
import { motion } from "framer-motion";

export default function OccupancyCard() {
  const occupied = 78;
  const total = 100;
  const available = total - occupied;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="flex items-center justify-between">

        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Occupancy Rate
          </h2>

          <p className="text-sm text-slate-500">
            Current room usage
          </p>
        </div>

        <BedDouble className="text-indigo-600" size={30} />

      </div>

      <div className="mt-8 flex justify-center">

        <div className="relative flex h-44 w-44 items-center justify-center">

          <svg className="-rotate-90 h-44 w-44">

            <circle
              cx="88"
              cy="88"
              r="70"
              stroke="#e5e7eb"
              strokeWidth="12"
              fill="none"
            />

            <circle
              cx="88"
              cy="88"
              r="70"
              stroke="#4f46e5"
              strokeWidth="12"
              fill="none"
              strokeDasharray={440}
              strokeDashoffset={440 - (440 * occupied) / 100}
              strokeLinecap="round"
            />

          </svg>

          <div className="absolute text-center">

            <h2 className="text-5xl font-bold">
              {occupied}%
            </h2>

            <p className="text-slate-500">
              Occupied
            </p>

          </div>

        </div>

      </div>

      <div className="mt-8 grid grid-cols-2 gap-4">

        <div className="rounded-2xl bg-slate-100 p-4">

          <div className="flex items-center gap-2">
            <Users size={18} />
            <span className="text-sm text-slate-600">
              Occupied
            </span>
          </div>

          <h3 className="mt-2 text-2xl font-bold">
            {occupied}
          </h3>

        </div>

        <div className="rounded-2xl bg-slate-100 p-4">

          <div className="flex items-center gap-2">
            <BedDouble size={18} />
            <span className="text-sm text-slate-600">
              Available
            </span>
          </div>

          <h3 className="mt-2 text-2xl font-bold">
            {available}
          </h3>

        </div>

      </div>

    </motion.div>
  );
}