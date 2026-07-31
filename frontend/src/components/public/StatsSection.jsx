import { motion } from "framer-motion";
import {
    Building2,
    BedDouble,
    CalendarCheck,
    Star,
} from "lucide-react";

const stats = [
    {
        icon: Building2,
        value: "3",
        suffix: "",
        title: "Properties",
        description: "Prime locations across Lithuania",
    },
    {
        icon: BedDouble,
        value: "100",
        suffix: "+",
        title: "Available Rooms",
        description: "Comfortable & fully furnished",
    },
    {
        icon: CalendarCheck,
        value: "2500",
        suffix: "+",
        title: "Successful Bookings",
        description: "Trusted by residents every year",
    },
    {
        icon: Star,
        value: "5",
        suffix: "★",
        title: "Quality Service",
        description: "Focused on resident satisfaction",
    },
];

const StatsSection = () => {
    return (
        <section className="bg-white py-24">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">

                {/* Heading */}

                <div className="mx-auto mb-16 max-w-2xl text-center">
                    <span className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">
                        ALISHAN BY THE NUMBERS
                    </span>

                    <h2 className="mt-4 text-4xl font-bold text-slate-900">
                        Trusted Accommodation in Lithuania
                    </h2>

                    <p className="mt-4 mx-auto max-w-2xl text-slate-600">
                        From modern furnished rooms to excellent service, our numbers reflect
                        our commitment to providing a comfortable living experience.
                    </p>
                </div>

                {/* Cards */}

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {stats.map((item, index) => {
                        const Icon = item.icon;

                        return (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.15,
                                }}
                                whileHover={{
                                    y: -8,
                                }}
                                className="group rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:border-primary/20 hover:shadow-xl"
                            >
                                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary transition group-hover:scale-110">
                                    <Icon size={30} />
                                </div>

                                <h3 className="text-5xl font-bold text-slate-900">
                                    {item.value}
                                    <span className="text-primary">
                                        {item.suffix}
                                    </span>
                                </h3>

                                <h4 className="mt-4 text-xl font-semibold text-slate-900">
                                    {item.title}
                                </h4>

                                <p className="mt-2 text-sm leading-6 text-slate-500">
                                    {item.description}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
};

export default StatsSection;