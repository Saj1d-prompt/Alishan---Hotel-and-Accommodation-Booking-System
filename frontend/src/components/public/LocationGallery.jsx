import { motion } from "framer-motion";
import { Images } from "lucide-react";

const LocationGallery = ({ location }) => {
  const gallery = location.gallery || [
    location.image,
    location.image,
    location.image,
    location.image,
    location.image,
  ];

  return (
    <section className="bg-slate-50 py-24">

      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        {/* Heading */}

        <div className="mb-14 flex items-center justify-between">

          <div>

            <span className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">
              PHOTO GALLERY
            </span>

            <h2 className="mt-3 text-5xl font-bold text-slate-900">
              Explore the Property
            </h2>

            <p className="mt-4 max-w-2xl text-lg text-slate-600">
              Take a closer look at the rooms, shared facilities and
              comfortable living spaces.
            </p>

          </div>

          <button
            className="
            hidden
            items-center
            gap-2
            rounded-xl
            border
            border-slate-300
            px-5
            py-3
            font-semibold
            transition
            hover:bg-slate-900
            hover:text-white
            lg:flex
            "
          >
            <Images size={18} />
            View All Photos
          </button>

        </div>

        {/* Gallery */}

        <div className="grid gap-5 lg:grid-cols-4">

          {/* Main Image */}

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="group lg:col-span-2 lg:row-span-2 overflow-hidden rounded-3xl"
          >

            <img
              src={gallery[0]}
              alt=""
              className="h-full min-h-[520px] w-full object-cover transition duration-700 group-hover:scale-110"
            />

          </motion.div>

          {/* Right Images */}

          {gallery.slice(1, 5).map((image, index) => (

            <motion.div
              key={index}
              whileHover={{ scale: 1.03 }}
              className="group overflow-hidden rounded-3xl"
            >

              <img
                src={image}
                alt=""
                className="h-60 w-full object-cover transition duration-700 group-hover:scale-110"
              />

            </motion.div>

          ))}

        </div>

      </div>

    </section>
  );
};

export default LocationGallery;