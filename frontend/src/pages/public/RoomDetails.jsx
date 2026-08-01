import { useParams } from "react-router-dom";

import roomTypes from "@/data/roomTypes";

import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import BookingCTA from "@/components/public/BookingCTA";

import Breadcrumb from "@/components/public/Breadcrumb";
import RoomDetailsHero from "@/components/public/RoomDetailsHero";
import RoomGallery from "@/components/public/RoomGallery";
import RoomOverview from "@/components/public/RoomOverview";
import RoomAmenities from "@/components/public/RoomAmenities";
// import PricingSidebar from "@/components/public/PricingSidebar";

const RoomDetails = () => {
  const { slug } = useParams();

  const room = roomTypes.find(
    (item) => item.slug === slug
  );

  if (!room) {
    return (
      <>
        <Navbar />

        <div className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-6">

          <div className="text-center">

            <h1 className="text-5xl font-bold text-slate-900">
              Room Not Found
            </h1>

            <p className="mt-4 text-lg text-slate-600">
              The requested room could not be found.
            </p>

          </div>

        </div>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="bg-slate-50">

        {/* Breadcrumb */}

        <Breadcrumb
          location={{
            name: room.title,
          }}
        />

        {/* Hero */}

        <RoomDetailsHero room={room} />

        {/* Gallery */}

        <RoomGallery room={room} />

        {/* Main Content */}

        <section className="py-20">

          <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[2fr_420px]">

            {/* Left */}

            <div className="space-y-16">

              <RoomOverview room={room} />

              <RoomAmenities room={room} />

            </div>

            {/* Right */}

            <div>

              <div className="sticky top-28">

                {/* <PricingSidebar room={room} /> */}

              </div>

            </div>

          </div>

        </section>

        {/* CTA */}

        <BookingCTA />

      </main>

      <Footer />

    </>
  );
};

export default RoomDetails;