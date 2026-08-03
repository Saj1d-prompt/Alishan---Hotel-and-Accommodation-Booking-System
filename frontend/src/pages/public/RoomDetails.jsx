import {
  Link,
  useParams,
  useSearchParams,
} from "react-router-dom";

import locations from "@/data/locations";
import roomTypes from "@/data/roomTypes";

import Breadcrumb from "@/components/public/Breadcrumb";
import BookingCTA from "@/components/public/BookingCTA";
import PricingSidebar from "@/components/public/PricingSidebar";
import RoomAmenities from "@/components/public/RoomAmenities";
import RoomDetailsHero from "@/components/public/RoomDetailsHero";
import RoomGallery from "@/components/public/RoomGallery";
import RoomOverview from "@/components/public/RoomOverview";

import {
  getRoomRate,
  isTermAllowed,
} from "@/lib/accommodation";

const RoomDetails = () => {
  const { slug } = useParams();

  const [searchParams] =
    useSearchParams();

  const room = roomTypes.find(
    (item) => item.slug === slug
  );

  if (!room) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-6 pt-20">

        <div className="max-w-lg text-center">

          <h1 className="text-4xl font-bold text-slate-900">
            Room Not Found
          </h1>

          <Link
            to="/locations"
            className="mt-8 inline-flex rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white"
          >
            View Locations
          </Link>

        </div>

      </main>
    );
  }

  const locationSlug =
    searchParams.get("location");

  const requestedTerm =
    searchParams.get("term");

  const location = locations.find(
    (item) =>
      item.slug === locationSlug
  );

  const term =
    location &&
    isTermAllowed(
      location,
      requestedTerm
    )
      ? requestedTerm
      : location?.defaultTerm ?? null;

  const rate = location
    ? getRoomRate(
        location,
        term,
        room.capacity
      )
    : null;

  const offerIsAvailable =
    Boolean(location) &&
    Boolean(term) &&
    rate !== null;

  return (
    <main className="bg-slate-50 pt-20">

      <Breadcrumb
        location={{
          name: room.title,
        }}
      />

      <RoomDetailsHero room={room} />

      <RoomGallery room={room} />

      <section className="py-20">

        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[minmax(0,1fr)_390px]">

          <div className="space-y-16">

            <RoomOverview room={room} />

            <RoomAmenities room={room} />

          </div>

          <div>

            <div className="sticky top-28">

              {offerIsAvailable ? (
                <PricingSidebar
                  location={location}
                  room={room}
                  term={term}
                />
              ) : (
                <PricingSidebar
                  location={null}
                  room={room}
                  term={null}
                />
              )}

            </div>

          </div>

        </div>

      </section>

      <BookingCTA
        location={
          offerIsAvailable
            ? location
            : null
        }
        room={
          offerIsAvailable
            ? room
            : null
        }
        term={
          offerIsAvailable
            ? term
            : null
        }
      />

    </main>
  );
};

export default RoomDetails;