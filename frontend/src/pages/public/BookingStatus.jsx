import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileCheck2,
  Loader2,
  MapPin,
  Users,
} from "lucide-react";
import {
  useEffect,
  useState,
} from "react";
import {
  Link,
  useParams,
  useSearchParams,
} from "react-router-dom";

import {
  getBookingStatus,
} from "@/services/bookingApi";

const statusStyles = {
  pending_review:
    "border-amber-200 bg-amber-50 text-amber-800",

  awaiting_payment:
    "border-blue-200 bg-blue-50 text-blue-800",

  confirmed:
    "border-emerald-200 bg-emerald-50 text-emerald-800",

  rejected:
    "border-red-200 bg-red-50 text-red-800",

  payment_expired:
    "border-orange-200 bg-orange-50 text-orange-800",

  cancelled:
    "border-slate-200 bg-slate-100 text-slate-700",

  checked_in:
    "border-indigo-200 bg-indigo-50 text-indigo-800",

  checked_out:
    "border-slate-200 bg-slate-100 text-slate-700",
};

const statusMessages = {
  pending_review:
    "Your information and passport proof have been submitted. Admin review is pending.",

  awaiting_payment:
    "Your booking has been approved. The secure payment action will appear here after Stripe is connected.",

  confirmed:
    "Payment has been received and the booking is confirmed.",

  rejected:
    "The booking request was not approved. Review the reason below.",

  payment_expired:
    "The payment period expired. Contact Alishan Accommodation for assistance.",

  cancelled:
    "This booking has been cancelled.",

  checked_in:
    "The guest has checked in.",

  checked_out:
    "The stay has been completed.",
};

const BookingStatus = () => {
  const { reference } =
    useParams();

  const [searchParams] =
    useSearchParams();

  const accessToken =
    searchParams.get("token");

  const [
    booking,
    setBooking,
  ] = useState(null);

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadStatus = async () => {
      if (
        !reference
        || !accessToken
      ) {
        setError(
          "The booking status link is incomplete.",
        );

        setIsLoading(false);

        return;
      }

      try {
        const result =
          await getBookingStatus(
            reference,
            accessToken,
          );

        if (isMounted) {
          setBooking(result);
        }
      } catch {
        if (isMounted) {
          setError(
            "The booking could not be found, or the secure access token is invalid.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadStatus();

    return () => {
      isMounted = false;
    };
  }, [
    reference,
    accessToken,
  ]);

  if (isLoading) {
    return (
      <main className="flex min-h-[75vh] items-center justify-center bg-slate-50 px-6 pt-20">
        <div className="text-center">
          <Loader2 className="mx-auto size-11 animate-spin text-blue-600" />

          <p className="mt-4 font-medium text-slate-600">
            Loading booking status...
          </p>
        </div>
      </main>
    );
  }

  if (
    error
    || !booking
  ) {
    return (
      <main className="min-h-[75vh] bg-slate-50 px-6 pb-20 pt-36">
        <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <AlertCircle className="mx-auto size-12 text-red-500" />

          <h1 className="mt-5 text-4xl font-bold text-slate-950">
            Status Unavailable
          </h1>

          <p className="mt-5 text-lg leading-8 text-slate-600">
            {error}
          </p>

          <Link
            to="/locations"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            <ArrowLeft size={18} />
            Return to Locations
          </Link>
        </div>
      </main>
    );
  }

  const statusClass =
    statusStyles[
      booking.status
    ]
    ?? statusStyles.cancelled;

  return (
    <main className="min-h-screen bg-slate-50 px-6 pb-24 pt-32">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <span className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">
                Booking Status
              </span>

              <h1 className="mt-4 text-4xl font-bold text-slate-950">
                {
                  booking
                    .booking_reference
                }
              </h1>
            </div>

            <span
              className={`inline-flex w-fit rounded-full border px-4 py-2 text-sm font-semibold ${statusClass}`}
            >
              {
                booking
                  .status_label
              }
            </span>
          </div>

          <div className="mt-8 rounded-2xl bg-slate-50 p-5">
            <div className="flex items-start gap-3">
              {booking.status
                === "confirmed" ? (
                <CheckCircle2 className="mt-0.5 size-6 shrink-0 text-emerald-600" />
              ) : (
                <Clock3 className="mt-0.5 size-6 shrink-0 text-blue-600" />
              )}

              <p className="leading-7 text-slate-700">
                {
                  statusMessages[
                    booking.status
                  ]
                  ?? "The booking status has been updated."
                }
              </p>
            </div>
          </div>

          {booking
            .review
            ?.rejection_reason ? (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5">
              <p className="text-sm font-semibold uppercase tracking-wider text-red-700">
                Rejection reason
              </p>

              <p className="mt-2 leading-7 text-red-800">
                {
                  booking
                    .review
                    .rejection_reason
                }
              </p>
            </div>
          ) : null}

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <div className="flex items-start gap-3 rounded-2xl border border-slate-200 p-5">
              <MapPin className="mt-0.5 size-5 shrink-0 text-blue-600" />

              <div>
                <p className="text-sm text-slate-500">
                  Location
                </p>

                <p className="mt-1 font-semibold text-slate-950">
                  {
                    booking
                      .property
                      .name
                  }
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-slate-200 p-5">
              <Users className="mt-0.5 size-5 shrink-0 text-blue-600" />

              <div>
                <p className="text-sm text-slate-500">
                  Room and occupants
                </p>

                <p className="mt-1 font-semibold text-slate-950">
                  {
                    booking
                      .stay
                      .room_type
                  }{" "}
                  ·{" "}
                  {
                    booking
                      .stay
                      .occupants
                  }
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-slate-200 p-5">
              <CalendarDays className="mt-0.5 size-5 shrink-0 text-blue-600" />

              <div>
                <p className="text-sm text-slate-500">
                  Stay period
                </p>

                <p className="mt-1 font-semibold text-slate-950">
                  {
                    booking
                      .stay
                      .check_in_date
                  }{" "}
                  to{" "}
                  {
                    booking
                      .stay
                      .check_out_date
                  }
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-slate-200 p-5">
              <FileCheck2 className="mt-0.5 size-5 shrink-0 text-blue-600" />

              <div>
                <p className="text-sm text-slate-500">
                  Passport proof
                </p>

                <p className="mt-1 font-semibold capitalize text-slate-950">
                  {
                    booking
                      .passport_proof
                      .status
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-6 rounded-2xl bg-blue-50 p-6 sm:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-blue-700">
                Rate
              </p>

              <p className="mt-1 text-2xl font-bold text-blue-950">
                €
                {
                  booking
                    .pricing
                    .unit_price
                }
              </p>

              <p className="mt-1 text-sm text-blue-700">
                Per person /{" "}
                {
                  booking
                    .stay
                    .billing_unit
                }
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-blue-700">
                Estimated total
              </p>

              <p className="mt-1 text-2xl font-bold text-blue-950">
                €
                {
                  booking
                    .pricing
                    .estimated_total_amount
                }
              </p>

              <p className="mt-1 text-sm text-blue-700">
                Payment is not due until
                Admin approval.
              </p>
            </div>
          </div>

          <p className="mt-8 text-sm leading-6 text-slate-500">
            Save this page securely. Anyone
            holding its access token can view
            this booking status.
          </p>
        </div>
      </div>
    </main>
  );
};

export default BookingStatus;