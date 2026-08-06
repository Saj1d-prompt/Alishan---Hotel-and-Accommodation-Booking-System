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
  uuid,
) {
  const response =
    await apiClient.get(
      `/admin/bookings/${uuid}`,
    );

  return response.data.data;
}

export async function approveAdminBooking(
  uuid,
  payload,
) {
  const response =
    await apiClient.post(
      `/admin/bookings/${uuid}/approve`,
      payload,
    );

  return response.data.data;
}

export async function rejectAdminBooking(
  uuid,
  reason,
) {
  const response =
    await apiClient.post(
      `/admin/bookings/${uuid}/reject`,
      {
        reason,
      },
    );

  return response.data.data;
}

export async function verifyGuestDocument(
  uuid,
) {
  const response =
    await apiClient.post(
      `/admin/guest-documents/${uuid}/verify`,
    );

  return response.data.data;
}

export async function rejectGuestDocument(
  uuid,
  reason,
) {
  const response =
    await apiClient.post(
      `/admin/guest-documents/${uuid}/reject`,
      {
        reason,
      },
    );

  return response.data.data;
}

export async function downloadGuestDocument(
  uuid,
  filename,
) {
  const response =
    await apiClient.get(
      `/admin/guest-documents/${uuid}/download`,
      {
        responseType: "blob",
      },
    );

  const url =
    URL.createObjectURL(
      response.data,
    );

  const link =
    document.createElement("a");

  link.href = url;

  link.download =
    filename
    || "passport-document";

  document.body.appendChild(
    link,
  );

  link.click();
  link.remove();

  URL.revokeObjectURL(url);
}