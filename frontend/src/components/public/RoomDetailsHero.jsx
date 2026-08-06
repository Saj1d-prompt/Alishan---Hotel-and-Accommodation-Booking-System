import {
  ArrowRight,
  BedDouble,
  Users,
} from "lucide-react";

const RoomDetailsHero = ({
  room,
  isAvailable = false,
}) => {
  return (
    <section className="relative min-h-[650px] overflow-hidden">
      <img
        src={room.image}
        alt={room.title}
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-black/55" />

      <div className="relative mx-auto flex min-h-[650px] max-w-7xl items-center px-6 lg:px-8">
        <div className="max-w-3xl">
          <span className="rounded-full bg-blue-600 px-4 py-2 text-white">
            {room.subtitle}
          </span>

          <h1 className="mt-6 text-5xl font-bold text-white md:text-6xl">
            {room.title}
          </h1>

          <div className="mt-6 flex flex-wrap gap-6 text-white">
            <div className="flex items-center gap-2">
              <Users size={20} />

              Up to{" "}
              {room.capacity}{" "}
              {room.capacity === 1
                ? "person"
                : "people"}
            </div>

            <div className="flex items-center gap-2">
              <BedDouble size={20} />

              {room.beds}{" "}
              {room.beds === 1
                ? "bed"
                : "beds"}
            </div>
          </div>

          <div className="mt-8">
            {isAvailable ? (
              <span className="inline-flex rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-lg">
                Currently Available
              </span>
            ) : (
              <span className="inline-flex rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-white shadow-lg">
                Availability Limited / Unavailable
              </span>
            )}
          </div>

          <a
            href="#booking-summary"
            className="mt-10 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 font-semibold text-slate-900 transition hover:gap-3 hover:bg-slate-100"
          >
            Check Live Availability
            <ArrowRight size={18} />
          </a>
        </div>
      </div>
    </section>
  );
};

export default RoomDetailsHero;