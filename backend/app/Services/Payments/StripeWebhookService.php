<?php

namespace App\Services\Payments;

use App\Enums\BookingStatus;
use App\Enums\PaymentStatus;
use App\Models\Booking;
use App\Models\Payment;
use App\Models\PaymentGatewayEvent;
use App\Models\PaymentInstallment;
use App\Services\PaymentNotificationService;
use BackedEnum;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
use RuntimeException;
use Stripe\Event;
use Throwable;

class StripeWebhookService
{
    public function __construct(
        private PaymentNotificationService $paymentNotificationService
    ) {
    }

    public function handle(
        Event $event,
        string $rawPayload
    ): void {
        $eventRecord =
            $this->getOrCreateEvent(
                $event,
                $rawPayload
            );

        /*
         * Stripe may deliver the same event more than once.
         */
        if (
            $eventRecord
                ->processed_at
        ) {
            return;
        }

        try {
            $object =
                $event
                    ->data
                    ->object;

            switch (
                $event->type
            ) {
                case 'checkout.session.completed':
                    if (
                        (
                            $object
                                ->payment_status
                            ?? null
                        )
                        === 'paid'
                    ) {
                        $this
                            ->markPaymentPaid(
                                $object
                            );
                    }

                    break;

                case 'checkout.session.async_payment_succeeded':
                    $this
                        ->markPaymentPaid(
                            $object
                        );

                    break;

                case 'checkout.session.async_payment_failed':
                    $this
                        ->markPaymentFailed(
                            $object,
                            'async_payment_failed',
                            'Stripe reported that the payment failed.'
                        );

                    break;

                case 'checkout.session.expired':
                    $this
                        ->markPaymentFailed(
                            $object,
                            'checkout_session_expired',
                            'Stripe Checkout session expired before payment.'
                        );

                    break;

                default:
                    break;
            }

            $eventRecord->update([
                'status' =>
                    'processed',

                'processed_at' =>
                    now(),

                'error_message' =>
                    null,
            ]);
        } catch (
            Throwable $exception
        ) {
            $eventRecord->update([
                'status' =>
                    'failed',

                'error_message' =>
                    mb_substr(
                        $exception
                            ->getMessage(),
                        0,
                        2000
                    ),
            ]);

            throw $exception;
        }
    }

    private function markPaymentPaid(
        object $session
    ): void {
        DB::transaction(
            function () use (
                $session
            ) {
                $payment =
                    $this
                        ->findPaymentForSession(
                            $session,
                            true
                        );

                if (! $payment) {
                    throw new RuntimeException(
                        'Stripe payment record was not found.'
                    );
                }

                $currentPaymentStatus =
                    $this->enumValue(
                        $payment
                            ->payment_status
                    );

                /*
                 * A refunded transaction must never
                 * be processed as a new successful payment.
                 */
                if (
                    $currentPaymentStatus
                    ===
                    PaymentStatus
                        ::REFUNDED
                        ->value
                ) {
                    return;
                }

                /*
                 * A previous Stripe webhook attempt may have
                 * committed the payment successfully but failed
                 * before the receipt notification was queued.
                 *
                 * If that happens, Stripe retries the webhook
                 * and we queue only the missing receipt.
                 */
                if (
                    $currentPaymentStatus
                    ===
                    PaymentStatus
                        ::PAID
                        ->value
                ) {
                    if (
                        $payment
                            ->receipt_notification_queued_at
                        ||
                        $payment
                            ->failure_code
                        ===
                        'duplicate_payment_review'
                    ) {
                        return;
                    }

                    $installment =
                        PaymentInstallment::query()
                            ->whereKey(
                                $payment
                                    ->payment_installment_id
                            )
                            ->lockForUpdate()
                            ->first();

                    if (! $installment) {
                        throw new RuntimeException(
                            'Payment installment was not found.'
                        );
                    }

                    $booking =
                        Booking::query()
                            ->whereKey(
                                $payment
                                    ->booking_id
                            )
                            ->lockForUpdate()
                            ->first();

                    if (! $booking) {
                        throw new RuntimeException(
                            'Booking was not found.'
                        );
                    }

                    $this
                        ->queuePaymentReceipt(
                            $booking,
                            $payment,
                            $installment
                        );

                    return;
                }

                /*
                 * Before changing our database,
                 * verify amount and currency against
                 * what our own Payment record expected.
                 */
                $this
                    ->validateStripeAmount(
                        $payment,
                        $session
                    );

                $installment =
                    PaymentInstallment::query()
                        ->whereKey(
                            $payment
                                ->payment_installment_id
                        )
                        ->lockForUpdate()
                        ->first();

                if (! $installment) {
                    throw new RuntimeException(
                        'Payment installment was not found.'
                    );
                }

                $booking =
                    Booking::query()
                        ->whereKey(
                            $payment
                                ->booking_id
                        )
                        ->lockForUpdate()
                        ->first();

                if (! $booking) {
                    throw new RuntimeException(
                        'Booking was not found.'
                    );
                }

                if (
                    $installment
                        ->booking_id
                    !==
                    $booking
                        ->id
                ) {
                    throw new RuntimeException(
                        'Payment installment does not belong to the booking.'
                    );
                }

                $paymentIntentId =
                    $this->stripeId(
                        $session
                            ->payment_intent
                        ?? null
                    );

                $payment
                    ->payment_status =
                    PaymentStatus
                        ::PAID
                        ->value;

                $payment
                    ->gateway_payment_intent_id =
                    $paymentIntentId;

                $payment
                    ->transaction_id =
                    $paymentIntentId;

                $payment
                    ->paid_at =
                    now();

                $payment
                    ->failure_code =
                    null;

                $payment
                    ->failure_message =
                    null;

                /*
                 * Calculate how much can actually be applied
                 * to the installment.
                 */
                $installmentAmount =
                    round(
                        (float)
                        $installment
                            ->amount,
                        2
                    );

                $alreadyPaid =
                    round(
                        (float)
                        $installment
                            ->paid_amount,
                        2
                    );

                $remaining =
                    max(
                        round(
                            $installmentAmount
                            -
                            $alreadyPaid,
                            2
                        ),
                        0
                    );

                $receivedAmount =
                    round(
                        (float)
                        $payment
                            ->amount,
                        2
                    );

                $appliedAmount =
                    min(
                        $receivedAmount,
                        $remaining
                    );

                /*
                 * Stripe succeeded but this installment had
                 * already been paid by another Checkout.
                 *
                 * Do not reduce the accommodation balance twice.
                 */
                if (
                    $receivedAmount > 0
                    &&
                    $appliedAmount
                    <= 0.009
                ) {
                    $payment
                        ->failure_code =
                        'duplicate_payment_review';

                    $payment
                        ->failure_message =
                        'Paid transaction requires manual duplicate-payment/refund review.';
                }

                $payment->save();

                /*
                 * Apply payment to installment.
                 */
                if (
                    $appliedAmount > 0
                ) {
                    $newPaidAmount =
                        min(
                            round(
                                $alreadyPaid
                                +
                                $appliedAmount,
                                2
                            ),
                            $installmentAmount
                        );

                    $installment
                        ->paid_amount =
                        number_format(
                            $newPaidAmount,
                            2,
                            '.',
                            ''
                        );

                    if (
                        $newPaidAmount
                        >=
                        $installmentAmount
                        -
                        0.009
                    ) {
                        $installment
                            ->status =
                            'paid';

                        $installment
                            ->paid_at =
                            now();
                    }

                    $installment->save();
                }

                /*
                 * First successful required installment
                 * confirms the accommodation booking.
                 */
                $bookingStatus =
                    $this->enumValue(
                        $booking
                            ->booking_status
                    );

                if (
                    $installment
                        ->installment_number
                    === 1
                    &&
                    $installment
                        ->status
                    === 'paid'
                    &&
                    $bookingStatus
                    ===
                    BookingStatus
                        ::AWAITING_PAYMENT
                        ->value
                ) {
                    $booking
                        ->booking_status =
                        BookingStatus
                            ::CONFIRMED
                            ->value;

                    $booking
                        ->confirmed_at =
                        $booking
                            ->confirmed_at
                        ??
                        now();
                }

                /*
                 * Point booking.payment_due_at to
                 * whatever unpaid installment comes next.
                 */
                $nextInstallment =
                    $booking
                        ->paymentInstallments()
                        ->where(
                            'status',
                            'pending'
                        )
                        ->whereColumn(
                            'paid_amount',
                            '<',
                            'amount'
                        )
                        ->orderBy(
                            'installment_number'
                        )
                        ->first();

                $booking
                    ->payment_due_at =
                    $nextInstallment
                        ?->due_at;

                $booking->save();

                /*
                 * Only send a payment receipt when money
                 * was actually applied to the booking.
                 */
                if (
                    $appliedAmount
                    > 0.009
                ) {
                    $this
                        ->queuePaymentReceipt(
                            $booking,
                            $payment,
                            $installment
                        );
                }
            }
        );
    }

    private function queuePaymentReceipt(
        Booking $booking,
        Payment $payment,
        PaymentInstallment $installment
    ): void {
        /*
         * Protect against duplicate Stripe webhook deliveries.
         */
        if (
            $payment
                ->receipt_notification_queued_at
        ) {
            return;
        }

        $this
            ->paymentNotificationService
            ->sendPaymentReceived(
                $booking,
                $payment,
                $installment
            );

        $payment
            ->receipt_notification_queued_at =
            now();

        $payment->save();
    }

    private function markPaymentFailed(
        object $session,
        string $failureCode,
        string $failureMessage
    ): void {
        DB::transaction(
            function () use (
                $session,
                $failureCode,
                $failureMessage
            ) {
                $payment =
                    $this
                        ->findPaymentForSession(
                            $session,
                            true
                        );

                if (! $payment) {
                    return;
                }

                $currentStatus =
                    $this->enumValue(
                        $payment
                            ->payment_status
                    );

                /*
                 * Never downgrade an already-paid or
                 * refunded transaction.
                 */
                if (
                    in_array(
                        $currentStatus,
                        [
                            PaymentStatus
                                ::PAID
                                ->value,

                            PaymentStatus
                                ::REFUNDED
                                ->value,
                        ],
                        true
                    )
                ) {
                    return;
                }

                $payment->update([
                    'payment_status' =>
                        PaymentStatus
                            ::FAILED
                            ->value,

                    'failure_code' =>
                        $failureCode,

                    'failure_message' =>
                        $failureMessage,
                ]);
            }
        );
    }

    private function findPaymentForSession(
        object $session,
        bool $lock
    ): ?Payment {
        $query =
            Payment::query()
                ->where(
                    'gateway',
                    'stripe'
                );

        if (
            ! empty(
                $session->id
            )
        ) {
            $query->where(
                'gateway_session_id',
                (string)
                $session->id
            );
        } else {
            $paymentUuid =
                $session
                    ->metadata
                    ->payment_uuid
                ??
                null;

            if (! $paymentUuid) {
                return null;
            }

            $query->where(
                'uuid',
                (string)
                $paymentUuid
            );
        }

        if ($lock) {
            $query->lockForUpdate();
        }

        return $query->first();
    }

    private function validateStripeAmount(
        Payment $payment,
        object $session
    ): void {
        $expectedMinor =
            (int)
            round(
                (float)
                $payment
                    ->amount
                *
                100
            );

        $receivedMinor =
            (int)
            (
                $session
                    ->amount_total
                ??
                -1
            );

        if (
            $expectedMinor
            !==
            $receivedMinor
        ) {
            throw new RuntimeException(
                'Stripe payment amount does not match the expected payment amount.'
            );
        }

        $expectedCurrency =
            strtolower(
                $this->enumValue(
                    $payment
                        ->currency
                )
            );

        $receivedCurrency =
            strtolower(
                (string)
                (
                    $session
                        ->currency
                    ??
                    ''
                )
            );

        if (
            $expectedCurrency
            !==
            $receivedCurrency
        ) {
            throw new RuntimeException(
                'Stripe payment currency does not match the expected currency.'
            );
        }
    }

    private function getOrCreateEvent(
        Event $event,
        string $rawPayload
    ): PaymentGatewayEvent {
        $existing =
            PaymentGatewayEvent::query()
                ->where(
                    'gateway',
                    'stripe'
                )
                ->where(
                    'event_id',
                    $event->id
                )
                ->first();

        if ($existing) {
            return $existing;
        }

        try {
            return PaymentGatewayEvent::query()
                ->create([
                    'gateway' =>
                        'stripe',

                    'event_id' =>
                        $event->id,

                    'event_type' =>
                        $event->type,

                    'status' =>
                        'received',

                    'payload_hash' =>
                        hash(
                            'sha256',
                            $rawPayload
                        ),
                ]);
        } catch (
            QueryException
        ) {
            /*
             * Another webhook request may have inserted
             * the same unique Stripe event simultaneously.
             */
            return PaymentGatewayEvent::query()
                ->where(
                    'gateway',
                    'stripe'
                )
                ->where(
                    'event_id',
                    $event->id
                )
                ->firstOrFail();
        }
    }

    private function enumValue(
        mixed $value
    ): string {
        if (
            $value
            instanceof BackedEnum
        ) {
            return (string)
                $value->value;
        }

        return (string)
            $value;
    }

    private function stripeId(
        mixed $value
    ): ?string {
        if (
            is_string(
                $value
            )
            &&
            $value !== ''
        ) {
            return $value;
        }

        if (
            is_object(
                $value
            )
            &&
            isset(
                $value->id
            )
        ) {
            return (string)
                $value->id;
        }

        return null;
    }
}