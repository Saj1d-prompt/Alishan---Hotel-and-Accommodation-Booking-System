import { motion } from "framer-motion";
import {
  ArrowRight,
  BedDouble,
  CheckCircle2,
  Users,
} from "lucide-react";
import {
  Link,
  useSearchParams,
} from "react-router-dom";

import roomTypes from "@/data/roomTypes";

import {
  getRoomRate,
  getTermConfig,
  getTermLabel,
  getUtilitiesLabel,
} from "@/lib/accommodation";

const RoomTypes = ({
  location,
  selectedTerm,
}) => {
  const [searchParams] = useSearchParams();

  const termConfig = getTermConfig(
    location,
    selectedTerm
  );

  if (!termConfig) {
    return null;
  }

  const requestedOccupants = Number(
    searchParams.get("occupants")
  );

  const occupantCount =
    Number.isInteger(requestedOccupants) &&
    requestedOccupants > 0
      ? requestedOccupants
      : null;

  const availableRoomTypes = roomTypes.filter(
    (room) => {
      const hasRate =
        getRoomRate(
          location,
          selectedTerm,
          room.capacity
        ) !== null;

      const fitsOccupants =
        occupantCount === null ||
        room.capacity >= occupantCount;

      return hasRate && fitsOccupants;
    }
  );

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
            Choose Your Room Type
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            Showing{" "}
            {getTermLabel(
              selectedTerm
            ).toLowerCase()}{" "}
            room types for {location.name}
            {occupantCount
              ? ` that can accommodate ${occupantCount} ${
                  occupantCount === 1
                    ? "person"
                    : "people"
                }.`
              : "."}
          </p>
        </div>

        {availableRoomTypes.length > 0 ? (
          <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
            {availableRoomTypes.map(
              (room, index) => {
                const rate = getRoomRate(
                  location,
                  selectedTerm,
                  room.capacity
                );

                const roomUrlParams =
                  new URLSearchParams(
                    searchParams
                  );

                roomUrlParams.set(
                  "location",
                  location.slug
                );

                roomUrlParams.set(
                  "term",
                  selectedTerm
                );

                const roomUrl =
                  `/rooms/${room.slug}` +
                  `?${roomUrlParams.toString()}`;

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

                      <div className="absolute bottom-5 left-5 rounded-2xl bg-white/95 px-4 py-3 shadow-sm">
                        <p className="text-xl font-bold text-slate-950">
                          €{rate}
                        </p>

                        <p className="text-xs font-semibold text-slate-600">
                          Per person /{" "}
                          {
                            termConfig.billingUnit
                          }
                        </p>
                      </div>
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
                          : "people"}
                      </div>

                      {utilitiesLabel ? (
                        <p className="mt-4 text-sm font-medium text-slate-500">
                          {utilitiesLabel}
                        </p>
                      ) : null}

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
        ) : (
          <div className="mx-auto mt-14 max-w-2xl rounded-3xl border border-amber-200 bg-amber-50 p-8 text-center">
            <h3 className="text-xl font-bold text-amber-950">
              No matching room type
            </h3>

            <p className="mt-3 leading-7 text-amber-800">
              Reduce the occupant count or choose
              another location. Physical room
              availability will be confirmed during
              Admin review.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default RoomTypes;