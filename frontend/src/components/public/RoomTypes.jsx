import { motion } from "framer-motion";
import {
  ArrowRight,
  BedDouble,
  CheckCircle2,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

import roomTypes from "@/data/roomTypes";

import {
  formatRate,
  getRoomRate,
  getTermConfig,
  getTermLabel,
  getUtilitiesLabel,
} from "@/lib/accommodation";

const RoomTypes = ({
  location,
  selectedTerm,
}) => {
  const termConfig = getTermConfig(
    location,
    selectedTerm
  );

  if (!termConfig) {
    return null;
  }

  const availableRoomTypes =
    roomTypes.filter((room) => {
      return (
        getRoomRate(
          location,
          selectedTerm,
          room.capacity
        ) !== null
      );
    });

  const utilitiesLabel =
    getUtilitiesLabel(
      termConfig.utilitiesIncluded
    );

  return (
    <section
      id="room-types"
      className="scroll-mt-24 bg-slate-50 py-24"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        <div className="mx-auto max-w-3xl text-center">

          <span className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">
            Room Options
          </span>

          <h2 className="mt-4 text-4xl font-bold text-slate-900 md:text-5xl">
            Choose Your Room
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            Showing{" "}
            {getTermLabel(
              selectedTerm
            ).toLowerCase()}{" "}
            accommodation options for{" "}
            {location.name}.
          </p>

        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-4">

          {availableRoomTypes.map(
            (room, index) => {
              const rate =
                getRoomRate(
                  location,
                  selectedTerm,
                  room.capacity
                );

              const roomUrl =
                `/rooms/${room.slug}` +
                `?location=${encodeURIComponent(
                  location.slug
                )}` +
                `&term=${encodeURIComponent(
                  selectedTerm
                )}`;

              return (
                <motion.article
                  key={room.id}
                  initial={{
                    opacity: 0,
                    y: 30,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.2,
                  }}
                  transition={{
                    duration: 0.45,
                    delay: index * 0.08,
                  }}
                  whileHover={{
                    y: -6,
                  }}
                  className="group overflow-hidden rounded-3xl bg-white shadow-md transition-shadow duration-300 hover:shadow-xl"
                >

                  <div className="relative overflow-hidden">

                    <img
                      src={room.image}
                      alt={room.title}
                      className="h-56 w-full object-cover transition duration-700 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                    <span className="absolute bottom-5 left-5 rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-slate-900">
                      {formatRate(
                        rate,
                        termConfig.billingUnit
                      )}
                    </span>

                  </div>

                  <div className="p-6">

                    <div className="flex items-start justify-between gap-4">

                      <div>
                        <h3 className="text-2xl font-bold text-slate-900">
                          {room.title}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          {room.subtitle}
                        </p>
                      </div>

                      <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                        <BedDouble size={24} />
                      </div>

                    </div>

                    <div className="mt-6 flex items-center gap-2 text-sm text-slate-600">
                      <Users
                        size={18}
                        className="text-blue-600"
                      />

                      Up to {room.capacity}{" "}
                      {room.capacity === 1
                        ? "person"
                        : "persons"}
                    </div>

                    {utilitiesLabel && (
                      <p className="mt-4 text-sm font-medium text-slate-500">
                        {utilitiesLabel}
                      </p>
                    )}

                    <div className="mt-6 space-y-3">

                      {room.amenities
                        .slice(0, 4)
                        .map((amenity) => (
                          <div
                            key={amenity}
                            className="flex items-center gap-3 text-sm text-slate-600"
                          >
                            <CheckCircle2
                              size={17}
                              className="shrink-0 text-green-500"
                            />

                            <span>
                              {amenity}
                            </span>
                          </div>
                        ))}

                    </div>

                    <Link
                      to={roomUrl}
                      className="mt-8 flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
                    >
                      View Details

                      <ArrowRight size={18} />
                    </Link>

                  </div>

                </motion.article>
              );
            }
          )}

        </div>

      </div>
    </section>
  );
};

export default RoomTypes;