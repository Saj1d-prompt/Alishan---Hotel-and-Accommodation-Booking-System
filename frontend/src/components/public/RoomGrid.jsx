import roomTypes from "@/data/roomTypes";
import RoomCard from "./RoomCard";

const RoomGrid = () => {
  return (
    <section className="py-20">

      <div className="mx-auto max-w-7xl px-6">

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">

          {roomTypes.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
            />
          ))}

        </div>

      </div>

    </section>
  );
};

export default RoomGrid;