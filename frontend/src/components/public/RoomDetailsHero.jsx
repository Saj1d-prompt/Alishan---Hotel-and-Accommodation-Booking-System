import {
  ArrowRight,
  BedDouble,
  ImageOff,
  Users,
} from "lucide-react";

const RoomDetailsHero = ({
  room,
}) => {
  return (
    <section className="relative h-[70vh] min-h-[560px] overflow-hidden bg-slate-900">
      {room?.image ? (
        <img
          src={
            room.image
          }
          alt={
            room.title
          }
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
          <div className="text-center text-slate-400">
            <ImageOff className="mx-auto size-14" />

            <p className="mt-4">
              Room photo
              coming soon
            </p>
          </div>
        </div>
      )}

      <div className="absolute inset-0 bg-black/55" />

      <div className="relative mx-auto flex h-full max-w-7xl items-center px-6 lg:px-8">
        <div className="max-w-3xl">
          <span className="rounded-full bg-blue-600 px-4 py-2 text-white">
            {
              room.subtitle
            }
          </span>

          <h1 className="mt-6 text-5xl font-bold text-white sm:text-6xl">
            {
              room.title
            }
          </h1>

          <div className="mt-6 flex flex-wrap gap-6 text-white">
            <div className="flex items-center gap-2">
              <Users
                size={20}
              />

              Up to{" "}
              {
                room.capacity
              }{" "}
              {room.capacity
              === 1
                ? "occupant"
                : "occupants"}
            </div>

            <div className="flex items-center gap-2">
              <BedDouble
                size={20}
              />

              {
                room.beds
              }{" "}
              {room.beds
              === 1
                ? "bed"
                : "beds"}
            </div>
          </div>

          <a
            href="#booking-summary"
            className="mt-10 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-4 font-semibold text-white transition hover:gap-3 hover:bg-blue-700"
          >
            View Price and Book

            <ArrowRight
              size={18}
            />
          </a>
        </div>
      </div>
    </section>
  );
};

export default RoomDetailsHero;