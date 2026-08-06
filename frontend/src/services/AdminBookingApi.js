import apiClient from "@/lib/apiClient";

export async function getAdminBookings(
  params = {},
) {
  const response =
    await apiClient.get(
      "/admin/bookings",
      {
        params,
      },
    );

  return response.data;
}

export async function getAdminBooking(
  bookingKey,
) {
  const response =
    await apiClient.get(
      `/admin/bookings/${encodeURIComponent(
        bookingKey,
      )}`,
    );

  return response.data.data;
}

export async function approveBooking(
  bookingKey,
  payload,
) {
  const response =
    await apiClient.post(
      `/admin/bookings/${encodeURIComponent(
        bookingKey,
      )}/approve`,
      payload,
    );

  return response.data.data;
}

export async function rejectBooking(
  bookingKey,
  payload,
) {
  const response =
    await apiClient.post(
      `/admin/bookings/${encodeURIComponent(
        bookingKey,
      )}/reject`,
      payload,
    );

  return response.data.data;
}

export async function verifyGuestDocument(
  documentKey,
) {
  const response =
    await apiClient.post(
      `/admin/guest-documents/${encodeURIComponent(
        documentKey,
      )}/verify`,
    );

  return response.data.data;
}

export async function rejectGuestDocument(
  documentKey,
  payload,
) {
  const response =
    await apiClient.post(
      `/admin/guest-documents/${encodeURIComponent(
        documentKey,
      )}/reject`,
      payload,
    );

  return response.data.data;
}

export async function downloadGuestDocument(
  documentKey,
) {
  return apiClient.get(
    `/admin/guest-documents/${encodeURIComponent(
      documentKey,
    )}/download`,
    {
      responseType:
        "blob",
    },
  );
}