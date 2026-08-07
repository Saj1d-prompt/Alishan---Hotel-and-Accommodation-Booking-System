import axios from "axios";

const API_BASE_URL =
  (
    import.meta.env.VITE_API_BASE_URL
    ??
    "http://127.0.0.1:8000/api/v1"
  ).replace(/\/+$/, "");

export async function createBookingCheckout(
  bookingReference,
  token,
) {
  const response =
    await axios.post(
      `${API_BASE_URL}/bookings/${encodeURIComponent(
        bookingReference,
      )}/payments/checkout`,
      {
        token,
      },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      },
    );

  return (
    response.data?.data
    ??
    response.data
  );
}