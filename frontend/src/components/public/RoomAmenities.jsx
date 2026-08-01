import { motion } from "framer-motion";
import {
    Wifi,
    CookingPot,
    WashingMachine,
    Heater,
} from "lucide-react";

const amenities = [
    {
        icon: Wifi,
        title: "High-Speed Wi-Fi",
        desc: "Fast internet access throughout the property.",
    },

    {
        icon: CookingPot,
        title: "Shared Kitchen",
        desc: "Modern kitchen fully equipped for residents.",
    },

    {
        icon: WashingMachine,
        title: "Laundry",
        desc: "Convenient washing facilities available.",
    },

    {
        icon: Heater,
        title: "Heating",
        desc: "Comfortable indoor temperature all year.",
    },
];

const RoomAmenities = () => {
    return (
        <section>

            <span className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">
                ROOM FEATURES
            </span>

            <h2 className="mt-4 text-4xl font-bold">
                What's Included
            </h2>

            <div className="mt-10 grid gap-8 md:grid-cols-2">

                {amenities.map((item, index) => {

                    const Icon = item.icon;

                    return (

                        <motion.div
                            key={item.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{
                                delay: index * 0.1,
                            }}
                            whileHover={{
                                y: -6,
                            }}
                            className="rounded-3xl border bg-white p-8 shadow-sm hover:shadow-xl"
                        >

                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">

                                <Icon size={28} />

                            </div>

                            <h3 className="mt-6 text-2xl font-bold">

                                {item.title}

                            </h3>

                            <p className="mt-3 text-slate-600">

                                {item.desc}

                            </p>

                        </motion.div>

                    );

                })}

            </div>

        </section>
    );
};

export default RoomAmenities;