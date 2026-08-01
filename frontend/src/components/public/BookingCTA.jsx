import { Link } from "react-router-dom";

const BookingCTA = () => {
  return (
    <section className="py-24">

      <div className="mx-auto max-w-5xl rounded-3xl bg-gradient-to-r from-blue-700 to-cyan-500 px-8 py-16 text-center text-white">

        <h2 className="text-5xl font-bold">
          Ready to Book?
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-lg">
          Explore available rooms and secure your accommodation today.
        </p>

        <Link
          to="/booking"
          className="mt-10 inline-block rounded-xl bg-white px-8 py-4 font-semibold text-blue-700"
        >
          Book Now
        </Link>

      </div>

    </section>
  );
};

export default BookingCTA;