import {
  CalendarDays,
  CheckCircle2,
  MapPin,
  Users,
} from "lucide-react";
import {
  Link,
  useSearchParams,
} from "react-router-dom";

import {
  getRoomRate,
  getTermConfig,
  getTermLabel,
  getUtilitiesLabel,
} from "@/lib/accommodation";

const PricingSidebar = ({
  location,
  room,
  term,
}) => {
  const [searchParams] = useSearchParams();

  if (!location || !term) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
        <h3 className="text-2xl font-bold text-slate-900">
          Choose a Location
        </h3>

        <p className="mt-4 leading-7 text-slate-600">
          Select an accommodation location first to
          view the correct pricing and booking term.
        </p>

        <Link
          to="/locations"
          className="mt-8 flex justify-center rounded-xl bg-blue-600 px-6 py-4 font-semibold text-white transition hover:bg-blue-700"
        >
          View Locations
        </Link>
      </div>
    );
  }

  const config = getTermConfig(
    location,
    term
  );

  const rate = getRoomRate(
    location,
    term,
    room.capacity
  );

  if (!config || rate === null) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
        <h3 className="text-xl font-bold">
          Not Available
        </h3>

        <p className="mt-3 text-slate-600">
          This room type is not offered for the
          selected location and accommodation term.
        </p>
      </div>
    );
  }

  const utilitiesLabel =
    getUtilitiesLabel(
      config.utilitiesIncluded
    );

  const requestedOccupants = Number(
    searchParams.get("occupants")
  );

  const occupants =
    Number.isInteger(requestedOccupants) &&
    requestedOccupants > 0
      ? requestedOccupants
      : 1;

  const finalOccupants = Math.min(
    occupants,
    room.capacity
  );

  const bookingParams =
    new URLSearchParams(searchParams);

  bookingParams.set(
    "location",
    location.slug
  );

  bookingParams.set(
    "room_type",
    room.slug
  );

  bookingParams.set("term", term);

  bookingParams.set(
    "occupants",
    String(finalOccupants)
  );

  const bookingUrl =
    `/booking?${bookingParams.toString()}`;

  return (
    <aside
      id="booking-summary"
      className="scroll-mt-28 rounded-3xl border border-slate-200 bg-white p-8 shadow-xl"
    >
      <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
        {getTermLabel(term)}
      </p>

      <div className="mt-4">
        <p className="text-4xl font-bold text-slate-900">
          €{rate}
        </p>

        <p className="mt-1 font-medium text-slate-500">
          Per person / {config.billingUnit}
        </p>
      </div>

      <div className="mt-8 space-y-5">
        <div className="flex items-start gap-3">
          <MapPin
            size={20}
            className="mt-0.5 text-blue-600"
          />

          <div>
            <p className="text-sm text-slate-500">
              Location
            </p>

            <p className="font-semibold text-slate-900">
              {location.name}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Users
            size={20}
            className="mt-0.5 text-blue-600"
          />

          <div>
            <p className="text-sm text-slate-500">
              Occupants
            </p>

            <p className="font-semibold text-slate-900">
              {finalOccupants}{" "}
              {finalOccupants === 1
                ? "person"
                : "people"}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <CalendarDays
            size={20}
            className="mt-0.5 text-blue-600"
          />

          <div>
            <p className="text-sm text-slate-500">
              Stay Conditions
            </p>

            <p className="font-semibold text-slate-900">
              {term === "short_term"
                ? "1 night to maximum 3 months"
                : "1 September to 31 August"}
            </p>
          </div>
        </div>

        {utilitiesLabel ? (
          <div className="flex items-center gap-3">
            <CheckCircle2
              size={20}
              className="text-green-500"
            />

            <p className="font-medium text-slate-700">
              {utilitiesLabel}
            </p>
          </div>
        ) : null}

        {config.allowedFloors ? (
          <p className="rounded-xl bg-blue-50 p-4 text-sm font-medium text-blue-800">
            Short-term rooms are available only on
            floors{" "}
            {config.allowedFloors.join(" and ")}.
          </p>
        ) : null}
      </div>

      <Link
        to={bookingUrl}
        className="mt-8 flex justify-center rounded-xl bg-blue-600 px-6 py-4 font-semibold text-white transition hover:bg-blue-700"
      >
        Continue to Booking Request
      </Link>

      <p className="mt-4 text-center text-xs leading-5 text-slate-500">
        No payment is collected now. Admin must first
        review and approve the request.
      </p>
    </aside>
  );
};

export default PricingSidebar;