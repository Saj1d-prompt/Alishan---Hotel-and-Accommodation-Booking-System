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
import RoomGallery from "@/components/public/RoomGallery";
import RoomOverview from "@/components/public/RoomOverview";

import locations from "@/data/locations";
import roomTypes from "@/data/roomTypes";

import {
  getRoomRate,
  isTermAllowed,
} from "@/lib/accommodation";

const RoomDetails = () => {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();

  const room = roomTypes.find(
    (item) => item.slug === slug
  );

  if (!room) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-6 pt-20">
        <div className="max-w-lg text-center">
          <h1 className="text-4xl font-bold text-slate-900">
            Room Type Not Found
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
      : null;

  const rate =
    location && term
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

  if (!offerIsAvailable) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-6 pt-20">
        <div className="max-w-xl rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <h1 className="text-4xl font-bold text-slate-900">
            Choose a Location First
          </h1>

          <p className="mt-5 text-lg leading-8 text-slate-600">
            Room pricing depends on the selected
            location and accommodation term. Return
            to Locations and select the room from a
            location page.
          </p>

          <Link
            to="/locations"
            className="mt-8 inline-flex rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Choose Location
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-slate-50 pt-20">
      <Breadcrumb
        location={location}
        room={room}
        term={term}
      />

      <RoomDetailsHero room={room} />

      <RoomGallery room={room} />

      <section className="py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[minmax(0,1fr)_390px] lg:px-8">
          <div className="space-y-16">
            <RoomOverview room={room} />
            <RoomAmenities room={room} />
          </div>

          <div>
            <div className="sticky top-28">
              <PricingSidebar
                location={location}
                room={room}
                term={term}
              />
            </div>
          </div>
        </div>
      </section>

      <BookingCTA
        location={location}
        room={room}
        term={term}
      />
    </main>
  );
};

export default RoomDetails;