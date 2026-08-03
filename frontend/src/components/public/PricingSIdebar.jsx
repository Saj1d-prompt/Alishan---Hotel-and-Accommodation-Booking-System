import {
  CalendarDays,
  CheckCircle2,
  MapPin,
} from "lucide-react";
import { Link } from "react-router-dom";

import {
  formatRate,
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
          selected location and booking term.
        </p>
      </div>
    );
  }

  const utilitiesLabel =
    getUtilitiesLabel(
      config.utilitiesIncluded
    );

  const bookingUrl =
    `/booking` +
    `?location=${encodeURIComponent(
      location.slug
    )}` +
    `&room_type=${encodeURIComponent(
      room.slug
    )}` +
    `&term=${encodeURIComponent(
      term
    )}`;

  return (
    <aside
      id="booking-summary"
      className="scroll-mt-28 rounded-3xl border border-slate-200 bg-white p-8 shadow-xl"
    >

      <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
        {getTermLabel(term)}
      </p>

      <div className="mt-4">

        <span className="text-4xl font-bold text-slate-900">
          €{rate}
        </span>

        <span className="ml-2 text-slate-500">
          / {config.billingUnit}
        </span>

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

        {utilitiesLabel && (
          <div className="flex items-center gap-3">
            <CheckCircle2
              size={20}
              className="text-green-500"
            />

            <p className="font-medium text-slate-700">
              {utilitiesLabel}
            </p>
          </div>
        )}

        {config.allowedFloors && (
          <p className="rounded-xl bg-blue-50 p-4 text-sm font-medium text-blue-800">
            Short-term rooms are available only on
            floors{" "}
            {config.allowedFloors.join(" and ")}.
          </p>
        )}

      </div>

      <Link
        to={bookingUrl}
        className="mt-8 flex justify-center rounded-xl bg-blue-600 px-6 py-4 font-semibold text-white transition hover:bg-blue-700"
      >
        Book Now
      </Link>

    </aside>
  );
};

export default PricingSidebar;