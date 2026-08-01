import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";

import Breadcrumb from "@/components/public/Breadcrumb";
import LocationDetailsHero from "@/components/public/LocationDetailsHero";
import LocationGallery from "@/components/public/LocationGallery";
import LocationOverview from "@/components/public/LocationOverview";
import LocationAmenities from "@/components/public/LocationAmenities";
import NearbyPlaces from "@/components/public/NearbyPlaces";
import RoomTypes from "@/components/public/RoomTypes";
import BookingCTA from "@/components/public/BookingCTA";

const LocationDetails = () => {
  return (
    <>
      <Navbar />

      <main className="bg-slate-50">

        <Breadcrumb />

        <LocationDetailsHero />

        <LocationGallery />

        <LocationOverview />

        <LocationAmenities />

        <NearbyPlaces />

        <RoomTypes />

        <BookingCTA />

      </main>

      <Footer />
    </>
  );
};

export default LocationDetails;