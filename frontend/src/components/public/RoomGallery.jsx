const RoomGallery = ({ room }) => {

    const gallery = room.gallery || [
        room.image,
        room.image,
        room.image,
        room.image,
        room.image,
    ];

    return (

        <section className="py-20">

            <div className="mx-auto max-w-7xl px-6">

                <div className="grid gap-4 lg:grid-cols-4">

                    <img
                        src={gallery[0]}
                        className="col-span-2 h-[520px] w-full rounded-3xl object-cover"
                        alt=""
                    />

                    {gallery.slice(1).map((img, i) => (

                        <img
                            key={i}
                            src={img}
                            className="h-60 w-full rounded-3xl object-cover"
                            alt=""
                        />

                    ))}

                </div>

            </div>

        </section>

    );
};

export default RoomGallery;