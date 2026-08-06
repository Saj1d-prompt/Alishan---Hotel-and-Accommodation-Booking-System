import {
  AlertCircle,
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
  getTermLabel,
  getUtilitiesLabel,
} from "@/lib/accommodation";

const PricingSidebar = ({
  location,
  room,
  term,
  offer,
  allowedFloors = [],
  availabilityPeriod = null,
  availabilityError = null,
  returnUrl = "/locations",
}) => {
  const [searchParams] =
    useSearchParams();

  if (
    !location
    || !room
    || !term
  ) {
    return (
      <aside
        id="booking-summary"
        className="scroll-mt-28 rounded-3xl border border-slate-200 bg-white p-8 shadow-lg"
      >
        <h3 className="text-2xl font-bold text-slate-900">
          Choose Accommodation
        </h3>

        <p className="mt-4 leading-7 text-slate-600">
          Select a location,
          accommodation term and room
          type before continuing.
        </p>

        <Link
          to="/locations"
          className="mt-8 flex justify-center rounded-xl bg-blue-600 px-6 py-4 font-semibold text-white transition hover:bg-blue-700"
        >
          View Locations
        </Link>
      </aside>
    );
  }

  if (availabilityError) {
    return (
      <aside
        id="booking-summary"
        className="scroll-mt-28 rounded-3xl border border-red-200 bg-white p-8 shadow-lg"
      >
        <AlertCircle className="size-9 text-red-500" />

        <h3 className="mt-5 text-2xl font-bold text-slate-900">
          Availability Unavailable
        </h3>

        <p className="mt-4 leading-7 text-slate-600">
          {availabilityError}
        </p>

        <Link
          to={returnUrl}
          className="mt-8 flex justify-center rounded-xl bg-slate-900 px-6 py-4 font-semibold text-white transition hover:bg-slate-800"
        >
          Choose Another Room
        </Link>
      </aside>
    );
  }

  /*
   * If Laravel does not return this room type,
   * it is not currently offered for this
   * property/term.
   */
  if (!offer) {
    return (
      <aside
        id="booking-summary"
        className="scroll-mt-28 rounded-3xl border border-amber-200 bg-white p-8 shadow-lg"
      >
        <AlertCircle className="size-9 text-amber-500" />

        <h3 className="mt-5 text-2xl font-bold text-slate-900">
          Room Type Unavailable
        </h3>

        <p className="mt-4 leading-7 text-slate-600">
          This room type is not
          currently offered for the
          selected location and
          accommodation term.
        </p>

        <Link
          to={returnUrl}
          className="mt-8 flex justify-center rounded-xl bg-blue-600 px-6 py-4 font-semibold text-white transition hover:bg-blue-700"
        >
          Choose Another Room
        </Link>
      </aside>
    );
  }

  const available =
    Boolean(
      offer
        .availability
        ?.available,
    );

  const availableRoomCount =
    Number(
      offer
        .availability
        ?.available_rooms
      ?? 0,
    );

  const requestedOccupants =
    Number(
      searchParams.get(
        "occupants",
      ),
    );

  const occupants =
    Number.isInteger(
      requestedOccupants,
    )
    && requestedOccupants > 0
      ? requestedOccupants
      : 1;

  const utilitiesLabel =
    getUtilitiesLabel(
      offer
        .rate
        .utilities_included,
    );

  const bookingParams =
    new URLSearchParams(
      searchParams,
    );

  bookingParams.set(
    "location",
    location.slug,
  );

  bookingParams.set(
    "room_type",
    room.slug,
  );

  bookingParams.set(
    "term",
    term,
  );

  bookingParams.set(
    "occupants",
    String(occupants),
  );

  const bookingUrl =
    `/booking?${bookingParams.toString()}`;

  return (
    <aside
      id="booking-summary"
      className={[
        "scroll-mt-28 rounded-3xl border bg-white p-8 shadow-xl",
        available
          ? "border-slate-200"
          : "border-amber-200",
      ].join(" ")}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
          {getTermLabel(
            term,
          )}
        </p>

        {available ? (
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
            Available
          </span>
        ) : (
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
            Currently Unavailable
          </span>
        )}
      </div>

      <div className="mt-4">
        <p className="text-4xl font-bold text-slate-900">
          €
          {
            offer
              .rate
              .amount
          }
        </p>

        <p className="mt-1 font-medium text-slate-500">
          Per person /{" "}
          {
            offer
              .rate
              .billing_unit
          }
        </p>
      </div>

      <div className="mt-8 space-y-5">
        <div className="flex items-start gap-3">
          <MapPin
            size={20}
            className="mt-0.5 shrink-0 text-blue-600"
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
            className="mt-0.5 shrink-0 text-blue-600"
          />

          <div>
            <p className="text-sm text-slate-500">
              Occupants
            </p>

            <p className="font-semibold text-slate-900">
              {occupants}{" "}
              {occupants === 1
                ? "person"
                : "people"}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <CalendarDays
            size={20}
            className="mt-0.5 shrink-0 text-blue-600"
          />

          <div>
            <p className="text-sm text-slate-500">
              Stay Period
            </p>

            {availabilityPeriod ? (
              <p className="font-semibold leading-6 text-slate-900">
                {
                  availabilityPeriod
                    .check_in_date
                }{" "}
                to{" "}
                {
                  availabilityPeriod
                    .check_out_date
                }
              </p>
            ) : (
              <p className="font-semibold text-slate-900">
                {term
                  === "short_term"
                  ? "Selected dates"
                  : "1 September to 31 August"}
              </p>
            )}
          </div>
        </div>

        {utilitiesLabel ? (
          <div className="flex items-start gap-3">
            <CheckCircle2
              size={20}
              className="mt-0.5 shrink-0 text-green-500"
            />

            <p className="font-medium text-slate-700">
              {utilitiesLabel}
            </p>
          </div>
        ) : null}

        {Array.isArray(
          allowedFloors,
        )
        && allowedFloors.length
          > 0 ? (
          <div className="rounded-xl bg-blue-50 p-4 text-sm font-medium leading-6 text-blue-800">
            Available physical rooms
            for this term are restricted
            to floor
            {allowedFloors.length > 1
              ? "s "
              : " "}
            {allowedFloors.join(
              ", ",
            )}
            .
          </div>
        ) : null}

        {available ? (
          <div className="rounded-xl bg-emerald-50 p-4 text-sm font-medium leading-6 text-emerald-800">
            {availableRoomCount} matching{" "}
            {availableRoomCount === 1
              ? "physical room is"
              : "physical rooms are"}{" "}
            currently available.
          </div>
        ) : (
          <div className="rounded-xl bg-amber-50 p-4 text-sm font-medium leading-6 text-amber-800">
            No matching physical room
            is currently available for
            this stay.
          </div>
        )}
      </div>

      {available ? (
        <>
          <Link
            to={bookingUrl}
            className="mt-8 flex justify-center rounded-xl bg-blue-600 px-6 py-4 font-semibold text-white transition hover:bg-blue-700"
          >
            Continue to Booking Request
          </Link>

          <p className="mt-4 text-center text-xs leading-5 text-slate-500">
            Availability will be checked
            again when the booking request
            is submitted.
          </p>
        </>
      ) : (
        <>
          <button
            type="button"
            disabled
            className="mt-8 flex w-full cursor-not-allowed justify-center rounded-xl bg-slate-200 px-6 py-4 font-semibold text-slate-500"
          >
            Currently Unavailable
          </button>

          <Link
            to={returnUrl}
            className="mt-3 flex justify-center rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Choose Another Room
          </Link>
        </>
      )}
    </aside>
  );
};

export default PricingSidebar;