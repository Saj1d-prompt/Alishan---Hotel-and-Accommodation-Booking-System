import apiClient from "@/lib/apiClient";

export async function submitBookingRequest(
  formData,
) {
  const response = await apiClient.post(
    "/bookings",
    formData,
  );

  return response.data.data;
}

export async function getBookingStatus(
  bookingReference,
  accessToken,
) {
  const response = await apiClient.get(
    `/bookings/${encodeURIComponent(
      bookingReference,
    )}/status`,
    {
      params: {
        token: accessToken,
      },
    },
  );

  return response.data.data;
}