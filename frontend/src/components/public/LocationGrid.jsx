import locations from "@/data/locations";
import LocationListCard from "./LocationListCard";

const LocationGrid = () => {
  return (
    <section className="bg-slate-50 py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

          {locations.map((location) => (
            <LocationListCard
              key={location.id}
              location={location}
            />
          ))}

        </div>

      </div>
    </section>
  );
};

export default LocationGrid;