<?php

namespace App\Services\Payments;

use App\Enums\BookingStatus;
use App\Enums\PaymentStatus;
use App\Models\Booking;
use App\Models\Payment;
use BackedEnum;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use RuntimeException;
use Stripe\Exception\ApiErrorException;
use Stripe\StripeClient;

class StripeCheckoutService
{
    private StripeClient $stripe;

    public function __construct()
    {
        $secret =
            (string)
            config(
                'services.stripe.secret'
            );

        if ($secret === '') {
            throw new RuntimeException(
                'Stripe secret key is not configured.'
            );
        }

        $this->stripe =
            new StripeClient(
                $secret
            );
    }

    public function create(
        Booking $booking,
        string $publicToken
    ): array {
        $prepared =
            DB::transaction(
                function () use (
                    $booking
                ) {
                    $lockedBooking =
                        Booking::query()
                            ->whereKey(
                                $booking
                                    ->getKey()
                            )
                            ->lockForUpdate()
                            ->firstOrFail();

                    $bookingStatus =
                        $this->enumValue(
                            $lockedBooking
                                ->booking_status
                        );

                    if (
                        ! in_array(
                            $bookingStatus,
                            [
                                BookingStatus
                                    ::AWAITING_PAYMENT
                                    ->value,

                                BookingStatus
                                    ::CONFIRMED
                                    ->value,
                            ],
                            true
                        )
                    ) {
                        throw ValidationException::withMessages([
                            'payment' => [
                                'Payment is not available for this booking.',
                            ],
                        ]);
                    }

                    $installment =
                        $lockedBooking
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
                            ->lockForUpdate()
                            ->first();

                    if (! $installment) {
                        throw ValidationException::withMessages([
                            'payment' => [
                                'There is no outstanding payment for this booking.',
                            ],
                        ]);
                    }

                    /*
                     * The first payment is the one
                     * responsible for converting an
                     * awaiting booking into confirmed.
                     */
                    if (
                        $bookingStatus
                            === BookingStatus
                                ::AWAITING_PAYMENT
                                ->value
                        &&
                        $installment
                            ->installment_number
                            === 1
                        &&
                        $installment
                            ->due_at
                        &&
                        $installment
                            ->due_at
                            ->isPast()
                        &&
                        (float)
                        $installment
                            ->paid_amount
                            <= 0.009
                    ) {
                        throw ValidationException::withMessages([
                            'payment' => [
                                'The initial payment deadline has expired.',
                            ],
                        ]);
                    }

                    $amount =
                        round(
                            (float)
                            $installment
                                ->amount
                            -
                            (float)
                            $installment
                                ->paid_amount,
                            2
                        );

                    if ($amount <= 0.009) {
                        throw ValidationException::withMessages([
                            'payment' => [
                                'This installment has already been paid.',
                            ],
                        ]);
                    }

                    $currency =
                        strtoupper(
                            $this->enumValue(
                                $lockedBooking
                                    ->currency
                                ?: 'EUR'
                            )
                        );

                    $payment =
                        Payment::query()
                            ->create([
                                'uuid' =>
                                    Str::uuid()
                                        ->toString(),

                                'booking_id' =>
                                    $lockedBooking
                                        ->id,

                                'payment_installment_id' =>
                                    $installment
                                        ->id,

                                'payment_reference' =>
                                    $this
                                        ->generatePaymentReference(),

                                'gateway' =>
                                    'stripe',

                                'amount' =>
                                    number_format(
                                        $amount,
                                        2,
                                        '.',
                                        ''
                                    ),

                                'currency' =>
                                    $currency,

                                'payment_status' =>
                                    PaymentStatus
                                        ::PENDING
                                        ->value,
                            ]);

                    return [
                        'booking' =>
                            $lockedBooking,

                        'installment' =>
                            $installment,

                        'payment' =>
                            $payment,

                        'amount' =>
                            $amount,

                        'currency' =>
                            $currency,
                    ];
                }
            );

        /** @var Booking $lockedBooking */
        $lockedBooking =
            $prepared['booking'];

        $lockedBooking
            ->loadMissing(
                'guest'
            );

        $installment =
            $prepared[
                'installment'
            ];

        /** @var Payment $payment */
        $payment =
            $prepared[
                'payment'
            ];

        $amount =
            $prepared[
                'amount'
            ];

        $currency =
            $prepared[
                'currency'
            ];

        $frontendUrl =
            rtrim(
                (string)
                config(
                    'services.frontend.url',
                    'http://localhost:5173'
                ),
                '/'
            );

        $encodedReference =
            rawurlencode(
                $lockedBooking
                    ->booking_reference
            );

        $encodedToken =
            rawurlencode(
                $publicToken
            );

        $successUrl =
            $frontendUrl
            . '/booking/status/'
            . $encodedReference
            . '?token='
            . $encodedToken
            . '&payment=success'
            . '&session_id={CHECKOUT_SESSION_ID}';

        $cancelUrl =
            $frontendUrl
            . '/booking/status/'
            . $encodedReference
            . '?token='
            . $encodedToken
            . '&payment=cancelled';

        try {
            $params = [
                'mode' =>
                    'payment',

                'client_reference_id' =>
                    $lockedBooking
                        ->booking_reference,

                'success_url' =>
                    $successUrl,

                'cancel_url' =>
                    $cancelUrl,

                'billing_address_collection' =>
                    'auto',

                'submit_type' =>
                    'pay',

                'locale' =>
                    'auto',

                'expires_at' =>
                    now()
                        ->addMinutes(31)
                        ->timestamp,

                'line_items' => [
                    [
                        'quantity' =>
                            1,

                        'price_data' => [
                            'currency' =>
                                strtolower(
                                    $currency
                                ),

                            'unit_amount' =>
                                $this
                                    ->toMinorUnits(
                                        $amount
                                    ),

                            'product_data' => [
                                'name' =>
                                    'Alishan Accommodation - '
                                    . $installment
                                        ->label,

                                'description' =>
                                    'Booking '
                                    . $lockedBooking
                                        ->booking_reference,
                            ],
                        ],
                    ],
                ],

                'metadata' => [
                    'booking_uuid' =>
                        (string)
                        $lockedBooking
                            ->uuid,

                    'booking_reference' =>
                        (string)
                        $lockedBooking
                            ->booking_reference,

                    'payment_uuid' =>
                        (string)
                        $payment
                            ->uuid,

                    'payment_reference' =>
                        (string)
                        $payment
                            ->payment_reference,

                    'installment_uuid' =>
                        (string)
                        $installment
                            ->uuid,

                    'installment_number' =>
                        (string)
                        $installment
                            ->installment_number,
                ],

                'payment_intent_data' => [
                    'metadata' => [
                        'booking_uuid' =>
                            (string)
                            $lockedBooking
                                ->uuid,

                        'booking_reference' =>
                            (string)
                            $lockedBooking
                                ->booking_reference,

                        'payment_uuid' =>
                            (string)
                            $payment
                                ->uuid,

                        'installment_uuid' =>
                            (string)
                            $installment
                                ->uuid,
                    ],
                ],
            ];

            if (
                $lockedBooking
                    ->guest
                    ?->email
            ) {
                $params[
                    'customer_email'
                ] =
                    $lockedBooking
                        ->guest
                        ->email;
            }

            $session =
                $this
                    ->stripe
                    ->checkout
                    ->sessions
                    ->create(
                        $params,
                        [
                            'idempotency_key' =>
                                'alishan_checkout_'
                                . $payment
                                    ->uuid,
                        ]
                    );

            $payment->update([
                'gateway_session_id' =>
                    $session->id,
            ]);

            return [
                'checkout_url' =>
                    $session->url,

                'session_id' =>
                    $session->id,

                'payment_uuid' =>
                    $payment->uuid,

                'payment_reference' =>
                    $payment
                        ->payment_reference,

                'installment_uuid' =>
                    $installment
                        ->uuid,

                'amount' =>
                    number_format(
                        $amount,
                        2,
                        '.',
                        ''
                    ),

                'currency' =>
                    $currency,
            ];
        } catch (
            ApiErrorException $exception
        ) {
            $payment->update([
                'payment_status' =>
                    PaymentStatus
                        ::FAILED
                        ->value,

                'failure_code' =>
                    'checkout_creation_failed',

                'failure_message' =>
                    'Stripe Checkout session could not be created.',
            ]);

            report(
                $exception
            );

            throw ValidationException::withMessages([
                'payment' => [
                    'Secure checkout could not be started. Please try again.',
                ],
            ]);
        }
    }

    private function toMinorUnits(
        float $amount
    ): int {
        return (int)
            round(
                $amount * 100
            );
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

    private function generatePaymentReference(): string
    {
        do {
            $reference =
                'PAY-'
                . now()->format(
                    'Ymd'
                )
                . '-'
                . Str::upper(
                    Str::random(10)
                );
        } while (
            Payment::withTrashed()
                ->where(
                    'payment_reference',
                    $reference
                )
                ->exists()
        );

        return $reference;
    }
}