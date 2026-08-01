import { useParams } from "react-router-dom";

import locations from "@/data/locations";

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

    const { slug } = useParams();

    const location = locations.find(
        (item) => item.slug === slug
    );

    return (
        <>
            <Navbar />

            <main className="bg-slate-50">

                <Breadcrumb location={location} />

                <LocationDetailsHero location={location} />

                <LocationGallery location={location} />

                <LocationOverview location={location} />

                <LocationAmenities location={location} />

                <NearbyPlaces location={location} />

                <RoomTypes location={location} />

                <BookingCTA location={location} />

            </main>

            <Footer />

        </>
    );
};

export default LocationDetails;