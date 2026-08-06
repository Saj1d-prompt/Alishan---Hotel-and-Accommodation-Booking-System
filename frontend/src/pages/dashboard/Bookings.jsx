import {
  CalendarDays,
  Loader2,
  Search,
} from "lucide-react";
import {
  useEffect,
  useState,
} from "react";
import {
  Link,
} from "react-router-dom";

import PageContainer from "@/components/ui/PageContainer";
import {
  getAdminBookings,
} from "@/services/AdminBookingApi";

const STATUS_OPTIONS = [
  {
    value: "",
    label: "All statuses",
  },
  {
    value: "pending_review",
    label: "Pending Review",
  },
  {
    value: "awaiting_payment",
    label: "Awaiting Payment",
  },
  {
    value: "confirmed",
    label: "Confirmed",
  },
  {
    value: "rejected",
    label: "Rejected",
  },
  {
    value: "cancelled",
    label: "Cancelled",
  },
];

const statusStyles = {
  pending_review:
    "bg-amber-100 text-amber-800",

  awaiting_payment:
    "bg-blue-100 text-blue-800",

  confirmed:
    "bg-emerald-100 text-emerald-800",

  rejected:
    "bg-red-100 text-red-800",

  cancelled:
    "bg-slate-100 text-slate-700",
};

function statusLabel(status) {
  return status
    .split("_")
    .map(
      (part) =>
        part.charAt(0).toUpperCase()
        + part.slice(1),
    )
    .join(" ");
}

export default function Bookings() {
  const [
    bookings,
    setBookings,
  ] = useState([]);

  const [
    meta,
    setMeta,
  ] = useState(null);

  const [
    status,
    setStatus,
  ] = useState(
    "pending_review",
  );

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    submittedSearch,
    setSubmittedSearch,
  ] = useState("");

  const [
    page,
    setPage,
  ] = useState(1);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadBookings =
      async () => {
        setLoading(true);
        setError("");

        try {
          const response =
            await getAdminBookings({
              page,

              status:
                status || undefined,

              search:
                submittedSearch
                || undefined,
            });

          if (!mounted) {
            return;
          }

          setBookings(
            response.data ?? [],
          );

          setMeta(
            response.meta ?? null,
          );
        } catch (
          requestError
        ) {
          if (mounted) {
            setError(
              requestError
                .response
                ?.data
                ?.message
              ?? "Bookings could not be loaded.",
            );
          }
        } finally {
          if (mounted) {
            setLoading(false);
          }
        }
      };

    loadBookings();

    return () => {
      mounted = false;
    };
  }, [
    page,
    status,
    submittedSearch,
  ]);

  const handleSearch =
    (event) => {
      event.preventDefault();

      setPage(1);

      setSubmittedSearch(
        search.trim(),
      );
    };

  return (
    <PageContainer>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-600">
            Administration
          </p>

          <h1 className="mt-2 text-4xl font-bold text-slate-950">
            Booking Applications
          </h1>

          <p className="mt-2 text-slate-600">
            Review applicant details,
            passport proof and room
            requests.
          </p>
        </div>
      </div>

      <div className="mt-8 rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-200 p-5 lg:flex-row">
          <form
            onSubmit={handleSearch}
            className="flex flex-1 gap-3"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 size-5 text-slate-400" />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value,
                  )
                }
                placeholder="Reference, name, email or phone"
                className="h-11 w-full rounded-xl border border-slate-300 pl-11 pr-4 outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="rounded-xl bg-indigo-600 px-5 font-semibold text-white hover:bg-indigo-700"
            >
              Search
            </button>
          </form>

          <select
            value={status}
            onChange={(event) => {
              setStatus(
                event.target.value,
              );

              setPage(1);
            }}
            className="h-11 rounded-xl border border-slate-300 bg-white px-4"
          >
            {STATUS_OPTIONS.map(
              (option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              ),
            )}
          </select>
        </div>

        {loading ? (
          <div className="flex min-h-72 items-center justify-center">
            <Loader2 className="size-9 animate-spin text-indigo-600" />
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-600">
            {error}
          </div>
        ) : bookings.length === 0 ? (
          <div className="p-12 text-center">
            <CalendarDays className="mx-auto size-10 text-slate-400" />

            <h2 className="mt-4 text-xl font-bold text-slate-900">
              No booking applications
            </h2>

            <p className="mt-2 text-slate-500">
              No records match the
              selected filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-5 py-4">
                    Reference
                  </th>

                  <th className="px-5 py-4">
                    Applicant
                  </th>

                  <th className="px-5 py-4">
                    Property
                  </th>

                  <th className="px-5 py-4">
                    Room Type
                  </th>

                  <th className="px-5 py-4">
                    Status
                  </th>

                  <th className="px-5 py-4">
                    Submitted
                  </th>

                  <th className="px-5 py-4" />
                </tr>
              </thead>

              <tbody>
                {bookings.map(
                  (booking) => (
                    <tr
                      key={
                        booking.uuid
                      }
                      className="border-t border-slate-100"
                    >
                      <td className="px-5 py-4 font-semibold text-slate-900">
                        {
                          booking.booking_reference
                        }
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-medium text-slate-900">
                          {
                            booking
                              .guest
                              .name
                          }
                        </p>

                        <p className="text-slate-500">
                          {
                            booking
                              .guest
                              .email
                          }
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        {
                          booking
                            .property
                            .name
                        }
                      </td>

                      <td className="px-5 py-4">
                        {
                          booking
                            .room_type
                            .name
                        }
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            statusStyles[
                              booking
                                .status
                            ]
                            ?? "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {statusLabel(
                            booking.status,
                          )}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        {booking
                          .submitted_at
                          ? new Date(
                              booking
                                .submitted_at,
                            ).toLocaleString()
                          : "—"}
                      </td>

                      <td className="px-5 py-4 text-right">
                        <Link
                          to={`/admin/bookings/${booking.uuid}`}
                          className="font-semibold text-indigo-600 hover:text-indigo-800"
                        >
                          Review
                        </Link>
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        )}

        {meta ? (
          <div className="flex items-center justify-between border-t border-slate-200 p-5">
            <p className="text-sm text-slate-500">
              Page {meta.current_page} of{" "}
              {meta.last_page}
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                disabled={
                  meta.current_page <= 1
                }
                onClick={() =>
                  setPage(
                    (current) =>
                      Math.max(
                        1,
                        current - 1,
                      ),
                  )
                }
                className="rounded-lg border border-slate-300 px-4 py-2 disabled:opacity-40"
              >
                Previous
              </button>

              <button
                type="button"
                disabled={
                  meta.current_page
                  >= meta.last_page
                }
                onClick={() =>
                  setPage(
                    (current) =>
                      current + 1,
                  )
                }
                className="rounded-lg border border-slate-300 px-4 py-2 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </PageContainer>
  );
}