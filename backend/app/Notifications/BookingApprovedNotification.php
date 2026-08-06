<?php

namespace App\Notifications;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class BookingApprovedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Booking $booking,
        public string $statusUrl
    ) {
        $this->afterCommit();
    }

    public function via(
        object $notifiable
    ): array {
        return [
            'mail',
        ];
    }

    public function toMail(
        object $notifiable
    ): MailMessage {
        $this->booking->loadMissing([
            'guest',
            'property',
            'items.roomType',
            'paymentInstallments',
        ]);

        $item =
            $this
                ->booking
                ->items
                ->first();

        $installments =
            $this
                ->booking
                ->paymentInstallments
                ->sortBy(
                    'installment_number'
                )
                ->values();

        $firstInstallment =
            $installments
                ->first();

        $secondInstallment =
            $installments
                ->get(1);

        $bookingTotal =
            (float)
            $this
                ->booking
                ->total_amount;

        $amountDueNow =
            (float) (
                $firstInstallment
                    ?->amount
                ?? $bookingTotal
            );

        $remainingAfterPayment =
            max(
                $bookingTotal
                - $amountDueNow,
                0
            );

        $message =
            (new MailMessage)
                ->subject(
                    'Payment required for your Alishan booking'
                )
                ->greeting(
                    'Hello '
                    .
                    $this
                        ->booking
                        ->guest
                        ->full_name
                    .
                    ','
                )
                ->line(
                    'Your accommodation booking request has been approved.'
                )
                ->line(
                    'Booking reference: '
                    .
                    $this
                        ->booking
                        ->booking_reference
                )
                ->line(
                    'Location: '
                    .
                    $this
                        ->booking
                        ->property
                        ->name
                )
                ->line(
                    'Room type: '
                    .
                    (
                        $item
                            ?->roomType
                            ?->name
                        ??
                        'Selected room type'
                    )
                )
                ->line(
                    'Total accommodation amount: '
                    .
                    $this->formatAmount(
                        $bookingTotal
                    )
                )
                ->line(
                    'Payment required now: '
                    .
                    $this->formatAmount(
                        $amountDueNow
                    )
                );

        if (
            $firstInstallment
                ?->due_at
        ) {
            $message->line(
                'First payment deadline: '
                .
                $this->formatDeadline(
                    $firstInstallment
                        ->due_at
                )
            );
        }

        if (
            $remainingAfterPayment > 0
        ) {
            $message->line(
                'Remaining balance after this payment: '
                .
                $this->formatAmount(
                    $remainingAfterPayment
                )
            );

            if (
                $secondInstallment
                    ?->due_at
            ) {
                $message->line(
                    'Remaining balance due: '
                    .
                    $this->formatDeadline(
                        $secondInstallment
                            ->due_at
                    )
                );
            }
        }

        return $message
            ->line(
                'Open your secure booking page to review the approved booking and complete the required payment.'
            )
            ->action(
                'View Booking & Pay',
                $this->statusUrl
            )
            ->line(
                'Your booking will only be confirmed after the required initial payment has been successfully received.'
            )
            ->line(
                'For security, passport information is never included in email messages.'
            )
            ->salutation(
                'Alishan Accommodation'
            );
    }

    private function formatAmount(
        float $amount
    ): string {
        return '€'
            .
            number_format(
                $amount,
                2,
                '.',
                ''
            );
    }

    private function formatDeadline(
        $date
    ): string {
        return $date
            ->copy()
            ->timezone(
                config(
                    'alishan.timezone',
                    'Europe/Vilnius'
                )
            )
            ->format(
                'd M Y'
            );
    }
}