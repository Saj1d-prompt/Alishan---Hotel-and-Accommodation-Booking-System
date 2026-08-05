import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Users,
} from "lucide-react";
import {
  Link,
  useSearchParams,
} from "react-router-dom";

import locations from "@/data/locations";
import roomTypes from "@/data/roomTypes";

import {
  getRoomRate,
  getTermConfig,
  getTermLabel,
  isTermAllowed,
} from "@/lib/accommodation";

const Booking = () => {
  const [searchParams] = useSearchParams();

  const location = locations.find(
    (item) =>
      item.slug ===
      searchParams.get("location")
  );

  const room = roomTypes.find(
    (item) =>
      item.slug ===
      searchParams.get("room_type")
  );

  const requestedTerm =
    searchParams.get("term");

  const term =
    location &&
    isTermAllowed(
      location,
      requestedTerm
    )
      ? requestedTerm
      : null;

  const rate =
    location && room && term
      ? getRoomRate(
          location,
          term,
          room.capacity
        )
      : null;

  const requestedOccupants = Number(
    searchParams.get("occupants")
  );

  const occupants =
    Number.isInteger(requestedOccupants) &&
    requestedOccupants > 0
      ? requestedOccupants
      : 1;

  const contextIsValid =
    Boolean(location) &&
    Boolean(room) &&
    Boolean(term) &&
    rate !== null &&
    occupants <= room.capacity;

  if (!contextIsValid) {
    return (
      <main className="min-h-[75vh] bg-slate-50 px-6 pb-20 pt-36">
        <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <h1 className="text-4xl font-bold text-slate-950">
            Select Accommodation First
          </h1>

          <p className="mt-5 text-lg leading-8 text-slate-600">
            A booking request requires a valid
            location, accommodation term, room type
            and occupant count.
          </p>

          <Link
            to="/locations"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            <ArrowLeft size={18} />
            Choose Accommodation
          </Link>
        </div>
      </main>
    );
  }

  const config = getTermConfig(
    location,
    term
  );

  const startDate =
    searchParams.get("start_date");

  const endDate =
    searchParams.get("end_date");

  return (
    <main className="min-h-screen bg-slate-50 px-6 pb-24 pt-36">
      <div className="mx-auto max-w-5xl">
        <div className="max-w-3xl">
          <span className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">
            Booking Request
          </span>

          <h1 className="mt-4 text-4xl font-bold text-slate-950 sm:text-5xl">
            Review Your Selection
          </h1>

          <p className="mt-5 text-lg leading-8 text-slate-600">
            This page confirms that the route and
            selected accommodation context are
            working. Guest details and private
            passport upload will be added in the next
            implementation batch.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-950">
              Accommodation Summary
            </h2>

            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <MapPin className="mt-1 size-5 text-blue-600" />

                <div>
                  <p className="text-sm text-slate-500">
                    Location
                  </p>

                  <p className="font-semibold text-slate-950">
                    {location.name}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CalendarDays className="mt-1 size-5 text-blue-600" />

                <div>
                  <p className="text-sm text-slate-500">
                    Term
                  </p>

                  <p className="font-semibold text-slate-950">
                    {getTermLabel(term)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Users className="mt-1 size-5 text-blue-600" />

                <div>
                  <p className="text-sm text-slate-500">
                    Occupants
                  </p>

                  <p className="font-semibold text-slate-950">
                    {occupants}{" "}
                    {occupants === 1
                      ? "person"
                      : "people"}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Room type
                </p>

                <p className="font-semibold text-slate-950">
                  {room.title}
                </p>
              </div>
            </div>

            {term === "short_term" ? (
              <div className="mt-8 rounded-2xl bg-slate-50 p-5">
                <p className="text-sm font-medium text-slate-500">
                  Requested dates
                </p>

                <p className="mt-1 font-semibold text-slate-950">
                  {startDate && endDate
                    ? `${startDate} to ${endDate}`
                    : "Dates must be selected before the booking request is submitted."}
                </p>
              </div>
            ) : (
              <div className="mt-8 rounded-2xl bg-slate-50 p-5">
                <p className="text-sm font-medium text-slate-500">
                  Long-term period
                </p>

                <p className="mt-1 font-semibold text-slate-950">
                  1 September to 31 August
                </p>
              </div>
            )}
          </section>

          <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Current Rate
            </p>

            <p className="mt-4 text-4xl font-bold text-slate-950">
              €{rate}
            </p>

            <p className="mt-1 text-slate-500">
              Per person / {config.billingUnit}
            </p>

            <div className="mt-8 rounded-2xl bg-blue-50 p-5 text-sm leading-6 text-blue-900">
              No payment is collected during the
              initial request. Admin reviews the
              application first. An approved booking
              will later receive a secure payment
              option.
            </div>

            <Link
              to={
                `/locations/${location.slug}` +
                `?term=${encodeURIComponent(
                  term
                )}`
              }
              className="mt-6 flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <ArrowLeft size={18} />
              Change Selection
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default Booking;