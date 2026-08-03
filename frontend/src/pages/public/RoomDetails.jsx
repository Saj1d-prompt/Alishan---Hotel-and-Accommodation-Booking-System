import { Link, useParams } from "react-router-dom";

import roomTypes from "@/data/roomTypes";

import Breadcrumb from "@/components/public/Breadcrumb";
import RoomDetailsHero from "@/components/public/RoomDetailsHero";
import RoomGallery from "@/components/public/RoomGallery";
import RoomOverview from "@/components/public/RoomOverview";
import RoomAmenities from "@/components/public/RoomAmenities";
import BookingCTA from "@/components/public/BookingCTA";

const RoomDetails = () => {
  const { slug } = useParams();

  const room = roomTypes.find((item) => item.slug === slug);

  if (!room) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-6 pt-20">
        <div className="max-w-lg text-center">
          <h1 className="text-4xl font-bold text-slate-900">
            Room Not Found
          </h1>

          <p className="mt-4 text-lg text-slate-600">
            The requested room type could not be found.
          </p>

          <Link
            to="/rooms"
            className="mt-8 inline-flex rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            View Rooms
          </Link>
        </div>
      </main>
    );
  }

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
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-4xl space-y-16">
            <RoomOverview room={room} />

            <RoomAmenities room={room} />
          </div>
        </div>
      </section>

      <BookingCTA room={room} />
    </main>
  );
};

export default RoomDetails;