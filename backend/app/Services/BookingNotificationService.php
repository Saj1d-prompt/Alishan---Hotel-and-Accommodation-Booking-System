<?php

namespace App\Services;

use App\Models\Booking;
use App\Notifications\BookingApprovedNotification;
use App\Notifications\BookingRejectedNotification;
use App\Notifications\BookingSubmittedNotification;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;
use Throwable;

class BookingNotificationService
{
    public function __construct(
        private readonly
        BookingAccessService
        $bookingAccessService
    ) {
    }

    public function submitted(
        Booking $booking
    ): void {
        $this->sendSafely(
            $booking,
            new BookingSubmittedNotification(
                $booking,
                $this
                    ->bookingAccessService
                    ->statusUrl(
                        $booking
                    )
            )
        );
    }

    public function approved(
        Booking $booking
    ): void {
        $this->sendSafely(
            $booking,
            new BookingApprovedNotification(
                $booking,
                $this
                    ->bookingAccessService
                    ->statusUrl(
                        $booking
                    )
            )
        );
    }

    public function rejected(
        Booking $booking
    ): void {
        $this->sendSafely(
            $booking,
            new BookingRejectedNotification(
                $booking,
                $this
                    ->bookingAccessService
                    ->statusUrl(
                        $booking
                    )
            )
        );
    }

    private function sendSafely(
        Booking $booking,
        object $notification
    ): void {
        try {
            $booking->loadMissing(
                'guest'
            );

            $email =
                $booking
                    ->guest
                    ?->email;

            if (! $email) {
                Log::warning(
                    'Booking email was not sent because the guest has no email address.',
                    [
                        'booking_id' =>
                            $booking->id,

                        'booking_reference' =>
                            $booking
                                ->booking_reference,
                    ]
                );

                return;
            }

            Notification::route(
                'mail',
                $email
            )->notify(
                $notification
            );
        } catch (Throwable $exception) {
            /*
             * An email problem must never undo an
             * already-created or approved booking.
             */
            Log::error(
                'Booking notification could not be dispatched.',
                [
                    'booking_id' =>
                        $booking->id,

                    'booking_reference' =>
                        $booking
                            ->booking_reference,

                    'error' =>
                        $exception
                            ->getMessage(),
                ]
            );
        }
    }
}