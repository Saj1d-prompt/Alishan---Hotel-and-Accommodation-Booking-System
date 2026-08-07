import {
  Images,
} from "lucide-react";

const LocationGallery = ({
  location,
}) => {
  const gallery =
    Array.isArray(
      location?.gallery,
    )
    &&
    location.gallery.length > 0
      ? location.gallery
      : location?.image
        ? [
            location.image,
          ]
        : [];

  if (
    gallery.length === 0
  ) {
    return null;
  }

  /*
   * If we only have one photo for a location,
   * show one large image instead of repeating
   * the same image five times.
   */
  if (
    gallery.length === 1
  ) {
    return (
      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="overflow-hidden rounded-3xl">
            <img
              src={
                gallery[0]
              }
              alt={`${location.name} accommodation`}
              className="h-[420px] w-full object-cover sm:h-[520px] lg:h-[620px]"
            />
          </div>
        </div>
      </section>
    );
  }

  const mainImage =
    gallery[0];

  const sideImages =
    gallery
      .slice(
        1,
        5,
      );

  return (
    <section className="bg-slate-50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
            <Images
              size={22}
            />
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
              Gallery
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-950">
              {location.name}
            </h2>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {/* Main image */}
          <div className="overflow-hidden rounded-3xl">
            <img
              src={
                mainImage
              }
              alt={`${location.name} gallery 1`}
              className="h-[420px] w-full object-cover transition duration-500 hover:scale-[1.02] lg:h-[580px]"
            />
          </div>

          {/* Side gallery */}
          {sideImages.length > 0 ? (
            <div
              className={[
                "grid gap-4",

                sideImages.length === 1
                  ? "grid-cols-1"
                  : "grid-cols-2",
              ].join(" ")}
            >
              {sideImages.map(
                (
                  image,
                  index,
                ) => (
                  <div
                    key={`${location.slug}-${index + 1}`}
                    className="overflow-hidden rounded-3xl"
                  >
                    <img
                      src={
                        image
                      }
                      alt={`${location.name} gallery ${index + 2}`}
                      className="h-full min-h-64 w-full object-cover transition duration-500 hover:scale-105"
                    />
                  </div>
                ),
              )}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default LocationGallery;