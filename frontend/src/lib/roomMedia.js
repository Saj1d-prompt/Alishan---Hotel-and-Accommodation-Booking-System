export function getRoomLocationData(
  room,
  locationSlug,
) {
  if (
    !room
    ||
    !locationSlug
  ) {
    return null;
  }

  return (
    room.locations?.[locationSlug]
    ??
    null
  );
}

export function getRoomImage(
  room,
  locationSlug,
  fallbackImage = null,
) {
  const locationData =
    getRoomLocationData(
      room,
      locationSlug,
    );

  return (
    locationData?.image
    ??
    fallbackImage
    ??
    null
  );
}

export function getRoomGallery(
  room,
  locationSlug,
  fallbackImage = null,
) {
  const locationData =
    getRoomLocationData(
      room,
      locationSlug,
    );

  if (
    Array.isArray(
      locationData?.gallery,
    )
    &&
    locationData.gallery.length > 0
  ) {
    return locationData.gallery.filter(
      Boolean,
    );
  }

  const image =
    getRoomImage(
      room,
      locationSlug,
      fallbackImage,
    );

  return image
    ? [image]
    : [];
}

export function getRoomSize(
  room,
  locationSlug,
) {
  return (
    getRoomLocationData(
      room,
      locationSlug,
    )?.size
    ??
    null
  );
}

export function isRoomAvailableAtLocation(
  room,
  locationSlug,
) {
  return Boolean(
    getRoomLocationData(
      room,
      locationSlug,
    ),
  );
}

export function getRoomPresentation(
  room,
  location,
) {
  if (!room) {
    return null;
  }

  const locationSlug =
    typeof location === "string"
      ? location
      : location?.slug;

  const fallbackImage =
    typeof location === "object"
      ? location?.image
      : null;

  const locationData =
    getRoomLocationData(
      room,
      locationSlug,
    );

  return {
    ...room,

    image:
      getRoomImage(
        room,
        locationSlug,
        fallbackImage,
      ),

    gallery:
      getRoomGallery(
        room,
        locationSlug,
        fallbackImage,
      ),

    size:
      locationData?.size
      ??
      room.size
      ??
      null,

    locationData:
      locationData
      ??
      null,
  };
}