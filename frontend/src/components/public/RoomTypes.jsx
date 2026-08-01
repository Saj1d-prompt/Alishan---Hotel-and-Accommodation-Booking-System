import { motion } from "framer-motion";
import {
  Wifi,
  Tv,
  Bath,
  Users,
  ArrowRight,
  BedDouble,
} from "lucide-react";

const roomTypes = [
  {
    id: 1,
    title: "Single Room",
    image: "/images/rooms/single.jpg",
    guests: 1,
    price: "From €250/month",
    features: ["Private Bed", "Wi-Fi", "Bathroom", "Study Desk"],
  },
  {
    id: 2,
    title: "Double Room",
    image: "/images/rooms/double.jpg",
    guests: 2,
    price: "From €320/month",
    features: ["Double Bed", "Wi-Fi", "Bathroom", "Wardrobe"],
  },
  {
    id: 3,
    title: "Shared Room",
    image: "/images/rooms/shared.jpg",
    guests: 4,
    price: "From €180/month",
    features: ["Shared Kitchen", "Wi-Fi", "Laundry", "Heating"],
  },
];

const featureIcon = (feature) => {
  if (feature.includes("Wi-Fi")) return <Wifi size={16} />;
  if (feature.includes("Bathroom")) return <Bath size={16} />;
  if (feature.includes("Bed")) return <BedDouble size={16} />;
  return <Tv size={16} />;
};

const RoomTypes = () => {
  return (
    <section className="bg-slate-50 py-24">

      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        <div className="mx-auto max-w-3xl text-center">

          <span className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">
            ROOM OPTIONS
          </span>

          <h2 className="mt-4 text-5xl font-bold text-slate-900">
            Choose Your Room
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            Every room is fully furnished and designed for a comfortable
            stay. Select the room that best suits your lifestyle.
          </p>

        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">

          {roomTypes.map((room, index) => (

            <motion.div
              key={room.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.15,
              }}
              whileHover={{
                y: -10,
              }}
              className="group overflow-hidden rounded-3xl bg-white shadow-lg transition-all duration-300 hover:shadow-2xl"
            >

              {/* Image */}

              <div className="relative overflow-hidden">

                <img
                  src={room.image}
                  alt={room.title}
                  className="h-64 w-full object-cover transition duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                <div className="absolute bottom-5 left-5">

                  <span className="rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-slate-900">
                    {room.price}
                  </span>

                </div>

              </div>

              {/* Content */}

              <div className="p-8">

                <div className="flex items-center justify-between">

                  <h3 className="text-3xl font-bold text-slate-900">
                    {room.title}
                  </h3>

                  <div className="flex items-center gap-1 rounded-full bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-600">

                    <Users size={16} />

                    {room.guests}

                  </div>

                </div>

                <div className="mt-8 space-y-4">

                  {room.features.map((feature) => (

                    <div
                      key={feature}
                      className="flex items-center gap-3"
                    >

                      <div className="rounded-lg bg-blue-100 p-2 text-blue-600">

                        {featureIcon(feature)}

                      </div>

                      <span className="text-slate-700">
                        {feature}
                      </span>

                    </div>

                  ))}

                </div>

                <button
                  className="
                  mt-10
                  inline-flex
                  items-center
                  gap-2
                  rounded-xl
                  bg-blue-600
                  px-6
                  py-3
                  font-semibold
                  text-white
                  transition-all
                  duration-300
                  hover:bg-blue-700
                  hover:gap-3
                  hover:shadow-lg
                  active:scale-95
                  "
                >

                  View Rooms

                  <ArrowRight size={18} />

                </button>

              </div>

            </motion.div>

          ))}

        </div>

      </div>

    </section>
  );
};

export default RoomTypes;