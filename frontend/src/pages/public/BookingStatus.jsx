import {
  AlertCircle,
  ArrowLeft,
  BedDouble,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  FileCheck2,
  Loader2,
  MapPin,
  RefreshCw,
  ShieldCheck,
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
  useSearchParams,
} from "react-router-dom";

import {
  getBookingStatus,
} from "@/services/bookingApi";

const STATUS_CONFIG = {
  pending_review: {
    label:
      "Pending Review",

    title:
      "Your booking request is being reviewed",

    description:
      "We received your accommodation request. An administrator will review your information and passport proof before payment becomes available.",

    icon:
      Clock3,

    badgeClass:
      "bg-amber-100 text-amber-800",

    panelClass:
      "border-amber-200 bg-amber-50",

    iconClass:
      "text-amber-600",
  },

  awaiting_payment: {
    label:
      "Awaiting Payment",

    title:
      "Your booking has been approved",

    description:
      "Your accommodation request has been approved. Complete the required payment shown below before its deadline.",

    icon:
      CreditCard,

    badgeClass:
      "bg-blue-100 text-blue-800",

    panelClass:
      "border-blue-200 bg-blue-50",

    iconClass:
      "text-blue-600",
  },

  confirmed: {
    label:
      "Confirmed",

    title:
      "Your booking is confirmed",

    description:
      "Your required initial payment has been received and your accommodation booking is confirmed. If a remaining balance exists, continue following the payment schedule below.",

    icon:
      CheckCircle2,

    badgeClass:
      "bg-emerald-100 text-emerald-800",

    panelClass:
      "border-emerald-200 bg-emerald-50",

    iconClass:
      "text-emerald-600",
  },

  rejected: {
    label:
      "Rejected",

    title:
      "Your booking request was not approved",

    description:
      "Your accommodation request has been reviewed and was not approved.",

    icon:
      XCircle,

    badgeClass:
      "bg-red-100 text-red-800",

    panelClass:
      "border-red-200 bg-red-50",

    iconClass:
      "text-red-600",
  },

  payment_expired: {
    label:
      "Payment Expired",

    title:
      "The payment period has expired",

    description:
      "The required payment deadline for this booking has passed. Please contact Alishan Accommodation if you need assistance.",

    icon:
      AlertCircle,

    badgeClass:
      "bg-red-100 text-red-800",

    panelClass:
      "border-red-200 bg-red-50",

    iconClass:
      "text-red-600",
  },

  cancelled: {
    label:
      "Cancelled",

    title:
      "This booking has been cancelled",

    description:
      "This accommodation booking is no longer active.",

    icon:
      XCircle,

    badgeClass:
      "bg-slate-200 text-slate-700",

    panelClass:
      "border-slate-200 bg-slate-50",

    iconClass:
      "text-slate-600",
  },

  checked_in: {
    label:
      "Checked In",

    title:
      "You are checked in",

    description:
      "This accommodation booking is currently checked in.",

    icon:
      CheckCircle2,

    badgeClass:
      "bg-emerald-100 text-emerald-800",

    panelClass:
      "border-emerald-200 bg-emerald-50",

    iconClass:
      "text-emerald-600",
  },

  checked_out: {
    label:
      "Checked Out",

    title:
      "Stay completed",

    description:
      "This accommodation stay has been completed.",

    icon:
      CheckCircle2,

    badgeClass:
      "bg-slate-200 text-slate-700",

    panelClass:
      "border-slate-200 bg-slate-50",

    iconClass:
      "text-slate-600",
  },
};

const PAYMENT_STATUS_CONFIG = {
  unpaid: {
    label:
      "Unpaid",

    className:
      "bg-amber-100 text-amber-800",
  },

  partially_paid: {
    label:
      "Partially Paid",

    className:
      "bg-blue-100 text-blue-800",
  },

  paid: {
    label:
      "Paid",

    className:
      "bg-emerald-100 text-emerald-800",
  },

  overdue: {
    label:
      "Overdue",

    className:
      "bg-red-100 text-red-800",
  },

  refunded: {
    label:
      "Refunded",

    className:
      "bg-slate-200 text-slate-700",
  },
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

  const numericValue =
    Number(value);

  if (
    !Number.isFinite(
      numericValue,
    )
  ) {
    return String(value);
  }

  try {
    return new Intl.NumberFormat(
      "en-IE",
      {
        style:
          "currency",

        currency:
          currency
          || "EUR",

        minimumFractionDigits:
          2,

        maximumFractionDigits:
          2,
      },
    ).format(
      numericValue,
    );
  } catch {
    return `€${numericValue.toFixed(
      2,
    )}`;
  }
}

function formatStayDate(
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
      : new Date(
          value,
        );

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
      day:
        "2-digit",

      month:
        "short",

      year:
        "numeric",
    },
  ).format(
    date,
  );
}

function formatPaymentDeadline(
  value,
) {
  if (!value) {
    return null;
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
      day:
        "2-digit",

      month:
        "short",

      year:
        "numeric",

      hour:
        "2-digit",

      minute:
        "2-digit",

      timeZone:
        "Europe/Vilnius",

      timeZoneName:
        "short",
    },
  ).format(
    date,
  );
}

function getPassportStatus(
  booking,
) {
  return (
    booking
      ?.passport_proof
      ?.verification_status
    ??
    booking
      ?.passport_proof
      ?.status
    ??
    "pending"
  );
}

function passportStatusLabel(
  status,
) {
  if (
    status
    === "verified"
  ) {
    return "Verified";
  }

  if (
    status
    === "rejected"
  ) {
    return "Needs Attention";
  }

  return "Pending Review";
}

function BookingDetail({
  icon: Icon,
  label,
  children,
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        <Icon
          size={20}
        />
      </div>

      <div className="min-w-0">
        <p className="text-sm font-medium text-slate-500">
          {label}
        </p>

        <div className="mt-1 font-semibold text-slate-900">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function BookingStatus() {
  const { reference } =
    useParams();

  const [
    searchParams,
  ] =
    useSearchParams();

  const token =
    searchParams.get(
      "token",
    );

  const [
    refreshVersion,
    setRefreshVersion,
  ] = useState(0);

  const requestKey =
    useMemo(
      () =>
        [
          reference
          ?? "",

          token
          ?? "",

          refreshVersion,
        ].join("|"),
      [
        reference,
        token,
        refreshVersion,
      ],
    );

  const [
    requestState,
    setRequestState,
  ] = useState({
    key:
      null,

    booking:
      null,

    error:
      null,
  });

  useEffect(() => {
    if (
      !reference
      ||
      !token
    ) {
      return undefined;
    }

    let cancelled =
      false;

    getBookingStatus(
      reference,
      token,
    )
      .then(
        (booking) => {
          if (
            cancelled
          ) {
            return;
          }

          setRequestState({
            key:
              requestKey,

            booking,

            error:
              null,
          });
        },
      )
      .catch(
        (
          requestError,
        ) => {
          if (
            cancelled
          ) {
            return;
          }

          setRequestState({
            key:
              requestKey,

            booking:
              null,

            error:
              requestError
                .response
                ?.status
              === 404
                ? "This booking link is invalid, expired or incomplete."
                : (
                    requestError
                      .response
                      ?.data
                      ?.message
                    ??
                    "The booking status could not be loaded."
                  ),
          });
        },
      );

    return () => {
      cancelled =
        true;
    };
  }, [
    reference,
    token,
    requestKey,
  ]);

  if (!token) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 pb-24 pt-32">
        <div className="mx-auto max-w-xl rounded-3xl border border-amber-200 bg-white p-8 text-center shadow-sm sm:p-10">
          <AlertCircle className="mx-auto size-12 text-amber-500" />

          <h1 className="mt-6 text-3xl font-bold text-slate-950">
            Secure Access
            Required
          </h1>

          <p className="mt-4 leading-7 text-slate-600">
            This booking status
            page requires the
            secure link provided
            by Alishan
            Accommodation.
          </p>

          <Link
            to="/"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            <ArrowLeft
              size={18}
            />
            Return Home
          </Link>
        </div>
      </main>
    );
  }

  const isLoading =
    requestState.key
    !== requestKey;

  if (isLoading) {
    return (
      <main className="flex min-h-[75vh] items-center justify-center bg-slate-50 px-6 pt-20">
        <div className="text-center">
          <Loader2 className="mx-auto size-11 animate-spin text-blue-600" />

          <p className="mt-5 font-medium text-slate-600">
            Loading your
            booking...
          </p>
        </div>
      </main>
    );
  }

  if (
    requestState.error
    ||
    !requestState.booking
  ) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 pb-24 pt-32">
        <div className="mx-auto max-w-xl rounded-3xl border border-red-200 bg-white p-8 text-center shadow-sm sm:p-10">
          <AlertCircle className="mx-auto size-12 text-red-500" />

          <h1 className="mt-6 text-3xl font-bold text-slate-950">
            Status
            Unavailable
          </h1>

          <p className="mt-4 leading-7 text-slate-600">
            {
              requestState.error
            }
          </p>

          <p className="mt-4 text-sm leading-6 text-slate-500">
            For your security,
            booking information
            is available only
            through a valid
            private access link.
          </p>

          <Link
            to="/"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            <ArrowLeft
              size={18}
            />
            Return Home
          </Link>
        </div>
      </main>
    );
  }

  const booking =
    requestState.booking;

  const status =
    booking.status
    ??
    booking
      .booking_status
    ??
    "pending_review";

  const statusConfig =
    STATUS_CONFIG[
      status
    ]
    ??
    STATUS_CONFIG
      .pending_review;

  const StatusIcon =
    statusConfig.icon;

  const propertyName =
    booking
      .property
      ?.name
    ??
    "—";

  const propertyCity =
    booking
      .property
      ?.city
      ?.name
    ??
    booking
      .property
      ?.city
    ??
    null;

  const roomTypeName =
    booking
      .stay
      ?.room_type
      ?.name
    ??
    booking
      .room_type
      ?.name
    ??
    "—";

  const occupants =
    booking
      .stay
      ?.occupants
    ??
    booking
      .guest_count
    ??
    "—";

  const checkInDate =
    booking
      .stay
      ?.check_in_date
    ??
    booking
      .check_in_date
    ??
    null;

  const checkOutDate =
    booking
      .stay
      ?.check_out_date
    ??
    booking
      .check_out_date
    ??
    null;

  const billingUnit =
    booking
      .pricing
      ?.billing_unit
    ??
    booking
      .stay
      ?.billing_unit
    ??
    null;

  const unitPrice =
    booking
      .pricing
      ?.unit_price
    ??
    booking
      .pricing
      ?.rate_per_person
    ??
    null;

  const estimatedTotal =
    booking
      .pricing
      ?.estimated_total_amount
    ??
    booking
      .estimated_total_amount
    ??
    null;

  const currency =
    booking
      .pricing
      ?.currency
    ??
    booking.currency
    ??
    "EUR";

  const financial =
    booking
      .financial
    ??
    null;

  const bookingTotal =
    financial
      ?.booking_total_amount
    ??
    estimatedTotal
    ??
    0;

  const paidAmount =
    financial
      ?.paid_amount
    ??
    0;

  const outstandingAmount =
    financial
      ?.outstanding_amount
    ??
    bookingTotal;

  const nextInstallment =
    financial
      ?.next_installment
    ??
    null;

  const installments =
    financial
      ?.installments
    ??
    [];

  const paymentStatus =
    financial
      ?.payment_status
    ??
    "unpaid";

  const paymentStatusConfig =
    PAYMENT_STATUS_CONFIG[
      paymentStatus
    ]
    ??
    {
      label:
        paymentStatus
          .replaceAll(
            "_",
            " ",
          ),

      className:
        "bg-slate-100 text-slate-700",
    };

  const passportStatus =
    getPassportStatus(
      booking,
    );

  const rejectionReason =
    booking
      .review
      ?.rejection_reason
    ??
    booking
      .rejection_reason
    ??
    null;

  return (
    <main className="min-h-screen bg-slate-50 px-6 pb-24 pt-32">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">
              Booking Status
            </p>

            <h1 className="mt-3 break-all text-3xl font-bold text-slate-950 sm:text-4xl">
              {
                booking
                  .booking_reference
                ??
                reference
              }
            </h1>

            <p className="mt-3 text-slate-500">
              Keep this booking
              reference for future
              communication with
              Alishan
              Accommodation.
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
            Refresh Status
          </button>
        </div>

        <section
          className={
            `mt-8 rounded-3xl border p-7 shadow-sm sm:p-8 ${statusConfig.panelClass}`
          }
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm">
              <StatusIcon
                className={
                  `size-7 ${statusConfig.iconClass}`
                }
              />
            </div>

            <div>
              <span
                className={
                  `inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${statusConfig.badgeClass}`
                }
              >
                {
                  statusConfig.label
                }
              </span>

              <h2 className="mt-4 text-2xl font-bold text-slate-950">
                {
                  statusConfig.title
                }
              </h2>

              <p className="mt-3 max-w-3xl leading-7 text-slate-700">
                {
                  statusConfig.description
                }
              </p>

              {status ===
                "rejected"
              &&
              rejectionReason ? (
                <div className="mt-5 rounded-xl border border-red-200 bg-white/70 p-4">
                  <p className="text-sm font-semibold text-red-900">
                    Review Note
                  </p>

                  <p className="mt-2 leading-6 text-red-800">
                    {
                      rejectionReason
                    }
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </section>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="space-y-8">
            <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-8">
              <h2 className="text-2xl font-bold text-slate-950">
                Accommodation
              </h2>

              <div className="mt-7 grid gap-7 sm:grid-cols-2">
                <BookingDetail
                  icon={MapPin}
                  label="Location"
                >
                  <p>
                    {
                      propertyName
                    }
                  </p>

                  {propertyCity ? (
                    <p className="mt-1 text-sm font-normal text-slate-500">
                      {
                        propertyCity
                      }
                    </p>
                  ) : null}
                </BookingDetail>

                <BookingDetail
                  icon={BedDouble}
                  label="Room Type"
                >
                  {
                    roomTypeName
                  }
                </BookingDetail>

                <BookingDetail
                  icon={Users}
                  label="Occupants"
                >
                  {occupants}
                </BookingDetail>

                <BookingDetail
                  icon={
                    CalendarDays
                  }
                  label="Stay"
                >
                  <p>
                    {formatStayDate(
                      checkInDate,
                    )}
                  </p>

                  <p className="mt-1 text-sm font-normal text-slate-500">
                    to{" "}
                    {formatStayDate(
                      checkOutDate,
                    )}
                  </p>
                </BookingDetail>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-8">
              <div className="flex items-center gap-3">
                <ShieldCheck className="size-6 text-blue-600" />

                <h2 className="text-2xl font-bold text-slate-950">
                  Passport Proof
                </h2>
              </div>

              <div className="mt-6 flex items-start gap-4 rounded-2xl bg-slate-50 p-5">
                <FileCheck2 className="mt-0.5 size-6 shrink-0 text-slate-500" />

                <div>
                  <p className="font-semibold text-slate-900">
                    Passport proof{" "}
                    {passportStatusLabel(
                      passportStatus,
                    )}
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Your passport
                    document is stored
                    privately and is
                    accessible only to
                    authorized
                    administrators.
                  </p>
                </div>
              </div>
            </section>

            {installments.length
            > 0 ? (
              <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-8">
                <h2 className="text-2xl font-bold text-slate-950">
                  Payment Schedule
                </h2>

                <p className="mt-3 leading-7 text-slate-600">
                  Your booking may
                  contain one full
                  payment or multiple
                  scheduled payments.
                </p>

                <div className="mt-6 space-y-4">
                  {installments.map(
                    (
                      installment,
                    ) => {
                      const isPaid =
                        installment
                          .status
                        === "paid";

                      return (
                        <article
                          key={
                            installment
                              .uuid
                          }
                          className="rounded-2xl border border-slate-200 p-5"
                        >
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                {isPaid ? (
                                  <CheckCircle2 className="size-5 text-emerald-600" />
                                ) : (
                                  <Clock3 className="size-5 text-blue-600" />
                                )}

                                <p className="font-bold text-slate-950">
                                  {
                                    installment
                                      .label
                                  }
                                </p>
                              </div>

                              {installment
                                .due_at ? (
                                <p className="mt-2 text-sm text-slate-500">
                                  Due{" "}
                                  {formatPaymentDeadline(
                                    installment
                                      .due_at,
                                  )}
                                </p>
                              ) : null}

                              {installment
                                .paid_at ? (
                                <p className="mt-1 text-sm font-medium text-emerald-700">
                                  Paid{" "}
                                  {formatPaymentDeadline(
                                    installment
                                      .paid_at,
                                  )}
                                </p>
                              ) : null}
                            </div>

                            <div className="sm:text-right">
                              <p className="text-xl font-bold text-slate-950">
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
                        </article>
                      );
                    },
                  )}
                </div>
              </section>
            ) : null}
          </div>

          <aside className="space-y-8">
            <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
              <h2 className="text-xl font-bold text-slate-950">
                Booking Summary
              </h2>

              <div className="mt-6 space-y-5">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Rate
                  </p>

                  <p className="mt-1 text-2xl font-bold text-slate-950">
                    {formatMoney(
                      unitPrice,
                      currency,
                    )}
                  </p>

                  {billingUnit ? (
                    <p className="mt-1 text-sm text-slate-500">
                      Per person /{" "}
                      {
                        billingUnit
                      }
                    </p>
                  ) : null}
                </div>

                <div className="border-t border-slate-200 pt-5">
                  <p className="text-sm font-medium text-slate-500">
                    Booking Total
                  </p>

                  <p className="mt-1 text-2xl font-bold text-slate-950">
                    {formatMoney(
                      bookingTotal,
                      currency,
                    )}
                  </p>
                </div>
              </div>
            </section>

            {installments.length
            > 0 ? (
              <section className="rounded-3xl border border-blue-200 bg-white p-7 shadow-sm">
                <div className="flex size-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <CreditCard
                    size={24}
                  />
                </div>

                <p className="mt-5 text-sm font-semibold uppercase tracking-wider text-blue-600">
                  Payment Summary
                </p>

                <div className="mt-5 space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-slate-500">
                      Booking Total
                    </span>

                    <strong className="text-slate-950">
                      {formatMoney(
                        bookingTotal,
                        currency,
                      )}
                    </strong>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-slate-500">
                      Paid
                    </span>

                    <strong className="text-emerald-700">
                      {formatMoney(
                        paidAmount,
                        currency,
                      )}
                    </strong>
                  </div>

                  <div className="flex items-center justify-between gap-4 border-t border-slate-200 pt-4">
                    <span className="font-semibold text-slate-700">
                      Remaining
                    </span>

                    <strong className="text-xl text-slate-950">
                      {formatMoney(
                        outstandingAmount,
                        currency,
                      )}
                    </strong>
                  </div>
                </div>

                <div className="mt-5">
                  <span
                    className={
                      `inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${paymentStatusConfig.className}`
                    }
                  >
                    {
                      paymentStatusConfig.label
                    }
                  </span>
                </div>

                {nextInstallment ? (
                  <div className="mt-6 rounded-2xl bg-blue-50 p-5">
                    <p className="text-sm font-semibold text-blue-700">
                      Next Payment
                    </p>

                    <p className="mt-2 text-3xl font-bold text-blue-950">
                      {formatMoney(
                        nextInstallment
                          .amount_remaining,
                        currency,
                      )}
                    </p>

                    <p className="mt-1 text-sm font-medium text-blue-700">
                      {
                        nextInstallment
                          .label
                      }
                    </p>

                    {nextInstallment
                      .due_at ? (
                      <div className="mt-4 flex items-start gap-2 text-sm text-blue-800">
                        <Clock3
                          size={17}
                          className="mt-0.5 shrink-0"
                        />

                        <span>
                          Due{" "}
                          {formatPaymentDeadline(
                            nextInstallment
                              .due_at,
                          )}
                        </span>
                      </div>
                    ) : null}

                    <button
                      type="button"
                      disabled
                      className="mt-5 flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-slate-200 px-5 py-4 font-semibold text-slate-500"
                    >
                      <CreditCard
                        size={19}
                      />

                      Pay{" "}
                      {formatMoney(
                        nextInstallment
                          .amount_remaining,
                        currency,
                      )}
                    </button>

                    <p className="mt-3 text-center text-xs leading-5 text-slate-500">
                      Stripe Checkout
                      will activate this
                      button in the next
                      implementation
                      step.
                    </p>
                  </div>
                ) : (
                  <div className="mt-6 rounded-2xl bg-emerald-50 p-5">
                    <CheckCircle2 className="size-8 text-emerald-600" />

                    <p className="mt-3 font-bold text-emerald-950">
                      No payment
                      outstanding
                    </p>

                    <p className="mt-2 text-sm leading-6 text-emerald-800">
                      All scheduled
                      payments for this
                      booking have been
                      completed.
                    </p>
                  </div>
                )}
              </section>
            ) : null}

            {status ===
            "pending_review" ? (
              <section className="rounded-3xl border border-amber-200 bg-amber-50 p-7 shadow-sm">
                <Clock3 className="size-9 text-amber-600" />

                <h2 className="mt-5 text-xl font-bold text-amber-950">
                  No Payment Yet
                </h2>

                <p className="mt-3 leading-7 text-amber-800">
                  Do not make any
                  payment yet.
                  Payment becomes
                  available only after
                  an administrator
                  approves your
                  application.
                </p>
              </section>
            ) : null}

            {status ===
            "rejected" ? (
              <section className="rounded-3xl border border-red-200 bg-red-50 p-7 shadow-sm">
                <XCircle className="size-9 text-red-600" />

                <h2 className="mt-5 text-xl font-bold text-red-950">
                  No Payment
                  Required
                </h2>

                <p className="mt-3 leading-7 text-red-800">
                  Because this booking
                  request was not
                  approved, no
                  accommodation
                  payment is required
                  for this request.
                </p>
              </section>
            ) : null}

            {status ===
              "confirmed"
            &&
            Number(
              outstandingAmount,
            ) <= 0 ? (
              <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-7 shadow-sm">
                <CheckCircle2 className="size-10 text-emerald-600" />

                <h2 className="mt-5 text-xl font-bold text-emerald-950">
                  Fully Paid
                </h2>

                <p className="mt-3 leading-7 text-emerald-800">
                  Your booking is
                  confirmed and there
                  is no remaining
                  payment balance.
                </p>
              </section>
            ) : null}
          </aside>
        </div>

        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-8">
          <h2 className="text-xl font-bold text-slate-950">
            Need Assistance?
          </h2>

          <p className="mt-3 leading-7 text-slate-600">
            Contact Alishan
            Accommodation and
            include your booking
            reference{" "}
            <strong>
              {
                booking
                  .booking_reference
                ??
                reference
              }
            </strong>
            .
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href="mailto:alishan@ethos24lt.com"
              className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              alishan@ethos24lt.com
            </a>

            <a
              href="tel:+37069400005"
              className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              +370 69400005
            </a>
          </div>
        </section>

        <div className="mt-8 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-semibold text-blue-600 transition hover:text-blue-700"
          >
            <ArrowLeft
              size={18}
            />
            Return to Alishan
            Accommodation
          </Link>
        </div>
      </div>
    </main>
  );
}