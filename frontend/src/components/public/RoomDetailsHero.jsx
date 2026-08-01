import { Users, BedDouble, ArrowRight } from "lucide-react";

const RoomDetailsHero = ({ room }) => {
    return (
        <section className="relative h-[70vh] overflow-hidden">

            <img
                src={room.image}
                alt={room.title}
                className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-black/55" />

            <div className="relative mx-auto flex h-full max-w-7xl items-center px-6">

                <div className="max-w-3xl">

                    <span className="rounded-full bg-blue-600 px-4 py-2 text-white">
                        {room.subtitle}
                    </span>

                    <h1 className="mt-6 text-6xl font-bold text-white">
                        {room.title}
                    </h1>

                    <div className="mt-6 flex flex-wrap gap-6 text-white">

                        <div className="flex items-center gap-2">
                            <Users size={20} />
                            {room.capacity} Guest
                        </div>

                        <div className="flex items-center gap-2">
                            <BedDouble size={20} />
                            {room.beds} Bed
                        </div>

                    </div>

                    <button
                        className="mt-10 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-4 font-semibold text-white transition hover:bg-blue-700 hover:gap-3"
                    >
                        Book Now
                        <ArrowRight size={18} />
                    </button>

                </div>

            </div>

        </section>
    );
};

export default RoomDetailsHero;