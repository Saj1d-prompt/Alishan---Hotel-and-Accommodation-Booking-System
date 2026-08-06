import {
  ArrowLeft,
  CheckCircle2,
  Download,
  Loader2,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  Link,
  useParams,
} from "react-router-dom";

import PageContainer from "@/components/ui/PageContainer";

import {
  approveAdminBooking,
  downloadGuestDocument,
  getAdminBooking,
  rejectAdminBooking,
  rejectGuestDocument,
  verifyGuestDocument,
} from "@/services/AdminBookingApi";

export default function BookingDetails() {
  const { uuid } = useParams();

  const [
    booking,
    setBooking,
  ] = useState(null);

  const [
    availableRooms,
    setAvailableRooms,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    actionLoading,
    setActionLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    roomUuid,
    setRoomUuid,
  ] = useState("");

  const [
    payableAmount,
    setPayableAmount,
  ] = useState("");

  const [
    paymentDueAt,
    setPaymentDueAt,
  ] = useState("");

  const [
    rejectionReason,
    setRejectionReason,
  ] = useState("");

  const [
    documentRejectionReason,
    setDocumentRejectionReason,
  ] = useState("");

  const loadBooking =
    useCallback(async () => {
      setLoading(true);
      setError("");

      try {
        const response =
          await getAdminBooking(
            uuid,
          );

        setBooking(
          response.booking,
        );

        setAvailableRooms(
          response
            .available_rooms
          ?? [],
        );
      } catch (
        requestError
      ) {
        setError(
          requestError
            .response
            ?.data
            ?.message
          ?? "The booking could not be loaded.",
        );
      } finally {
        setLoading(false);
      }
    }, [uuid]);

  useEffect(() => {
    loadBooking();
  }, [loadBooking]);

  if (loading) {
    return (
      <PageContainer>
        <div className="flex min-h-96 items-center justify-center">
          <Loader2 className="size-10 animate-spin text-indigo-600" />
        </div>
      </PageContainer>
    );
  }

  if (
    error
    || !booking
  ) {
    return (
      <PageContainer>
        <p className="text-red-600">
          {error}
        </p>
      </PageContainer>
    );
  }

  const document =
    booking
      .passport_documents?.[0];

  const passportVerified =
    document?.status
    === "verified";

  const performAction =
    async (callback) => {
      setActionLoading(true);
      setError("");

      try {
        await callback();
        await loadBooking();
      } catch (
        requestError
      ) {
        const errors =
          requestError
            .response
            ?.data
            ?.errors;

        const firstError =
          errors
            ? Object.values(
                errors,
              )[0]?.[0]
            : null;

        setError(
          firstError
          ?? requestError
            .response
            ?.data
            ?.message
          ?? "The action could not be completed.",
        );
      } finally {
        setActionLoading(false);
      }
    };

  const handleApprove = () =>
    performAction(
      async () => {
        await approveAdminBooking(
          booking.uuid,
          {
            room_uuid:
              roomUuid,

            payable_amount:
              payableAmount,

            payment_due_at:
              paymentDueAt,
          },
        );
      },
    );

  const handleRejectBooking =
    () =>
      performAction(
        async () => {
          await rejectAdminBooking(
            booking.uuid,
            rejectionReason,
          );
        },
      );

  const handleVerifyDocument =
    () =>
      performAction(
        async () => {
          await verifyGuestDocument(
            document.uuid,
          );
        },
      );

  const handleRejectDocument =
    () =>
      performAction(
        async () => {
          await rejectGuestDocument(
            document.uuid,
            documentRejectionReason,
          );
        },
      );

  return (
    <PageContainer>
      <Link
        to="/admin/bookings"
        className="inline-flex items-center gap-2 font-medium text-slate-600 hover:text-indigo-600"
      >
        <ArrowLeft size={18} />
        Back to Bookings
      </Link>

      <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-600">
            Booking Application
          </p>

          <h1 className="mt-2 text-4xl font-bold text-slate-950">
            {
              booking.booking_reference
            }
          </h1>
        </div>

        <span className="w-fit rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold capitalize text-slate-700">
          {booking.status.replaceAll(
            "_",
            " ",
          )}
        </span>
      </div>

      {error ? (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      ) : null}

      <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="space-y-8">
          <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-950">
              Applicant
            </h2>

            <dl className="mt-6 grid gap-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm text-slate-500">
                  Name
                </dt>

                <dd className="mt-1 font-semibold text-slate-900">
                  {
                    booking.guest.name
                  }
                </dd>
              </div>

              <div>
                <dt className="text-sm text-slate-500">
                  Email
                </dt>

                <dd className="mt-1 font-semibold text-slate-900">
                  {
                    booking.guest.email
                  }
                </dd>
              </div>

              <div>
                <dt className="text-sm text-slate-500">
                  Phone
                </dt>

                <dd className="mt-1 font-semibold text-slate-900">
                  {
                    booking.guest.phone
                  }
                </dd>
              </div>

              <div>
                <dt className="text-sm text-slate-500">
                  Passport
                </dt>

                <dd className="mt-1 font-semibold text-slate-900">
                  {
                    booking
                      .guest
                      .passport_number
                  }
                </dd>
              </div>
            </dl>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-950">
              Accommodation
            </h2>

            <dl className="mt-6 grid gap-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm text-slate-500">
                  Property
                </dt>

                <dd className="mt-1 font-semibold">
                  {
                    booking
                      .property
                      .name
                  }
                </dd>
              </div>

              <div>
                <dt className="text-sm text-slate-500">
                  Room Type
                </dt>

                <dd className="mt-1 font-semibold">
                  {
                    booking
                      .room_type
                      .name
                  }
                </dd>
              </div>

              <div>
                <dt className="text-sm text-slate-500">
                  Occupants
                </dt>

                <dd className="mt-1 font-semibold">
                  {
                    booking.guest_count
                  }
                </dd>
              </div>

              <div>
                <dt className="text-sm text-slate-500">
                  Contract
                </dt>

                <dd className="mt-1 font-semibold">
                  {
                    booking
                      .contract
                      .name
                  }
                </dd>
              </div>

              <div>
                <dt className="text-sm text-slate-500">
                  Check In
                </dt>

                <dd className="mt-1 font-semibold">
                  {
                    booking
                      .check_in_date
                  }
                </dd>
              </div>

              <div>
                <dt className="text-sm text-slate-500">
                  Check Out
                </dt>

                <dd className="mt-1 font-semibold">
                  {
                    booking
                      .check_out_date
                  }
                </dd>
              </div>
            </dl>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
            <div className="flex items-center gap-3">
              <ShieldCheck className="size-6 text-indigo-600" />

              <h2 className="text-2xl font-bold text-slate-950">
                Passport Proof
              </h2>
            </div>

            {!document ? (
              <p className="mt-5 text-red-600">
                No passport document is attached.
              </p>
            ) : (
              <>
                <div className="mt-6 rounded-2xl bg-slate-50 p-5">
                  <p className="font-semibold text-slate-900">
                    {
                      document.original_name
                    }
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Status:{" "}
                    <span className="font-semibold capitalize">
                      {
                        document.status
                      }
                    </span>
                  </p>

                  {document.rejection_reason ? (
                    <p className="mt-3 text-sm text-red-600">
                      {
                        document
                          .rejection_reason
                      }
                    </p>
                  ) : null}
                </div>

                <button
                  type="button"
                  onClick={() =>
                    downloadGuestDocument(
                      document.uuid,
                      document.original_name,
                    )
                  }
                  className="mt-5 inline-flex items-center gap-2 rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700"
                >
                  <Download size={18} />
                  Download Passport
                </button>

                {booking.status
                  === "pending_review" ? (
                  <div className="mt-6 border-t border-slate-200 pt-6">
                    <button
                      type="button"
                      disabled={
                        actionLoading
                      }
                      onClick={
                        handleVerifyDocument
                      }
                      className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white disabled:opacity-50"
                    >
                      <CheckCircle2 size={18} />
                      Verify Passport
                    </button>

                    <textarea
                      rows={3}
                      value={
                        documentRejectionReason
                      }
                      onChange={(event) =>
                        setDocumentRejectionReason(
                          event.target.value,
                        )
                      }
                      placeholder="Reason for rejecting passport proof"
                      className="mt-5 w-full rounded-xl border border-slate-300 p-3"
                    />

                    <button
                      type="button"
                      disabled={
                        actionLoading
                        || !documentRejectionReason.trim()
                      }
                      onClick={
                        handleRejectDocument
                      }
                      className="mt-3 inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 font-semibold text-white disabled:opacity-50"
                    >
                      <XCircle size={18} />
                      Reject Passport
                    </button>
                  </div>
                ) : null}
              </>
            )}
          </section>
        </div>

        <aside className="space-y-8">
          <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
              Pricing
            </p>

            <p className="mt-4 text-3xl font-bold text-slate-950">
              €
              {
                booking
                  .pricing
                  .unit_price
              }
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Per person /{" "}
              {
                booking
                  .contract
                  .billing_unit
              }
            </p>

            <div className="mt-6 rounded-2xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">
                Estimated total
              </p>

              <p className="mt-1 text-2xl font-bold">
                €
                {
                  booking
                    .estimated_total_amount
                }
              </p>
            </div>
          </section>

          {booking.status
            === "pending_review" ? (
            <>
              <section className="rounded-3xl border border-emerald-200 bg-white p-7 shadow-sm">
                <h2 className="text-xl font-bold text-slate-950">
                  Approve Booking
                </h2>

                {!passportVerified ? (
                  <p className="mt-4 rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
                    Verify the passport proof before approval.
                  </p>
                ) : null}

                <label className="mt-5 block text-sm font-semibold">
                  Physical Room
                </label>

                <select
                  value={roomUuid}
                  onChange={(event) =>
                    setRoomUuid(
                      event.target.value,
                    )
                  }
                  className="mt-2 h-11 w-full rounded-xl border border-slate-300 px-3"
                >
                  <option value="">
                    Select room
                  </option>

                  {availableRooms.map(
                    (room) => (
                      <option
                        key={room.uuid}
                        value={room.uuid}
                      >
                        {room.room_number}
                        {" · Floor "}
                        {room.floor ?? "—"}
                        {" · Capacity "}
                        {room.capacity}
                      </option>
                    ),
                  )}
                </select>

                {availableRooms.length
                  === 0 ? (
                  <p className="mt-3 text-sm text-amber-700">
                    No active verified physical rooms currently match this request.
                  </p>
                ) : null}

                <label className="mt-5 block text-sm font-semibold">
                  Payable Amount (€)
                </label>

                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={
                    payableAmount
                  }
                  onChange={(event) =>
                    setPayableAmount(
                      event.target.value,
                    )
                  }
                  className="mt-2 h-11 w-full rounded-xl border border-slate-300 px-3"
                />

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  This is the amount Stripe will collect later. Do not guess the client&apos;s long-term payment policy.
                </p>

                <label className="mt-5 block text-sm font-semibold">
                  Payment Deadline
                </label>

                <input
                  type="datetime-local"
                  value={
                    paymentDueAt
                  }
                  onChange={(event) =>
                    setPaymentDueAt(
                      event.target.value,
                    )
                  }
                  className="mt-2 h-11 w-full rounded-xl border border-slate-300 px-3"
                />

                <button
                  type="button"
                  disabled={
                    actionLoading
                    || !passportVerified
                    || !roomUuid
                    || !payableAmount
                    || !paymentDueAt
                  }
                  onClick={
                    handleApprove
                  }
                  className="mt-6 flex w-full items-center justify-center rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {actionLoading
                    ? "Processing..."
                    : "Approve & Request Payment"}
                </button>
              </section>

              <section className="rounded-3xl border border-red-200 bg-white p-7 shadow-sm">
                <h2 className="text-xl font-bold text-slate-950">
                  Reject Booking
                </h2>

                <textarea
                  rows={4}
                  value={
                    rejectionReason
                  }
                  onChange={(event) =>
                    setRejectionReason(
                      event.target.value,
                    )
                  }
                  placeholder="Explain why the application is being rejected"
                  className="mt-5 w-full rounded-xl border border-slate-300 p-3"
                />

                <button
                  type="button"
                  disabled={
                    actionLoading
                    || !rejectionReason.trim()
                  }
                  onClick={
                    handleRejectBooking
                  }
                  className="mt-4 w-full rounded-xl bg-red-600 px-5 py-3 font-semibold text-white disabled:opacity-40"
                >
                  Reject Booking
                </button>
              </section>
            </>
          ) : (
            <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
              <h2 className="text-xl font-bold">
                Review Complete
              </h2>

              {booking.assigned_room ? (
                <p className="mt-4 text-slate-600">
                  Assigned room:{" "}
                  <strong>
                    {
                      booking
                        .assigned_room
                        .room_number
                    }
                  </strong>
                </p>
              ) : null}

              {booking.payable_amount ? (
                <p className="mt-3 text-slate-600">
                  Payable amount:{" "}
                  <strong>
                    €
                    {
                      booking
                        .payable_amount
                    }
                  </strong>
                </p>
              ) : null}

              {booking.rejection_reason ? (
                <p className="mt-3 text-red-600">
                  {
                    booking
                      .rejection_reason
                  }
                </p>
              ) : null}
            </section>
          )}
        </aside>
      </div>
    </PageContainer>
  );
}