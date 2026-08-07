<?php

namespace App\Notifications;

use App\Models\Booking;
use App\Models\PaymentInstallment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class RemainingPaymentReminderNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Booking $booking,
        public PaymentInstallment $installment,
        public string $statusUrl
    ) {
        $this->afterCommit();
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $booking = $this->booking->fresh([
            'guest',
            'property',
        ]) ?? $this->booking;

        $installment = $this->installment->fresh()
            ?? $this->installment;

        $remaining = max(
            round(
                (float) $installment->amount
                -
                (float) $installment->paid_amount,
                2
            ),
            0
        );

        return (new MailMessage)
            ->subject(
                'Reminder: your remaining Alishan payment is due tomorrow'
            )
            ->greeting(
                'Hello '
                . $booking->guest->full_name
                . ','
            )
            ->line(
                'This is a reminder that the remaining balance for your Alishan Accommodation booking is due within approximately 24 hours.'
            )
            ->line(
                'Booking reference: '
                . $booking->booking_reference
            )
            ->line(
                'Location: '
                . $booking->property->name
            )
            ->line(
                'Amount due: '
                . $this->formatAmount(
                    $remaining
                )
            )
            ->line(
                'Payment deadline: '
                . $this->formatDeadline(
                    $installment->due_at
                )
            )
            ->action(
                'Pay Remaining Balance',
                $this->statusUrl
            )
            ->line(
                'If you have already completed this payment very recently, you may ignore this reminder after confirming the updated status on your secure booking page.'
            )
            ->line(
                'For security, card details and passport information are never included in email messages.'
            )
            ->salutation(
                'Alishan Accommodation'
            );
    }

    private function formatAmount(
        float $amount
    ): string {
        return '€'
            . number_format(
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
                'd M Y, H:i T'
            );
    }
}