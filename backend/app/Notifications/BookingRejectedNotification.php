<?php

namespace App\Notifications;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class BookingRejectedNotification extends Notification implements ShouldQueue
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
        ]);

        $message =
            (new MailMessage)
                ->subject(
                    'Update to your Alishan booking request'
                )
                ->greeting(
                    'Hello '
                    . $this->booking
                        ->guest
                        ->full_name
                    . ','
                )
                ->line(
                    'Your accommodation booking request has been reviewed.'
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
                    'Unfortunately, this booking request was not approved.'
                );

        if (
            $this->booking
                ->rejection_reason
        ) {
            $message->line(
                'Reason: '
                . $this->booking
                    ->rejection_reason
            );
        }

        return $message
            ->action(
                'View Booking Status',
                $this->statusUrl
            )
            ->line(
                'You may contact Alishan Accommodation if you need assistance.'
            )
            ->line(
                'Email: '
                . config(
                    'alishan.support_email'
                )
            )
            ->line(
                'Phone: '
                . config(
                    'alishan.support_phone'
                )
            )
            ->salutation(
                'Alishan Accommodation'
            );
    }
}