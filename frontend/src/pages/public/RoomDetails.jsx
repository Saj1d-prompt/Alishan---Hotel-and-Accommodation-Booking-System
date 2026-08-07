import {
  AlertCircle,
  ArrowLeft,
  Loader2,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
  useParams,
  useSearchParams,
} from "react-router-dom";

import BookingCTA from "@/components/public/BookingCTA";
import Breadcrumb from "@/components/public/Breadcrumb";
import PricingSidebar from "@/components/public/PricingSidebar";
import RoomAmenities from "@/components/public/RoomAmenities";
import RoomDetailsHero from "@/components/public/RoomDetailsHero";
// import RoomGallery from "@/components/public/RoomGallery";
import RoomOverview from "@/components/public/RoomOverview";

import locations from "@/data/locations";
import roomTypes from "@/data/roomTypes";

import {
  isTermAllowed,
} from "@/lib/accommodation";

import {
  getRoomPresentation,
} from "@/lib/roomMedia";

import {
  getLocationRoomTypeOffers,
} from "@/services/catalogApi";

const RoomDetails = () => {
  const { slug } = useParams();

  const [searchParams] =
    useSearchParams();

  const room = roomTypes.find(
    (item) =>
      item.slug === slug,
  );

  const locationSlug =
    searchParams.get(
      "location",
    );

  const requestedTerm =
    searchParams.get(
      "term",
    );

  const requestedOccupants =
    Number(
      searchParams.get(
        "occupants",
      ),
    );

  const startDate =
    searchParams.get(
      "start_date",
    );

  const endDate =
    searchParams.get(
      "end_date",
    );

  const location =
  locations.find(
    (item) =>
      item.slug
      === locationSlug,
  );

const displayRoom =
  getRoomPresentation(
    room,
    location,
  );

  const term =
    location
    && isTermAllowed(
      location,
      requestedTerm,
    )
      ? requestedTerm
      : null;

  const occupants =
    Number.isInteger(
      requestedOccupants,
    )
    && requestedOccupants > 0
      ? requestedOccupants
      : 1;

  /*
   * First validate the URL/context itself.
   *
   * This does NOT determine availability.
   * Laravel does that below.
   */
  const basicContextIsValid =
    Boolean(room)
    && Boolean(location)
    && Boolean(term)
    && occupants >= 1
    && occupants
      <= (room?.capacity ?? 0);

  /*
   * Short-term inventory cannot be checked
   * correctly without exact stay dates.
   */
  const canCheckAvailability =
    basicContextIsValid
    && (
      term !== "short_term"
      || Boolean(
        startDate
        && endDate,
      )
    );

  const requestKey =
    useMemo(
      () =>
        [
          location?.slug
            ?? "",
          room?.slug
            ?? "",
          term ?? "",
          occupants,
          startDate ?? "",
          endDate ?? "",
        ].join("|"),
      [
        location?.slug,
        room?.slug,
        term,
        occupants,
        startDate,
        endDate,
      ],
    );

  const [
    availabilityState,
    setAvailabilityState,
  ] = useState({
    key: null,
    data: null,
    error: null,
  });

  /*
   * Live inventory lookup.
   *
   * We deliberately perform state updates from
   * Promise callbacks rather than synchronously
   * inside the effect body, keeping React 19
   * lint happy.
   */
  useEffect(() => {
    if (
      !canCheckAvailability
      || !location
      || !term
    ) {
      return undefined;
    }

    let cancelled = false;

    getLocationRoomTypeOffers(
      location.slug,
      {
        term,

        occupants,

        startDate,

        endDate,
      },
    )
      .then((data) => {
        if (cancelled) {
          return;
        }

        setAvailabilityState({
          key: requestKey,
          data,
          error: null,
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

          setAvailabilityState({
            key: requestKey,

            data: null,

            error:
              firstValidationError
              ?? requestError
                .response
                ?.data
                ?.message
              ?? "Live room availability could not be checked.",
          });
        },
      );

    return () => {
      cancelled = true;
    };
  }, [
    canCheckAvailability,
    location,
    term,
    occupants,
    startDate,
    endDate,
    requestKey,
  ]);

  /*
   * Old data must not be displayed after
   * the URL/search parameters change.
   */
  const isLoading =
    canCheckAvailability
    && availabilityState.key
      !== requestKey;

  const offerData =
    availabilityState.key
      === requestKey
      ? availabilityState.data
      : null;

  const availabilityError =
    availabilityState.key
      === requestKey
      ? availabilityState.error
      : null;

  const liveOffer =
    offerData
      ?.room_types
      ?.find(
        (offer) =>
          offer.slug
          === room?.slug,
      )
    ?? null;

  const isAvailable =
    Boolean(
      liveOffer
        ?.availability
        ?.available,
    );

  /*
   * Invalid room slug.
   */
  if (!room) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-6 pt-20">
        <div className="max-w-lg text-center">
          <AlertCircle className="mx-auto size-12 text-amber-500" />

          <h1 className="mt-5 text-4xl font-bold text-slate-900">
            Room Type Not Found
          </h1>

          <p className="mt-4 text-lg leading-8 text-slate-600">
            The requested room type
            could not be found.
          </p>

          <Link
            to="/locations"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            <ArrowLeft size={18} />
            View Locations
          </Link>
        </div>
      </main>
    );
  }

  /*
   * Missing/invalid location, term or occupant
   * context.
   */
  if (!basicContextIsValid) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-6 pt-20">
        <div className="max-w-xl rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <AlertCircle className="mx-auto size-12 text-amber-500" />

          <h1 className="mt-5 text-4xl font-bold text-slate-900">
            Choose Accommodation First
          </h1>

          <p className="mt-5 text-lg leading-8 text-slate-600">
            Room availability depends
            on the selected location,
            accommodation term and
            number of occupants.
          </p>

          <Link
            to="/locations"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            <ArrowLeft size={18} />
            Choose Location
          </Link>
        </div>
      </main>
    );
  }

  /*
   * Short-term direct URL without dates.
   */
  if (
    term === "short_term"
    && (!startDate || !endDate)
  ) {
    const locationParams =
      new URLSearchParams();

    locationParams.set(
      "term",
      term,
    );

    locationParams.set(
      "occupants",
      String(occupants),
    );

    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-6 pt-20">
        <div className="max-w-xl rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <AlertCircle className="mx-auto size-12 text-blue-500" />

          <h1 className="mt-5 text-4xl font-bold text-slate-900">
            Select Your Stay Dates
          </h1>

          <p className="mt-5 text-lg leading-8 text-slate-600">
            Short-term availability
            cannot be confirmed without
            an arrival and departure date.
          </p>

          <Link
            to={
              `/locations/${location.slug}`
              + `?${locationParams.toString()}`
            }
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            <ArrowLeft size={18} />
            Return to Location
          </Link>
        </div>
      </main>
    );
  }

  /*
   * Live availability loading state.
   */
  if (isLoading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-6 pt-20">
        <div className="text-center">
          <Loader2 className="mx-auto size-11 animate-spin text-blue-600" />

          <p className="mt-5 font-medium text-slate-600">
            Checking live room
            availability...
          </p>
        </div>
      </main>
    );
  }

  const locationReturnParams =
    new URLSearchParams(
      searchParams,
    );

  locationReturnParams.delete(
    "location",
  );

  const locationReturnUrl =
    `/locations/${location.slug}`
    + `?${locationReturnParams.toString()}`
    + "#room-types";

  return (
    <main className="bg-slate-50 pt-20">
      <Breadcrumb
        location={location}
        room={room}
        term={term}
      />

      <RoomDetailsHero
        room={displayRoom}
        isAvailable={
          isAvailable
        }
      />
{/* 
      <RoomGallery
        room={displayRoom}
      /> */}

      <section className="py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[minmax(0,1fr)_390px] lg:px-8">
          <div className="space-y-16">
            <RoomOverview
              room={displayRoom}
            />

            <RoomAmenities
              room={displayRoom}
            />

            {!isAvailable
            && !availabilityError ? (
              <section className="rounded-3xl border border-amber-200 bg-amber-50 p-8">
                <AlertCircle className="size-9 text-amber-600" />

                <h2 className="mt-5 text-2xl font-bold text-amber-950">
                  Currently Unavailable
                </h2>

                <p className="mt-4 leading-7 text-amber-800">
                  There is currently no
                  matching physical room
                  available for this room
                  type, stay period and
                  occupant count.
                </p>

                <Link
                  to={
                    locationReturnUrl
                  }
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-amber-700 px-5 py-3 font-semibold text-white transition hover:bg-amber-800"
                >
                  <ArrowLeft
                    size={18}
                  />
                  Choose Another Room
                </Link>
              </section>
            ) : null}
          </div>

          <div>
            <div className="sticky top-28">
              <PricingSidebar
                location={
                  location
                }
                room={displayRoom}
                term={term}
                offer={
                  liveOffer
                }
                allowedFloors={
                  offerData
                    ?.allowed_floors
                  ?? []
                }
                availabilityPeriod={
                  offerData
                    ?.availability
                  ?? null
                }
                availabilityError={
                  availabilityError
                }
                returnUrl={
                  locationReturnUrl
                }
              />
            </div>
          </div>
        </div>
      </section>

      {isAvailable ? (
        <BookingCTA
          location={location}
          room={displayRoom}
          term={term}
        />
      ) : null}
    </main>
  );
};

export default RoomDetails;