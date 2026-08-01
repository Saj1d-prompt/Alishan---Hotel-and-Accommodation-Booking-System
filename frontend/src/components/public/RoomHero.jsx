const RoomHero = () => {
  return (
    <section className="bg-gradient-to-r from-blue-700 via-sky-600 to-cyan-500 pt-36 pb-24">

      <div className="mx-auto max-w-7xl px-6 text-center">

        <span className="rounded-full bg-white/20 px-5 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-white">
          ROOM TYPES
        </span>

        <h1 className="mt-8 text-5xl font-bold text-white lg:text-6xl">
          Choose Your Room
        </h1>

        <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-blue-100">
          Whether you prefer privacy or shared living,
          we have a room that suits your needs.
        </p>

      </div>

    </section>
  );
};

export default RoomHero;