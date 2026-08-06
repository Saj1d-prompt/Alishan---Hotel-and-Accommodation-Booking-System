<?php

namespace App\Services;

use App\Models\Booking;
use Carbon\CarbonImmutable;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Str;

class BookingPaymentPlanService
{
    public function createForApproval(
        Booking $booking,
        array $data
    ): void {
        $bookingTotal =
            round(
                (float)
                $booking
                    ->estimated_total_amount,
                2
            );

        if (
            $bookingTotal <= 0
        ) {
            throw ValidationException::withMessages([
                'payment_plan' => [
                    'The booking does not have a valid system-calculated total.',
                ],
            ]);
        }

        $paymentPlan =
            $data[
                'payment_plan'
            ];

        $firstDueAt =
            $this->endOfBusinessDay(
                $data[
                    'payment_due_at'
                ]
            );

        if (
            $paymentPlan
            === 'full'
        ) {
            $amountDueNow =
                $bookingTotal;

            $remainingAmount =
                0;
        } else {
            $amountDueNow =
                round(
                    (float)
                    $data[
                        'amount_due_now'
                    ],
                    2
                );

            if (
                $amountDueNow <= 0
                ||
                $amountDueNow
                    >= $bookingTotal
            ) {
                throw ValidationException::withMessages([
                    'amount_due_now' => [
                        'The partial payment must be greater than zero and less than the full booking total.',
                    ],
                ]);
            }

            $remainingAmount =
                round(
                    $bookingTotal
                    - $amountDueNow,
                    2
                );
        }

        /*
         * Approval is only possible while the
         * booking is pending review, so no paid
         * installments should exist here.
         */
        $booking
            ->paymentInstallments()
            ->delete();

        $booking
            ->paymentInstallments()
            ->create([
                'uuid' =>
                    (string)
                    Str::uuid(),

                'installment_number' =>
                    1,

                'label' =>
                    $paymentPlan
                    === 'full'
                        ? 'Full payment'
                        : 'Initial payment',

                'amount' =>
                    $amountDueNow,

                'paid_amount' =>
                    0,

                'due_at' =>
                    $firstDueAt,

                'status' =>
                    'pending',
            ]);

        if (
            $remainingAmount > 0
        ) {
            $remainingDueAt =
                $this->endOfBusinessDay(
                    $data[
                        'remaining_due_at'
                    ]
                );

            $booking
                ->paymentInstallments()
                ->create([
                    'uuid' =>
                        (string)
                        Str::uuid(),

                    'installment_number' =>
                        2,

                    'label' =>
                        'Remaining balance',

                    'amount' =>
                        $remainingAmount,

                    'paid_amount' =>
                        0,

                    'due_at' =>
                        $remainingDueAt,

                    'status' =>
                        'pending',
                ]);
        }

        /*
         * total_amount now represents the complete
         * booking total, NOT the amount Stripe
         * should charge right now.
         *
         * The currently payable amount is obtained
         * from the next payment installment.
         */
        $booking->forceFill([
            'total_amount' =>
                $bookingTotal,

            /*
             * Keep this existing booking column
             * synced with the current installment
             * for backward compatibility.
             */
            'payment_due_at' =>
                $firstDueAt,
        ])->save();
    }

    private function endOfBusinessDay(
        string $date
    ): CarbonImmutable {
        return CarbonImmutable::createFromFormat(
            '!Y-m-d',
            $date,
            config(
                'alishan.timezone',
                'Europe/Vilnius'
            )
        )
            ->endOfDay()
            ->utc();
    }
}