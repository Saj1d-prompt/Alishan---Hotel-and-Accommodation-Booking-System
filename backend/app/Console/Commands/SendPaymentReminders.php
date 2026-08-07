<?php

namespace App\Console\Commands;

use App\Models\PaymentInstallment;
use App\Services\PaymentNotificationService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Throwable;

class SendPaymentReminders extends Command
{
    protected $signature =
        'payments:send-reminders';

    protected $description =
        'Queue reminder emails for unpaid second installments due within 24 hours.';

    public function handle(
        PaymentNotificationService $paymentNotificationService
    ): int {
        $candidateIds =
            PaymentInstallment::query()
                ->where(
                    'installment_number',
                    2
                )
                ->where(
                    'status',
                    'pending'
                )
                ->whereNull(
                    'reminder_notification_queued_at'
                )
                ->whereNotNull(
                    'due_at'
                )
                ->whereColumn(
                    'paid_amount',
                    '<',
                    'amount'
                )
                ->where(
                    'due_at',
                    '>',
                    now()
                )
                ->where(
                    'due_at',
                    '<=',
                    now()->addDay()
                )
                ->whereHas(
                    'booking',
                    function ($query) {
                        $query->whereIn(
                            'booking_status',
                            [
                                'confirmed',
                                'checked_in',
                            ]
                        );
                    }
                )
                ->orderBy(
                    'id'
                )
                ->pluck(
                    'id'
                );

        $queued = 0;
        $failed = 0;

        foreach (
            $candidateIds as $installmentId
        ) {
            try {
                $wasQueued =
                    DB::transaction(
                        function () use (
                            $installmentId,
                            $paymentNotificationService
                        ): bool {
                            $installment =
                                PaymentInstallment::query()
                                    ->whereKey(
                                        $installmentId
                                    )
                                    ->lockForUpdate()
                                    ->first();

                            if (! $installment) {
                                return false;
                            }

                            $now =
                                now();

                            $remaining =
                                round(
                                    (float)
                                    $installment->amount
                                    -
                                    (float)
                                    $installment->paid_amount,
                                    2
                                );

                            if (
                                $installment
                                    ->installment_number
                                !== 2
                                ||
                                $installment
                                    ->status
                                !== 'pending'
                                ||
                                $remaining
                                <= 0.009
                                ||
                                $installment
                                    ->reminder_notification_queued_at
                                ||
                                ! $installment
                                    ->due_at
                                ||
                                ! $installment
                                    ->due_at
                                    ->isAfter(
                                        $now
                                    )
                                ||
                                $installment
                                    ->due_at
                                    ->isAfter(
                                        $now
                                            ->copy()
                                            ->addDay()
                                    )
                            ) {
                                return false;
                            }

                            $booking =
                                $installment
                                    ->booking()
                                    ->lockForUpdate()
                                    ->first();

                            if (! $booking) {
                                return false;
                            }

                            /*
                             * getRawOriginal keeps this safe even if
                             * BookingStatus is cast to a PHP enum.
                             */
                            $bookingStatus =
                                (string)
                                $booking
                                    ->getRawOriginal(
                                        'booking_status'
                                    );

                            if (
                                ! in_array(
                                    $bookingStatus,
                                    [
                                        'confirmed',
                                        'checked_in',
                                    ],
                                    true
                                )
                            ) {
                                return false;
                            }

                            $paymentNotificationService
                                ->sendRemainingPaymentReminder(
                                    $installment
                                );

                            $installment
                                ->reminder_notification_queued_at =
                                now();

                            $installment->save();

                            return true;
                        }
                    );

                if ($wasQueued) {
                    $queued++;
                }
            } catch (
                Throwable $exception
            ) {
                report(
                    $exception
                );

                $failed++;

                $this->error(
                    'Reminder failed for installment ID '
                    . $installmentId
                    . ': '
                    . $exception
                        ->getMessage()
                );
            }
        }

        $this->info(
            'Payment reminder scan complete. Queued: '
            . $queued
            . '; failed: '
            . $failed
            . '.'
        );

        return $failed > 0
            ? self::FAILURE
            : self::SUCCESS;
    }
}