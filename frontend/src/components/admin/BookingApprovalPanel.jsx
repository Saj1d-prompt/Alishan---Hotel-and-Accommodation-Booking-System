import {
  CreditCard,
  Euro,
} from "lucide-react";

import {
  useState,
} from "react";

function formatMoney(value) {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return "€0.00";
  }

  return new Intl.NumberFormat(
    "en-IE",
    {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
  ).format(amount);
}

function getErrorMessage(error) {
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
    "The booking could not be approved."
  );
}

export default function BookingApprovalPanel({
  booking,
  availableRooms = [],
  onApprove,
  busy = false,
  passportVerified = false,
}) {
  const systemTotal =
    Number(
      booking
        ?.financial
        ?.booking_total_amount
      ??
      booking
        ?.pricing
        ?.estimated_total_amount
      ??
      booking
        ?.estimated_total_amount
      ??
      0,
    );

  const [
    roomUuid,
    setRoomUuid,
  ] = useState("");

  const [
    paymentPlan,
    setPaymentPlan,
  ] = useState("full");

  const [
    amountDueNow,
    setAmountDueNow,
  ] = useState("");

  const [
    paymentDueAt,
    setPaymentDueAt,
  ] = useState("");

  const [
    remainingDueAt,
    setRemainingDueAt,
  ] = useState("");

  const [
    error,
    setError,
  ] = useState("");

  const partialAmount =
    Number(amountDueNow);

  const effectiveDueNow =
    paymentPlan === "full"
      ? systemTotal
      : (
          Number.isFinite(
            partialAmount,
          )
            ? partialAmount
            : 0
        );

  const remainingBalance =
    Math.max(
      systemTotal
        - effectiveDueNow,
      0,
    );

  const handlePlanChange = (
    nextPlan,
  ) => {
    setPaymentPlan(
      nextPlan,
    );

    setError("");

    if (
      nextPlan === "full"
    ) {
      setAmountDueNow("");
      setRemainingDueAt("");
    }
  };

  const handleSubmit =
    async (event) => {
      event.preventDefault();

      setError("");

      if (
        !passportVerified
      ) {
        setError(
          "Verify the passport proof before approving this booking.",
        );

        return;
      }

      if (!roomUuid) {
        setError(
          "Select a physical room.",
        );

        return;
      }

      if (
        !Number.isFinite(
          systemTotal,
        )
        ||
        systemTotal <= 0
      ) {
        setError(
          "The booking does not have a valid system-calculated total.",
        );

        return;
      }

      if (!paymentDueAt) {
        setError(
          "Select the first payment deadline.",
        );

        return;
      }

      if (
        paymentPlan
        === "partial"
      ) {
        if (
          !Number.isFinite(
            partialAmount,
          )
          ||
          partialAmount <= 0
          ||
          partialAmount
            >= systemTotal
        ) {
          setError(
            "The amount due now must be greater than €0 and less than the full booking total.",
          );

          return;
        }

        if (
          !remainingDueAt
        ) {
          setError(
            "Select the remaining balance due date.",
          );

          return;
        }

        if (
          remainingDueAt
          <= paymentDueAt
        ) {
          setError(
            "The remaining balance due date must be after the first payment deadline.",
          );

          return;
        }
      }

      try {
        await onApprove({
          room_uuid:
            roomUuid,

          payment_plan:
            paymentPlan,

          amount_due_now:
            paymentPlan
            === "partial"
              ? partialAmount
              : null,

          payment_due_at:
            paymentDueAt,

          remaining_due_at:
            paymentPlan
            === "partial"
              ? remainingDueAt
              : null,
        });
      } catch (
        requestError
      ) {
        setError(
          getErrorMessage(
            requestError,
          ),
        );
      }
    };

  const approveDisabled =
    busy
    ||
    !passportVerified
    ||
    availableRooms.length
      === 0
    ||
    systemTotal <= 0;

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
          <CreditCard
            size={22}
          />
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-950">
            Approve Booking
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Assign the room and
            choose how the customer
            will pay.
          </p>
        </div>
      </div>

      <form
        onSubmit={
          handleSubmit
        }
        className="mt-6 space-y-6"
      >
        <div>
          <label
            htmlFor="physical-room"
            className="text-sm font-semibold text-slate-700"
          >
            Physical Room
          </label>

          <select
            id="physical-room"
            value={roomUuid}
            onChange={(
              event,
            ) => {
              setRoomUuid(
                event
                  .target
                  .value,
              );

              setError("");
            }}
            disabled={busy}
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
          >
            <option value="">
              Select room
            </option>

            {availableRooms.map(
              (room) => (
                <option
                  key={
                    room.uuid
                  }
                  value={
                    room.uuid
                  }
                >
                  Room{" "}
                  {
                    room.room_number
                  }
                  {room.floor
                    ? ` · Floor ${room.floor}`
                    : ""}
                  {room.capacity
                    ? ` · Capacity ${room.capacity}`
                    : ""}
                </option>
              ),
            )}
          </select>

          {availableRooms.length
          === 0 ? (
            <p className="mt-2 text-sm font-medium text-amber-700">
              No active physical
              rooms currently match
              this booking request.
            </p>
          ) : null}
        </div>

        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
          <div className="flex items-center gap-2 text-blue-700">
            <Euro size={18} />

            <p className="text-sm font-semibold">
              System Calculated
              Booking Total
            </p>
          </div>

          <p className="mt-3 text-3xl font-bold text-blue-950">
            {formatMoney(
              systemTotal,
            )}
          </p>

          <p className="mt-2 text-xs leading-5 text-blue-700">
            Calculated from the
            booking rate, occupants
            and stay period. Admin
            cannot manually overwrite
            this amount here.
          </p>
        </div>

        <fieldset>
          <legend className="text-sm font-semibold text-slate-700">
            Payment Plan
          </legend>

          <div className="mt-3 grid gap-3">
            <label
              className={
                `flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
                  paymentPlan
                    === "full"
                    ? "border-blue-500 bg-blue-50"
                    : "border-slate-200 bg-white"
                }`
              }
            >
              <input
                type="radio"
                name="payment-plan"
                value="full"
                checked={
                  paymentPlan
                  === "full"
                }
                onChange={() =>
                  handlePlanChange(
                    "full",
                  )
                }
                disabled={busy}
                className="mt-1"
              />

              <span>
                <span className="block font-semibold text-slate-900">
                  Full Payment
                </span>

                <span className="mt-1 block text-sm leading-6 text-slate-500">
                  Customer pays the
                  complete{" "}
                  {formatMoney(
                    systemTotal,
                  )}{" "}
                  in one payment.
                </span>
              </span>
            </label>

            <label
              className={
                `flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
                  paymentPlan
                    === "partial"
                    ? "border-blue-500 bg-blue-50"
                    : "border-slate-200 bg-white"
                }`
              }
            >
              <input
                type="radio"
                name="payment-plan"
                value="partial"
                checked={
                  paymentPlan
                  === "partial"
                }
                onChange={() =>
                  handlePlanChange(
                    "partial",
                  )
                }
                disabled={busy}
                className="mt-1"
              />

              <span>
                <span className="block font-semibold text-slate-900">
                  Partial Payment
                </span>

                <span className="mt-1 block text-sm leading-6 text-slate-500">
                  Collect an initial
                  payment now and the
                  remaining balance
                  later.
                </span>
              </span>
            </label>
          </div>
        </fieldset>

        {paymentPlan
        === "partial" ? (
          <div>
            <label
              htmlFor="amount-due-now"
              className="text-sm font-semibold text-slate-700"
            >
              Amount Due Now (€)
            </label>

            <input
              id="amount-due-now"
              type="number"
              min="0.01"
              step="0.01"
              value={
                amountDueNow
              }
              onChange={(
                event,
              ) => {
                setAmountDueNow(
                  event
                    .target
                    .value,
                );

                setError("");
              }}
              disabled={busy}
              placeholder="300.00"
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
            />

            <p className="mt-2 text-xs leading-5 text-slate-500">
              Must be less than{" "}
              {formatMoney(
                systemTotal,
              )}.
            </p>
          </div>
        ) : null}

        <div>
          <label
            htmlFor="payment-due-at"
            className="text-sm font-semibold text-slate-700"
          >
            {paymentPlan
            === "full"
              ? "Payment Deadline"
              : "First Payment Deadline"}
          </label>

          <input
            id="payment-due-at"
            type="date"
            value={
              paymentDueAt
            }
            onChange={(
              event,
            ) => {
              setPaymentDueAt(
                event
                  .target
                  .value,
              );

              setError("");
            }}
            disabled={busy}
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
          />
        </div>

        {paymentPlan
        === "partial" ? (
          <div>
            <label
              htmlFor="remaining-due-at"
              className="text-sm font-semibold text-slate-700"
            >
              Remaining Balance
              Due Date
            </label>

            <input
              id="remaining-due-at"
              type="date"
              value={
                remainingDueAt
              }
              onChange={(
                event,
              ) => {
                setRemainingDueAt(
                  event
                    .target
                    .value,
                );

                setError("");
              }}
              disabled={busy}
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
            />
          </div>
        ) : null}

        <div className="rounded-2xl bg-slate-50 p-5">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-slate-500">
              Booking total
            </span>

            <strong className="text-slate-950">
              {formatMoney(
                systemTotal,
              )}
            </strong>
          </div>

          <div className="mt-3 flex items-center justify-between gap-4">
            <span className="text-sm text-slate-500">
              Due now
            </span>

            <strong className="text-blue-700">
              {formatMoney(
                effectiveDueNow,
              )}
            </strong>
          </div>

          <div className="mt-3 flex items-center justify-between gap-4 border-t border-slate-200 pt-3">
            <span className="text-sm font-medium text-slate-600">
              Remaining after
              first payment
            </span>

            <strong className="text-slate-950">
              {formatMoney(
                remainingBalance,
              )}
            </strong>
          </div>
        </div>

        {!passportVerified ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800">
            Verify the guest's
            passport proof before
            approving the booking.
          </div>
        ) : null}

        {error ? (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700"
          >
            {error}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={
            approveDisabled
          }
          className="w-full rounded-xl bg-emerald-600 px-6 py-4 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {busy
            ? "Approving..."
            : "Approve & Request Payment"}
        </button>
      </form>
    </section>
  );
}