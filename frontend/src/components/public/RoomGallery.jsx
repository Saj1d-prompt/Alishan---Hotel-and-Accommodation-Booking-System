import {
  ImageOff,
  Images,
} from "lucide-react";

const RoomGallery = ({
  room,
}) => {
  const gallery =
    Array.isArray(
      room?.gallery,
    )
    &&
    room.gallery.length > 0
      ? room.gallery.filter(
          Boolean,
        )
      : room?.image
        ? [
            room.image,
          ]
        : [];

  if (
    gallery.length === 0
  ) {
    return (
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex min-h-[420px] items-center justify-center rounded-3xl border border-slate-200 bg-white">
            <div className="text-center text-slate-400">
              <ImageOff className="mx-auto size-12" />

              <p className="mt-4 font-semibold">
                Room photos are
                coming soon
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  /*
   * Only one image:
   * show one clean large image instead
   * of repeating the same image.
   */
  if (
    gallery.length === 1
  ) {
    return (
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-7 flex items-center gap-3">
            <Images className="text-blue-600" />

            <h2 className="text-2xl font-bold text-slate-950">
              Room Gallery
            </h2>
          </div>

          <div className="overflow-hidden rounded-3xl">
            <img
              src={
                gallery[0]
              }
              alt={`${room.title} room`}
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
    gallery.slice(
      1,
      5,
    );

  return (
    <section className="bg-slate-50 py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-7 flex items-center gap-3">
          <Images className="text-blue-600" />

          <h2 className="text-2xl font-bold text-slate-950">
            Room Gallery
          </h2>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {/* Main large image */}
          <div className="overflow-hidden rounded-3xl">
            <img
              src={
                mainImage
              }
              alt={`${room.title} room 1`}
              className="h-[440px] w-full object-cover transition duration-500 hover:scale-[1.02] lg:h-[580px]"
            />
          </div>

          {/* Right-side images */}
          <div
            className={[
              "grid gap-4",

              sideImages.length
                === 1
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
                  key={`${room.slug}-${index + 1}`}
                  className="overflow-hidden rounded-3xl"
                >
                  <img
                    src={
                      image
                    }
                    alt={`${room.title} room ${index + 2}`}
                    className="h-full min-h-[280px] w-full object-cover transition duration-500 hover:scale-105"
                  />
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoomGallery;