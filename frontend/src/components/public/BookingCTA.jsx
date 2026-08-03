import { Link } from "react-router-dom";

const BookingCTA = ({
  location,
  room,
  term,
}) => {
  const hasBookingContext =
    location && room && term;

  const bookingUrl =
    hasBookingContext
      ? `/booking` +
        `?location=${encodeURIComponent(
          location.slug
        )}` +
        `&room_type=${encodeURIComponent(
          room.slug
        )}` +
        `&term=${encodeURIComponent(
          term
        )}`
      : "/locations";

  return (
    <section className="py-24">

      <div className="mx-auto max-w-5xl rounded-3xl bg-gradient-to-r from-blue-700 to-cyan-500 px-8 py-16 text-center text-white">

        <h2 className="text-4xl font-bold md:text-5xl">
          Ready to Continue?
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-lg">
          {hasBookingContext
            ? "Submit your accommodation booking request for review."
            : "Choose a location and room type to start your booking request."}
        </p>

        <Link
          to={bookingUrl}
          className="mt-10 inline-block rounded-xl bg-white px-8 py-4 font-semibold text-blue-700 transition hover:bg-slate-100"
        >
          {hasBookingContext
            ? "Book Now"
            : "Choose Location"}
        </Link>

      </div>

    </section>
  );
};

export default BookingCTA;