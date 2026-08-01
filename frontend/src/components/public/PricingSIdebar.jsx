import { CalendarDays } from "lucide-react";

const PricingSidebar = ({ room }) => {
    return (
        <div className="rounded-3xl bg-white p-8 shadow-xl">

            <span className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">
                BOOK THIS ROOM
            </span>

            <h2 className="mt-4 text-5xl font-bold text-blue-600">

                {room.price}

            </h2>

            <p className="mt-2 text-slate-500">
                Monthly Rent
            </p>

            <div className="my-8 border-t" />

            <div className="space-y-5">

                <div className="flex justify-between">

                    <span>Room Type</span>

                    <strong>{room.subtitle}</strong>

                </div>

                <div className="flex justify-between">

                    <span>Capacity</span>

                    <strong>{room.capacity} Guest</strong>

                </div>

                <div className="flex justify-between">

                    <span>Status</span>

                    <strong className="text-green-600">
                        Available
                    </strong>

                </div>

            </div>

            <button
                className="
                mt-10
                flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-2xl
                bg-blue-600
                py-4
                font-semibold
                text-white
                transition
                hover:bg-blue-700
                "
            >

                <CalendarDays size={20} />

                Book This Room

            </button>

        </div>
    );
};

export default PricingSidebar;