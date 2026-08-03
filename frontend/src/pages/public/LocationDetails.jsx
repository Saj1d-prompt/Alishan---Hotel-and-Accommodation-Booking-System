import {
  Link,
  useParams,
  useSearchParams,
} from "react-router-dom";

import locations from "@/data/locations";

import Breadcrumb from "@/components/public/Breadcrumb";
import LocationDetailsHero from "@/components/public/LocationDetailsHero";
import LocationGallery from "@/components/public/LocationGallery";
import LocationOverview from "@/components/public/LocationOverview";
import LocationAmenities from "@/components/public/LocationAmenities";
import NearbyPlaces from "@/components/public/NearbyPlaces";
import RoomTypes from "@/components/public/RoomTypes";
import BookingCTA from "@/components/public/BookingCTA";
import TermSelector from "@/components/public/TermSelector";

const LocationDetails = () => {
  const { slug } = useParams();

  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams();

  const location = locations.find(
    (item) => item.slug === slug
  );

  if (!location) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-6 pt-20">
        <div className="max-w-lg text-center">

          <h1 className="text-4xl font-bold text-slate-900">
            Location Not Found
          </h1>

          <p className="mt-4 text-lg text-slate-600">
            The accommodation location you requested
            could not be found.
          </p>

          <Link
            to="/locations"
            className="mt-8 inline-flex rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            View Locations
          </Link>

        </div>
      </main>
    );
  }

  const requestedTerm =
    searchParams.get("term");

  const selectedTerm =
    location.allowedTerms.includes(
      requestedTerm
    )
      ? requestedTerm
      : location.defaultTerm;

  const handleTermChange = (term) => {
    const nextParams =
      new URLSearchParams(
        searchParams
      );

    nextParams.set("term", term);

    setSearchParams(
      nextParams,
      {
        replace: true,
      }
    );
  };

  return (
    <main className="bg-slate-50 pt-20">

      <Breadcrumb location={location} />

      <LocationDetailsHero
        location={location}
        selectedTerm={selectedTerm}
      />

      <LocationGallery location={location} />

      <LocationOverview
        location={location}
        selectedTerm={selectedTerm}
      />

      <TermSelector
        location={location}
        selectedTerm={selectedTerm}
        onTermChange={handleTermChange}
      />

      <LocationAmenities location={location} />

      <NearbyPlaces location={location} />

      <RoomTypes
        location={location}
        selectedTerm={selectedTerm}
      />

      <BookingCTA
        location={location}
        term={selectedTerm}
      />

    </main>
  );
};

export default LocationDetails;