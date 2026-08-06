import apiClient from "@/lib/apiClient";

export async function getLocationRoomTypeOffers(
  locationSlug,
  {
    term,
    occupants = 1,
    startDate = null,
    endDate = null,
  },
) {
  const params = {
    term,
    occupants,
  };

  if (startDate) {
    params.start_date =
      startDate;
  }

  if (endDate) {
    params.end_date =
      endDate;
  }

  const response =
    await apiClient.get(
      `/locations/${encodeURIComponent(
        locationSlug,
      )}/room-types`,
      {
        params,
      },
    );

  return response.data.data;
}