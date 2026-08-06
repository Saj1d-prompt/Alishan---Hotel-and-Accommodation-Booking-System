<?php

namespace App\Notifications;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class BookingSubmittedNotification extends Notification implements ShouldQueue
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
            'items.contract',
        ]);

        $item =
            $this->booking
                ->items
                ->first();

        return (new MailMessage)
            ->subject(
                'We received your Alishan booking request'
            )
            ->greeting(
                'Hello '
                . $this->booking
                    ->guest
                    ->full_name
                . ','
            )
            ->line(
                'Thank you for submitting your accommodation request to Alishan Accommodation.'
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
                'Current status: Pending Review'
            )
            ->line(
                'Your application and passport proof must be reviewed before payment becomes available.'
            )
            ->action(
                'View Booking Status',
                $this->statusUrl
            )
            ->line(
                'No payment is required at this stage.'
            )
            ->line(
                'For security, passport information is never included in email messages.'
            )
            ->salutation(
                'Alishan Accommodation'
            );
    }
}