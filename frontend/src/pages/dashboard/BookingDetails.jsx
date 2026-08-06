import {
  AlertCircle,
  ArrowLeft,
  BedDouble,
  CalendarDays,
  CheckCircle2,
  Download,
  FileCheck2,
  Loader2,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  ShieldCheck,
  UserRound,
  Users,
  XCircle,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import BookingApprovalPanel from "@/components/admin/BookingApprovalPanel";
import PageContainer from "@/components/ui/PageContainer";

import {
  approveBooking,
  downloadGuestDocument,
  getAdminBooking,
  rejectBooking,
  rejectGuestDocument,
  verifyGuestDocument,
} from "@/services/AdminBookingApi";

const STATUS_LABELS = {
  pending_review: "Pending Review",
  awaiting_payment: "Awaiting Payment",
  confirmed: "Confirmed",
  rejected: "Rejected",
  payment_expired: "Payment Expired",
  cancelled: "Cancelled",
  checked_in: "Checked In",
  checked_out: "Checked Out",
};

const STATUS_CLASSES = {
  pending_review:
    "bg-amber-100 text-amber-800",

  awaiting_payment:
    "bg-blue-100 text-blue-800",

  confirmed:
    "bg-emerald-100 text-emerald-800",

  rejected:
    "bg-red-100 text-red-800",

  payment_expired:
    "bg-red-100 text-red-800",

  cancelled:
    "bg-slate-200 text-slate-700",

  checked_in:
    "bg-emerald-100 text-emerald-800",

  checked_out:
    "bg-slate-200 text-slate-700",
};

const PASSPORT_STATUS_CLASSES = {
  pending:
    "bg-amber-100 text-amber-800",

  verified:
    "bg-emerald-100 text-emerald-800",

  rejected:
    "bg-red-100 text-red-800",
};

function formatMoney(
  value,
  currency = "EUR",
) {
  if (
    value === null
    ||
    value === undefined
    ||
    value === ""
  ) {
    return "—";
  }

  const amount =
    Number(value);

  if (
    !Number.isFinite(
      amount,
    )
  ) {
    return String(value);
  }

  try {
    return new Intl.NumberFormat(
      "en-IE",
      {
        style: "currency",

        currency:
          currency || "EUR",

        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      },
    ).format(amount);
  } catch {
    return `€${amount.toFixed(
      2,
    )}`;
  }
}

function formatDate(
  value,
) {
  if (!value) {
    return "—";
  }

  const date =
    /^\d{4}-\d{2}-\d{2}$/.test(
      value,
    )
      ? new Date(
          `${value}T00:00:00`,
        )
      : new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return value;
  }

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  ).format(date);
}

function formatDateTime(
  value,
) {
  if (!value) {
    return "—";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return value;
  }

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",

      timeZone:
        "Europe/Vilnius",
    },
  ).format(date);
}

function formatFileSize(
  bytes,
) {
  const numericBytes =
    Number(bytes);

  if (
    !Number.isFinite(
      numericBytes,
    )
    ||
    numericBytes <= 0
  ) {
    return null;
  }

  if (
    numericBytes < 1024
  ) {
    return `${numericBytes} B`;
  }

  if (
    numericBytes
    < 1024 * 1024
  ) {
    return `${(
      numericBytes / 1024
    ).toFixed(1)} KB`;
  }

  return `${(
    numericBytes
    /
    (1024 * 1024)
  ).toFixed(1)} MB`;
}

function getErrorMessage(
  error,
  fallback,
) {
  const validationErrors =
    error
      ?.response
      ?.data
      ?.errors;

  if (validationErrors) {
    const message =
      Object.values(
        validationErrors,
      )
        .flat()
        .join(" ");

    if (message) {
      return message;
    }
  }

  return (
    error
      ?.response
      ?.data
      ?.message
    ??
    fallback
  );
}

function InfoItem({
  icon: Icon,
  label,
  children,
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
        <Icon
          size={18}
        />
      </div>

      <div className="min-w-0">
        <p className="text-sm text-slate-500">
          {label}
        </p>

        <div className="mt-1 break-words font-semibold text-slate-900">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function BookingDetails() {
  const params =
    useParams();

  const bookingKey =
    params.uuid
    ??
    params.booking
    ??
    params.bookingUuid
    ??
    params.id;

  const [
    refreshVersion,
    setRefreshVersion,
  ] = useState(0);

  const requestKey =
    useMemo(
      () =>
        `${
          bookingKey ?? ""
        }|${refreshVersion}`,
      [
        bookingKey,
        refreshVersion,
      ],
    );

  const [
    requestState,
    setRequestState,
  ] = useState({
    key: null,
    booking: null,
    availableRooms: [],
    error: null,
  });

  const [
    actionLoading,
    setActionLoading,
  ] = useState(false);

  const [
    rejectionReason,
    setRejectionReason,
  ] = useState("");

  const [
    rejectionError,
    setRejectionError,
  ] = useState("");

  const [
    documentAction,
    setDocumentAction,
  ] = useState("");

  const [
    passportRejectionReason,
    setPassportRejectionReason,
  ] = useState("");

  const [
    documentError,
    setDocumentError,
  ] = useState("");

  useEffect(() => {
    if (!bookingKey) {
      return undefined;
    }

    let cancelled =
      false;

    getAdminBooking(
      bookingKey,
    )
      .then((data) => {
        if (cancelled) {
          return;
        }

        setRequestState({
          key:
            requestKey,

          booking:
            data
              ?.booking
            ??
            data,

          availableRooms:
            data
              ?.available_rooms
            ??
            [],

          error:
            null,
        });
      })
      .catch((error) => {
        if (cancelled) {
          return;
        }

        setRequestState({
          key:
            requestKey,

          booking:
            null,

          availableRooms:
            [],

          error:
            getErrorMessage(
              error,
              "The booking could not be loaded.",
            ),
        });
      });

    return () => {
      cancelled =
        true;
    };
  }, [
    bookingKey,
    requestKey,
  ]);

  if (!bookingKey) {
    return (
      <PageContainer>
        <div className="rounded-3xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <AlertCircle className="mx-auto size-11 text-red-500" />

          <h1 className="mt-5 text-2xl font-bold text-slate-950">
            Booking not specified
          </h1>

          <Link
            to="/admin/bookings"
            className="mt-6 inline-flex items-center gap-2 font-semibold text-blue-600"
          >
            <ArrowLeft
              size={18}
            />

            Back to bookings
          </Link>
        </div>
      </PageContainer>
    );
  }

  const loading =
    requestState.key
    !== requestKey;

  if (loading) {
    return (
      <PageContainer>
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto size-10 animate-spin text-blue-600" />

            <p className="mt-4 font-medium text-slate-600">
              Loading booking...
            </p>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (
    requestState.error
    ||
    !requestState.booking
  ) {
    return (
      <PageContainer>
        <div className="rounded-3xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <AlertCircle className="mx-auto size-11 text-red-500" />

          <h1 className="mt-5 text-2xl font-bold text-slate-950">
            Booking unavailable
          </h1>

          <p className="mt-3 text-slate-600">
            {
              requestState.error
            }
          </p>

          <Link
            to="/admin/bookings"
            className="mt-6 inline-flex items-center gap-2 font-semibold text-blue-600"
          >
            <ArrowLeft
              size={18}
            />

            Back to bookings
          </Link>
        </div>
      </PageContainer>
    );
  }

  const booking =
    requestState.booking;

  const availableRooms =
    requestState
      .availableRooms;

  /*
   * -------------------------------------------------
   * Booking status
   * -------------------------------------------------
   */

  const status =
    booking.status
    ??
    booking
      .booking_status
    ??
    "pending_review";

  /*
   * -------------------------------------------------
   * Guest
   * -------------------------------------------------
   */

  const guest =
    booking.guest
    ??
    {};

  const guestName =
    guest.name
    ||
    guest.full_name
    ||
    [
      guest.first_name,
      guest.last_name,
    ]
      .filter(Boolean)
      .join(" ")
    ||
    "—";

  /*
   * -------------------------------------------------
   * Accommodation
   *
   * Current AdminBookingResource returns room_type
   * and contract directly on the booking.
   * Fallbacks remain for compatibility.
   * -------------------------------------------------
   */

  const firstItem =
    booking
      .items
      ?.[0]
    ??
    null;

  const propertyName =
    booking
      .property
      ?.name
    ??
    "—";

  const roomTypeName =
    booking
      .room_type
      ?.name
    ??
    booking
      .stay
      ?.room_type
      ?.name
    ??
    firstItem
      ?.room_type
      ?.name
    ??
    firstItem
      ?.roomType
      ?.name
    ??
    "—";

  const occupants =
    booking
      .guest_count
    ??
    booking
      .stay
      ?.occupants
    ??
    firstItem
      ?.occupants
    ??
    "—";

  const contractName =
    booking
      .contract
      ?.name
    ??
    booking
      .stay
      ?.contract
      ?.name
    ??
    booking
      .stay
      ?.term_label
    ??
    firstItem
      ?.contract
      ?.name
    ??
    "—";

  const checkIn =
    booking
      .check_in_date
    ??
    booking
      .stay
      ?.check_in_date;

  const checkOut =
    booking
      .check_out_date
    ??
    booking
      .stay
      ?.check_out_date;

  /*
   * -------------------------------------------------
   * Passport documents
   *
   * IMPORTANT:
   * The backend response uses:
   *
   * booking.passport_documents
   *
   * Example:
   *
   * passport_documents: [
   *   {
   *     uuid: "...",
   *     original_name: "...jpg",
   *     status: "pending"
   *   }
   * ]
   *
   * This is the main fix for the missing passport.
   * -------------------------------------------------
   */

  const passportDocuments =
    booking
      .passport_documents
    ??
    booking
      .documents
    ??
    booking
      .guest_documents
    ??
    booking
      .guest
      ?.documents
    ??
    [];

  const passportDocument =
    passportDocuments[0]
    ??
    booking
      .passport_proof
    ??
    booking
      .passport_document
    ??
    null;

  const passportStatus =
    passportDocument
      ?.status
    ??
    passportDocument
      ?.verification_status
    ??
    (
      passportDocument
        ?.verified_at
        ? "verified"
        : "pending"
    );

  const passportVerified =
    passportStatus
    === "verified";

  const documentKey =
    passportDocument
      ?.uuid
    ??
    passportDocument
      ?.id;

  const passportFileSize =
    formatFileSize(
      passportDocument
        ?.file_size,
    );

  /*
   * -------------------------------------------------
   * Pricing / financial
   * -------------------------------------------------
   */

  const financial =
    booking
      .financial
    ??
    null;

  const currency =
    booking.currency
    ??
    booking
      .pricing
      ?.currency
    ??
    "EUR";

  const calculatedTotal =
    booking
      .estimated_total_amount
    ??
    booking
      .pricing
      ?.estimated_total_amount
    ??
    booking
      .pricing
      ?.subtotal
    ??
    0;

  /*
   * -------------------------------------------------
   * Admin actions
   * -------------------------------------------------
   */

  const handleApprove =
    async (payload) => {
      setActionLoading(
        true,
      );

      try {
        await approveBooking(
          booking.uuid
          ??
          bookingKey,
          payload,
        );

        setRefreshVersion(
          (current) =>
            current + 1,
        );
      } finally {
        setActionLoading(
          false,
        );
      }
    };

  const handleReject =
    async (event) => {
      event.preventDefault();

      setRejectionError(
        "",
      );

      if (
        !rejectionReason
          .trim()
      ) {
        setRejectionError(
          "Enter a rejection reason.",
        );

        return;
      }

      setActionLoading(
        true,
      );

      try {
        await rejectBooking(
          booking.uuid
          ??
          bookingKey,
          {
            reason:
              rejectionReason
                .trim(),
          },
        );

        setRefreshVersion(
          (current) =>
            current + 1,
        );
      } catch (error) {
        setRejectionError(
          getErrorMessage(
            error,
            "The booking could not be rejected.",
          ),
        );
      } finally {
        setActionLoading(
          false,
        );
      }
    };

  const handleVerifyPassport =
    async () => {
      if (!documentKey) {
        setDocumentError(
          "The passport document could not be identified.",
        );

        return;
      }

      setDocumentError(
        "",
      );

      setDocumentAction(
        "verify",
      );

      try {
        await verifyGuestDocument(
          documentKey,
        );

        setPassportRejectionReason(
          "",
        );

        setRefreshVersion(
          (current) =>
            current + 1,
        );
      } catch (error) {
        setDocumentError(
          getErrorMessage(
            error,
            "The passport proof could not be verified.",
          ),
        );
      } finally {
        setDocumentAction(
          "",
        );
      }
    };

  const handleRejectPassport =
    async () => {
      if (!documentKey) {
        setDocumentError(
          "The passport document could not be identified.",
        );

        return;
      }

      setDocumentError(
        "",
      );

      if (
        !passportRejectionReason
          .trim()
      ) {
        setDocumentError(
          "Enter a reason for rejecting the passport proof.",
        );

        return;
      }

      setDocumentAction(
        "reject",
      );

      try {
        await rejectGuestDocument(
          documentKey,
          {
            reason:
              passportRejectionReason
                .trim(),
          },
        );

        setRefreshVersion(
          (current) =>
            current + 1,
        );
      } catch (error) {
        setDocumentError(
          getErrorMessage(
            error,
            "The passport proof could not be rejected.",
          ),
        );
      } finally {
        setDocumentAction(
          "",
        );
      }
    };

  const handleDownloadPassport =
    async () => {
      if (!documentKey) {
        setDocumentError(
          "The passport document could not be identified.",
        );

        return;
      }

      setDocumentError(
        "",
      );

      setDocumentAction(
        "download",
      );

      try {
        const response =
          await downloadGuestDocument(
            documentKey,
          );

        const contentDisposition =
          response
            .headers
            ?.[
              "content-disposition"
            ];

        const fileNameMatch =
          contentDisposition
            ?.match(
              /filename="?([^"]+)"?/i,
            );

        const fileName =
          fileNameMatch
            ?.[1]
          ??
          passportDocument
            ?.original_name
          ??
          passportDocument
            ?.file_name
          ??
          "passport-document";

        const blobUrl =
          URL.createObjectURL(
            response.data,
          );

        const link =
          document.createElement(
            "a",
          );

        link.href =
          blobUrl;

        link.download =
          fileName;

        document.body.appendChild(
          link,
        );

        link.click();

        link.remove();

        URL.revokeObjectURL(
          blobUrl,
        );
      } catch (error) {
        setDocumentError(
          getErrorMessage(
            error,
            "The passport document could not be downloaded.",
          ),
        );
      } finally {
        setDocumentAction(
          "",
        );
      }
    };

  return (
    <PageContainer>
      <div className="pb-12">
        {/* Page Header */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Link
              to="/admin/bookings"
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
            >
              <ArrowLeft
                size={17}
              />

              Back to bookings
            </Link>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold text-slate-950">
                {
                  booking
                    .booking_reference
                  ??
                  "Booking"
                }
              </h1>

              <span
                className={
                  `rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
                    STATUS_CLASSES[
                      status
                    ]
                    ??
                    "bg-slate-100 text-slate-700"
                  }`
                }
              >
                {
                  STATUS_LABELS[
                    status
                  ]
                  ??
                  status.replaceAll(
                    "_",
                    " ",
                  )
                }
              </span>
            </div>

            <p className="mt-2 text-sm text-slate-500">
              Submitted{" "}
              {formatDateTime(
                booking
                  .submitted_at
                ??
                booking
                  .created_at,
              )}
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setRefreshVersion(
                (current) =>
                  current + 1,
              )
            }
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <RefreshCw
              size={17}
            />

            Refresh
          </button>
        </div>

        <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_380px]">
          <div className="space-y-8">
            {/* Guest Information */}
            <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex items-center gap-3">
                <UserRound className="text-blue-600" />

                <h2 className="text-xl font-bold text-slate-950">
                  Guest Information
                </h2>
              </div>

              <div className="mt-7 grid gap-6 md:grid-cols-2">
                <InfoItem
                  icon={UserRound}
                  label="Guest Name"
                >
                  {guestName}
                </InfoItem>

                <InfoItem
                  icon={Mail}
                  label="Email"
                >
                  {
                    guest.email
                    ??
                    "—"
                  }
                </InfoItem>

                <InfoItem
                  icon={Phone}
                  label="Phone"
                >
                  {
                    guest.phone
                    ??
                    "—"
                  }
                </InfoItem>

                <InfoItem
                  icon={Users}
                  label="Occupants"
                >
                  {occupants}
                </InfoItem>
              </div>
            </section>

            {/* Accommodation */}
            <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex items-center gap-3">
                <BedDouble className="text-blue-600" />

                <h2 className="text-xl font-bold text-slate-950">
                  Accommodation
                </h2>
              </div>

              <div className="mt-7 grid gap-6 md:grid-cols-2">
                <InfoItem
                  icon={MapPin}
                  label="Property"
                >
                  {propertyName}
                </InfoItem>

                <InfoItem
                  icon={BedDouble}
                  label="Room Type"
                >
                  {roomTypeName}
                </InfoItem>

                <InfoItem
                  icon={Users}
                  label="Occupants"
                >
                  {occupants}
                </InfoItem>

                <InfoItem
                  icon={CalendarDays}
                  label="Contract / Stay Term"
                >
                  {contractName}
                </InfoItem>

                <InfoItem
                  icon={CalendarDays}
                  label="Check In"
                >
                  {formatDate(
                    checkIn,
                  )}
                </InfoItem>

                <InfoItem
                  icon={CalendarDays}
                  label="Check Out"
                >
                  {formatDate(
                    checkOut,
                  )}
                </InfoItem>
              </div>

              <div className="mt-7 rounded-2xl border border-blue-100 bg-blue-50 p-5">
                <p className="text-sm font-semibold text-blue-700">
                  System Calculated
                  Booking Total
                </p>

                <p className="mt-2 text-3xl font-bold text-blue-950">
                  {formatMoney(
                    calculatedTotal,
                    currency,
                  )}
                </p>

                <p className="mt-2 text-xs leading-5 text-blue-700">
                  This amount is
                  calculated automatically
                  from the selected rate,
                  occupants and stay
                  period.
                </p>
              </div>
            </section>

            {/* Passport Proof */}
            <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-blue-600" />

                <h2 className="text-xl font-bold text-slate-950">
                  Passport Proof
                </h2>
              </div>

              {!passportDocument ? (
                <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5">
                  <p className="font-semibold text-red-800">
                    No passport proof
                    was found for this
                    booking.
                  </p>

                  <p className="mt-2 text-sm leading-6 text-red-700">
                    The customer must
                    provide passport
                    proof before this
                    booking can be
                    approved.
                  </p>
                </div>
              ) : (
                <>
                  <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex min-w-0 items-start gap-3">
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                          <FileCheck2
                            size={22}
                          />
                        </div>

                        <div className="min-w-0">
                          <p className="break-all font-semibold text-slate-900">
                            {
                              passportDocument
                                .original_name
                              ??
                              passportDocument
                                .file_name
                              ??
                              "Passport document"
                            }
                          </p>

                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            <span
                              className={
                                `rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
                                  PASSPORT_STATUS_CLASSES[
                                    passportStatus
                                  ]
                                  ??
                                  "bg-slate-200 text-slate-700"
                                }`
                              }
                            >
                              {
                                passportStatus
                                  .replaceAll(
                                    "_",
                                    " ",
                                  )
                              }
                            </span>

                            {passportDocument
                              .mime_type ? (
                              <span className="text-xs text-slate-500">
                                {
                                  passportDocument
                                    .mime_type
                                }
                              </span>
                            ) : null}

                            {passportFileSize ? (
                              <span className="text-xs text-slate-500">
                                ·{" "}
                                {
                                  passportFileSize
                                }
                              </span>
                            ) : null}
                          </div>

                          {passportDocument
                            .verified_at ? (
                            <p className="mt-2 text-xs text-emerald-700">
                              Verified{" "}
                              {formatDateTime(
                                passportDocument
                                  .verified_at,
                              )}
                            </p>
                          ) : null}

                          {passportDocument
                            .rejection_reason ? (
                            <p className="mt-2 text-sm leading-6 text-red-700">
                              {
                                passportDocument
                                  .rejection_reason
                              }
                            </p>
                          ) : null}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={
                          handleDownloadPassport
                        }
                        disabled={
                          documentAction
                          !== ""
                        }
                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <Download
                          size={17}
                        />

                        {documentAction
                        === "download"
                          ? "Downloading..."
                          : "Download Passport"}
                      </button>
                    </div>
                  </div>

                  {status
                    ===
                    "pending_review"
                  ? (
                    <div className="mt-5 space-y-5">
                      {passportStatus
                      === "pending" ? (
                        <>
                          <button
                            type="button"
                            onClick={
                              handleVerifyPassport
                            }
                            disabled={
                              documentAction
                              !== ""
                            }
                            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            <CheckCircle2
                              size={18}
                            />

                            {documentAction
                            === "verify"
                              ? "Verifying..."
                              : "Verify Passport"}
                          </button>

                          <div>
                            <label
                              htmlFor="passport-rejection-reason"
                              className="text-sm font-semibold text-slate-700"
                            >
                              Passport
                              Rejection Reason
                            </label>

                            <textarea
                              id="passport-rejection-reason"
                              rows={3}
                              value={
                                passportRejectionReason
                              }
                              onChange={(
                                event,
                              ) => {
                                setPassportRejectionReason(
                                  event
                                    .target
                                    .value,
                                );

                                setDocumentError(
                                  "",
                                );
                              }}
                              placeholder="Explain why this passport proof cannot be accepted."
                              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
                            />

                            <button
                              type="button"
                              onClick={
                                handleRejectPassport
                              }
                              disabled={
                                documentAction
                                !== ""
                              }
                              className="mt-3 inline-flex items-center gap-2 rounded-xl border border-red-300 bg-white px-4 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              <XCircle
                                size={17}
                              />

                              {documentAction
                              === "reject"
                                ? "Rejecting..."
                                : "Reject Passport"}
                            </button>
                          </div>
                        </>
                      ) : null}

                      {passportStatus
                      === "verified" ? (
                        <div className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 font-semibold text-emerald-700">
                          <CheckCircle2
                            size={18}
                          />

                          Passport Verified
                        </div>
                      ) : null}

                      {passportStatus
                      === "rejected" ? (
                        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700">
                          This passport proof
                          has been rejected.
                          The booking cannot
                          be approved until
                          acceptable proof is
                          available.
                        </div>
                      ) : null}
                    </div>
                  ) : null}

                  {documentError ? (
                    <div
                      role="alert"
                      className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700"
                    >
                      {
                        documentError
                      }
                    </div>
                  ) : null}
                </>
              )}
            </section>

            {/* Financial Plan */}
            {financial ? (
              <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
                <h2 className="text-xl font-bold text-slate-950">
                  Payment Plan
                </h2>

                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl bg-slate-50 p-5">
                    <p className="text-sm text-slate-500">
                      Booking Total
                    </p>

                    <p className="mt-2 text-xl font-bold text-slate-950">
                      {formatMoney(
                        financial
                          .booking_total_amount,
                        currency,
                      )}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-emerald-50 p-5">
                    <p className="text-sm text-emerald-700">
                      Paid
                    </p>

                    <p className="mt-2 text-xl font-bold text-emerald-950">
                      {formatMoney(
                        financial
                          .paid_amount,
                        currency,
                      )}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-blue-50 p-5">
                    <p className="text-sm text-blue-700">
                      Outstanding
                    </p>

                    <p className="mt-2 text-xl font-bold text-blue-950">
                      {formatMoney(
                        financial
                          .outstanding_amount,
                        currency,
                      )}
                    </p>
                  </div>
                </div>

                {financial
                  .installments
                  ?.length > 0 ? (
                  <div className="mt-6 space-y-3">
                    {financial
                      .installments
                      .map(
                        (
                          installment,
                        ) => (
                          <div
                            key={
                              installment
                                .uuid
                            }
                            className="flex flex-col gap-3 rounded-2xl border border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between"
                          >
                            <div>
                              <p className="font-semibold text-slate-950">
                                {
                                  installment
                                    .label
                                }
                              </p>

                              <p className="mt-1 text-sm text-slate-500">
                                Due{" "}
                                {formatDateTime(
                                  installment
                                    .due_at,
                                )}
                              </p>
                            </div>

                            <div className="sm:text-right">
                              <p className="font-bold text-slate-950">
                                {formatMoney(
                                  installment
                                    .amount,
                                  currency,
                                )}
                              </p>

                              <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                {
                                  installment
                                    .status
                                }
                              </p>
                            </div>
                          </div>
                        ),
                      )}
                  </div>
                ) : (
                  <p className="mt-5 text-sm leading-6 text-slate-500">
                    The payment
                    schedule will be
                    created when the
                    Admin approves this
                    booking.
                  </p>
                )}
              </section>
            ) : null}
          </div>

          {/* Right column */}
          <aside className="space-y-8">
            {status ===
            "pending_review" ? (
              <>
                <BookingApprovalPanel
                  booking={
                    booking
                  }
                  availableRooms={
                    availableRooms
                  }
                  passportVerified={
                    passportVerified
                  }
                  busy={
                    actionLoading
                  }
                  onApprove={
                    handleApprove
                  }
                />

                <section className="rounded-3xl border border-red-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-3">
                    <XCircle className="text-red-600" />

                    <h2 className="text-xl font-bold text-slate-950">
                      Reject Booking
                    </h2>
                  </div>

                  <form
                    onSubmit={
                      handleReject
                    }
                    className="mt-5"
                  >
                    <label
                      htmlFor="booking-rejection-reason"
                      className="text-sm font-semibold text-slate-700"
                    >
                      Rejection Reason
                    </label>

                    <textarea
                      id="booking-rejection-reason"
                      rows={4}
                      value={
                        rejectionReason
                      }
                      onChange={(
                        event,
                      ) => {
                        setRejectionReason(
                          event
                            .target
                            .value,
                        );

                        setRejectionError(
                          "",
                        );
                      }}
                      placeholder="Explain why the booking request is being rejected."
                      className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
                    />

                    {rejectionError ? (
                      <div
                        role="alert"
                        className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700"
                      >
                        {
                          rejectionError
                        }
                      </div>
                    ) : null}

                    <button
                      type="submit"
                      disabled={
                        actionLoading
                      }
                      className="mt-4 w-full rounded-xl border border-red-300 bg-white px-6 py-4 font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {actionLoading
                        ? "Processing..."
                        : "Reject Booking"}
                    </button>
                  </form>
                </section>
              </>
            ) : (
              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-slate-950">
                  Review Complete
                </h2>

                <p className="mt-3 leading-7 text-slate-600">
                  This booking is no
                  longer pending Admin
                  review.
                </p>

                <div className="mt-5 rounded-xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">
                    Current Status
                  </p>

                  <p className="mt-1 font-semibold text-slate-950">
                    {
                      STATUS_LABELS[
                        status
                      ]
                      ??
                      status.replaceAll(
                        "_",
                        " ",
                      )
                    }
                  </p>
                </div>

                {booking
                  .assigned_room ? (
                  <div className="mt-4 rounded-xl bg-blue-50 p-4">
                    <p className="text-sm text-blue-700">
                      Assigned Room
                    </p>

                    <p className="mt-1 font-semibold text-blue-950">
                      Room{" "}
                      {
                        booking
                          .assigned_room
                          .room_number
                      }
                    </p>
                  </div>
                ) : null}
              </section>
            )}
          </aside>
        </div>
      </div>
    </PageContainer>
  );
}