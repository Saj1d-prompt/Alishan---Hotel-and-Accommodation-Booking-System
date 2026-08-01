import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const RoomOverview = ({ room }) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="rounded-3xl bg-white p-10 shadow-sm"
    >
      <span className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">
        ABOUT THE ROOM
      </span>

      <h2 className="mt-4 text-4xl font-bold">
        Comfortable Living Experience
      </h2>

      <p className="mt-8 leading-8 text-slate-600">
        {room.description}
      </p>

      <div className="mt-10 grid gap-5 md:grid-cols-2">

        {room.amenities.map(item => (

          <div
            key={item}
            className="flex items-center gap-3"
          >

            <CheckCircle2
              className="text-green-500"
              size={22}
            />

            {item}

          </div>

        ))}

      </div>

    </motion.section>
  );
};

export default RoomOverview;