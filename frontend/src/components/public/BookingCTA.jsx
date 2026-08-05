import {
  Link,
  useSearchParams,
} from "react-router-dom";

const BookingCTA = ({
  location,
  room = null,
  term,
}) => {
  const [searchParams] = useSearchParams();

  const hasBookingContext =
    Boolean(location) &&
    Boolean(room) &&
    Boolean(term);

  const bookingParams =
    new URLSearchParams(searchParams);

  if (hasBookingContext) {
    bookingParams.set(
      "location",
      location.slug
    );

    bookingParams.set(
      "room_type",
      room.slug
    );

    bookingParams.set("term", term);
  }

  const bookingUrl =
    `/booking?${bookingParams.toString()}`;

  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-5xl rounded-3xl bg-gradient-to-r from-blue-700 to-cyan-500 px-8 py-16 text-center text-white">
        <h2 className="text-4xl font-bold md:text-5xl">
          {hasBookingContext
            ? "Ready to Submit a Request?"
            : "Choose Your Room Type"}
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-blue-50">
          {hasBookingContext
            ? "Review the selected accommodation details before entering guest information. Payment is requested only after Admin approval."
            : "Select a room type for this location and accommodation term to continue."}
        </p>

        {hasBookingContext ? (
          <Link
            to={bookingUrl}
            className="mt-10 inline-flex rounded-xl bg-white px-8 py-4 font-semibold text-blue-700 transition hover:bg-slate-100"
          >
            Continue to Booking Request
          </Link>
        ) : (
          <a
            href="#room-types"
            className="mt-10 inline-flex rounded-xl bg-white px-8 py-4 font-semibold text-blue-700 transition hover:bg-slate-100"
          >
            Choose a Room
          </a>
        )}
      </div>
    </section>
  );
};

export default BookingCTA;