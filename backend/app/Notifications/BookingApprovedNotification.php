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
        ]);

        $item =
            $this->booking
                ->items
                ->first();

        $amount =
            $this->formatAmount();

        $deadline =
            $this->formatDeadline();

        return (new MailMessage)
            ->subject(
                'Payment required for your Alishan booking'
            )
            ->greeting(
                'Hello '
                . $this->booking
                    ->guest
                    ->full_name
                . ','
            )
            ->line(
                'Your accommodation booking request has been approved.'
            )
            ->line(
                'Booking reference: '
                . $this->booking
                    ->booking_reference
            )
            ->line(
                'Location: '
                . $this->booking
                    ->property
                    ->name
            )
            ->line(
                'Room type: '
                . (
                    $item
                        ?->roomType
                        ?->name
                    ?? 'Selected room type'
                )
            )
            ->line(
                'Amount due: '
                . $amount
            )
            ->line(
                'Payment deadline: '
                . $deadline
            )
            ->line(
                'Open your secure booking page to review the approved booking and complete payment.'
            )
            ->action(
                'View Booking & Pay',
                $this->statusUrl
            )
            ->line(
                'Your booking is not confirmed until the required payment has been successfully received.'
            )
            ->line(
                'For security, passport information is never included in email messages.'
            )
            ->salutation(
                'Alishan Accommodation'
            );
    }

    private function formatAmount(): string
    {
        $amount =
            number_format(
                (float)
                $this->booking
                    ->total_amount,
                2,
                '.',
                ''
            );

        $currency =
            $this->booking
                ->currency
                ?->value
            ?? 'EUR';

        if ($currency === 'EUR') {
            return "€{$amount}";
        }

        return "{$amount} {$currency}";
    }

    private function formatDeadline(): string
    {
        if (
            ! $this->booking
                ->payment_due_at
        ) {
            return 'Please check your booking page.';
        }

        return $this->booking
            ->payment_due_at
            ->copy()
            ->timezone(
                config(
                    'alishan.timezone'
                )
            )
            ->format(
                'd M Y, H:i'
            );
    }
}