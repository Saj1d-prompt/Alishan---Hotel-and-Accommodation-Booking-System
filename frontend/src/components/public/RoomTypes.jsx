import {
  AlertCircle,
  ArrowRight,
  BedDouble,
  CheckCircle2,
  ImageOff,
  Loader2,
  Users,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
  useSearchParams,
} from "react-router-dom";

import roomTypes from "@/data/roomTypes";

import {
  getTermLabel,
  getUtilitiesLabel,
} from "@/lib/accommodation";

import {
  getRoomImage,
} from "@/lib/roomMedia";

import {
  getLocationRoomTypeOffers,
} from "@/services/catalogApi";

const RoomTypes = ({
  location,
  selectedTerm,
}) => {
  const [
    searchParams,
  ] =
    useSearchParams();

  const [
    requestState,
    setRequestState,
  ] = useState({
    key: null,
    data: null,
    error: null,
  });

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
    &&
    requestedOccupants > 0
      ? requestedOccupants
      : 1;

  const startDate =
    searchParams.get(
      "start_date",
    );

  const endDate =
    searchParams.get(
      "end_date",
    );

  /*
   * Short-term availability cannot
   * be calculated without actual
   * check-in and check-out dates.
   */
  const canCheckAvailability =
    selectedTerm
      !== "short_term"
    ||
    Boolean(
      startDate
      &&
      endDate,
    );

  const requestKey =
    useMemo(
      () =>
        [
          location.slug,
          selectedTerm,
          occupants,
          startDate ?? "",
          endDate ?? "",
        ].join("|"),
      [
        location.slug,
        selectedTerm,
        occupants,
        startDate,
        endDate,
      ],
    );

  useEffect(() => {
    if (
      !canCheckAvailability
    ) {
      return undefined;
    }

    let cancelled =
      false;

    getLocationRoomTypeOffers(
      location.slug,
      {
        term:
          selectedTerm,

        occupants,

        startDate,

        endDate,
      },
    )
      .then((data) => {
        if (cancelled) {
          return;
        }

        setRequestState({
          key:
            requestKey,

          data,

          error:
            null,
        });
      })
      .catch(
        (requestError) => {
          if (cancelled) {
            return;
          }

          const validationErrors =
            requestError
              .response
              ?.data
              ?.errors;

          const firstValidationError =
            validationErrors
              ? Object
                  .values(
                    validationErrors,
                  )
                  .flat()
                  .find(Boolean)
              : null;

          setRequestState({
            key:
              requestKey,

            data:
              null,

            error:
              firstValidationError
              ??
              requestError
                .response
                ?.data
                ?.message
              ??
              "Room availability could not be checked.",
          });
        },
      );

    return () => {
      cancelled =
        true;
    };
  }, [
    canCheckAvailability,
    location.slug,
    selectedTerm,
    occupants,
    startDate,
    endDate,
    requestKey,
  ]);

  /*
   * When search parameters change,
   * do not display stale availability
   * while waiting for the new API call.
   */
  const isLoading =
    canCheckAvailability
    &&
    requestState.key
      !== requestKey;

  const offerData =
    requestState.key
      === requestKey
      ? requestState.data
      : null;

  const error =
    requestState.key
      === requestKey
      ? requestState.error
      : null;

  if (
    !canCheckAvailability
  ) {
    return (
      <section
        id="room-types"
        className="scroll-mt-24 bg-slate-50 py-24"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">
              Room Availability
            </span>

            <h2 className="mt-4 text-4xl font-bold text-slate-900 md:text-5xl">
              Select Your Stay Dates
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              Short-term room
              availability depends
              on your arrival and
              departure dates.
              Select dates from the
              accommodation search
              before choosing a
              room.
            </p>

            <Link
              to="/"
              className="mt-8 inline-flex rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Search With Dates
            </Link>
          </div>
        </div>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section
        id="room-types"
        className="scroll-mt-24 bg-slate-50 py-24"
      >
        <div className="flex min-h-64 items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto size-10 animate-spin text-blue-600" />

            <p className="mt-4 font-medium text-slate-600">
              Checking live room
              availability...
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section
        id="room-types"
        className="scroll-mt-24 bg-slate-50 py-24"
      >
        <div className="mx-auto max-w-3xl px-6 text-center">
          <AlertCircle className="mx-auto size-11 text-red-500" />

          <h2 className="mt-5 text-3xl font-bold text-slate-950">
            Availability Could
            Not Be Checked
          </h2>

          <p className="mt-4 text-slate-600">
            {error}
          </p>
        </div>
      </section>
    );
  }

  const offers =
    offerData
      ?.room_types
    ??
    [];

  return (
    <section
      id="room-types"
      className="scroll-mt-24 bg-slate-50 py-24"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">
            Live Availability
          </span>

          <h2 className="mt-4 text-4xl font-bold text-slate-900 md:text-5xl">
            Choose Your Room Type
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            Showing{" "}
            {getTermLabel(
              selectedTerm,
            ).toLowerCase()}{" "}
            options for{" "}
            {location.name} for{" "}
            {occupants}{" "}
            {occupants === 1
              ? "occupant"
              : "occupants"}
            .
          </p>

          {offerData
            ?.availability ? (
            <p className="mt-3 text-sm font-medium text-slate-500">
              Availability
              period:{" "}
              {
                offerData
                  .availability
                  .check_in_date
              }{" "}
              to{" "}
              {
                offerData
                  .availability
                  .check_out_date
              }
            </p>
          ) : null}
        </div>

        {offers.length
        === 0 ? (
          <div className="mx-auto mt-14 max-w-2xl rounded-3xl border border-amber-200 bg-amber-50 p-8 text-center">
            <AlertCircle className="mx-auto size-10 text-amber-600" />

            <h3 className="mt-4 text-xl font-bold text-amber-950">
              No room types are
              offered
            </h3>

            <p className="mt-3 leading-7 text-amber-800">
              There are currently
              no priced room types
              for this location
              and accommodation
              term.
            </p>
          </div>
        ) : (
          <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
            {offers.map(
              (offer) => {
                const room =
                  roomTypes.find(
                    (item) =>
                      item.slug
                      === offer.slug,
                  );

                if (!room) {
                  return null;
                }

                /*
                 * -------------------------------------------------
                 * Location-specific room image
                 * -------------------------------------------------
                 *
                 * Example:
                 *
                 * Latgalių + 2 Bed Room
                 * -> Latgalių 2-bed image
                 *
                 * Pylimo + 2 Bed Room
                 * -> Pylimo 2-bed image
                 *
                 * If no room-specific image exists yet,
                 * the location's main image is used.
                 */
                const roomImage =
                  getRoomImage(
                    room,
                    location.slug,
                    location.image,
                  );

                const available =
                  Boolean(
                    offer
                      .availability
                      ?.available,
                  );

                const utilitiesLabel =
                  getUtilitiesLabel(
                    offer
                      .rate
                      .utilities_included,
                  );

                const roomUrlParams =
                  new URLSearchParams(
                    searchParams,
                  );

                roomUrlParams.set(
                  "location",
                  location.slug,
                );

                roomUrlParams.set(
                  "term",
                  selectedTerm,
                );

                roomUrlParams.set(
                  "occupants",
                  String(
                    occupants,
                  ),
                );

                const roomUrl =
                  `/rooms/${room.slug}`
                  +
                  `?${roomUrlParams.toString()}`;

                return (
                  <article
                    key={
                      offer.uuid
                    }
                    className={[
                      "group flex h-full flex-col overflow-hidden rounded-3xl border bg-white shadow-md transition-all duration-300",

                      available
                        ? "border-slate-200 hover:-translate-y-1 hover:shadow-xl"
                        : "border-slate-200 opacity-75",
                    ].join(" ")}
                  >
                    <div className="relative overflow-hidden">
                      {roomImage ? (
                        <img
                          src={
                            roomImage
                          }
                          alt={`${location.name} ${offer.name}`}
                          className={[
                            "h-56 w-full object-cover transition duration-700",

                            available
                              ? "group-hover:scale-105"
                              : "grayscale-[35%]",
                          ].join(
                            " ",
                          )}
                        />
                      ) : (
                        <div className="flex h-56 w-full items-center justify-center bg-slate-100 text-slate-400">
                          <div className="text-center">
                            <ImageOff className="mx-auto size-10" />

                            <p className="mt-3 text-sm font-medium">
                              Room photo
                              coming soon
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                      <div className="absolute left-5 top-5">
                        {available ? (
                          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow">
                            <CheckCircle2
                              size={16}
                            />

                            Available
                          </span>
                        ) : (
                          <span className="rounded-full bg-slate-900/90 px-4 py-2 text-sm font-semibold text-white shadow">
                            Currently
                            unavailable
                          </span>
                        )}
                      </div>

                      <div className="absolute bottom-5 left-5 rounded-2xl bg-white/95 px-4 py-3 shadow-sm">
                        <p className="text-xl font-bold text-slate-950">
                          €
                          {
                            offer
                              .rate
                              .amount
                          }
                        </p>

                        <p className="text-xs font-semibold text-slate-600">
                          Per person /{" "}
                          {
                            offer
                              .rate
                              .billing_unit
                          }
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-2xl font-bold text-slate-900">
                            {
                              room.title
                            }
                          </h3>

                          <p className="mt-1 text-sm text-slate-500">
                            {
                              room.subtitle
                            }
                          </p>
                        </div>

                        <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                          <BedDouble
                            size={24}
                          />
                        </div>
                      </div>

                      <div className="mt-6 flex items-center gap-2 text-sm text-slate-600">
                        <Users
                          size={18}
                          className="text-blue-600"
                        />

                        Up to{" "}
                        {
                          offer.capacity
                        }{" "}
                        {offer.capacity
                        === 1
                          ? "person"
                          : "people"}
                      </div>

                      {utilitiesLabel ? (
                        <p className="mt-4 text-sm font-medium text-slate-500">
                          {
                            utilitiesLabel
                          }
                        </p>
                      ) : null}

                      <div className="mt-6 space-y-3">
                        {room.amenities
                          .slice(
                            0,
                            4,
                          )
                          .map(
                            (
                              amenity,
                            ) => (
                              <div
                                key={
                                  amenity
                                }
                                className="flex items-center gap-3 text-sm text-slate-600"
                              >
                                <CheckCircle2
                                  size={17}
                                  className="shrink-0 text-green-500"
                                />

                                <span>
                                  {
                                    amenity
                                  }
                                </span>
                              </div>
                            ),
                          )}
                      </div>

                      <div className="mt-auto pt-8">
                        {available ? (
                          <Link
                            to={
                              roomUrl
                            }
                            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
                          >
                            View Details

                            <ArrowRight
                              size={18}
                            />
                          </Link>
                        ) : (
                          <button
                            type="button"
                            disabled
                            className="flex w-full cursor-not-allowed items-center justify-center rounded-xl bg-slate-200 px-5 py-3 font-semibold text-slate-500"
                          >
                            Currently
                            Unavailable
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                );
              },
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default RoomTypes;