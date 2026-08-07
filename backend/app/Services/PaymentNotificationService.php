<?php

namespace App\Services;

use App\Models\Booking;
use App\Models\Payment;
use App\Models\PaymentInstallment;
use App\Notifications\PaymentReceivedNotification;
use App\Notifications\RemainingPaymentReminderNotification;
use Illuminate\Support\Facades\Notification;
use RuntimeException;

class PaymentNotificationService
{
    public function __construct(
        private BookingAccessService $bookingAccessService
    ) {
    }

    public function sendPaymentReceived(
        Booking $booking,
        Payment $payment,
        PaymentInstallment $installment
    ): void {
        $booking->loadMissing(
            'guest'
        );

        $email = trim(
            (string)
            $booking
                ->guest
                ?->email
        );

        if ($email === '') {
            throw new RuntimeException(
                'Guest email address is missing for payment receipt notification.'
            );
        }

        Notification::route(
            'mail',
            $email
        )->notify(
            new PaymentReceivedNotification(
                $booking,
                $payment,
                $installment,
                $this
                    ->bookingAccessService
                    ->statusUrl(
                        $booking
                    )
            )
        );
    }

    public function sendRemainingPaymentReminder(
        PaymentInstallment $installment
    ): void {
        $installment->loadMissing(
            'booking.guest'
        );

        $booking =
            $installment->booking;

        if (! $booking) {
            throw new RuntimeException(
                'Booking is missing for payment reminder notification.'
            );
        }

        $email = trim(
            (string)
            $booking
                ->guest
                ?->email
        );

        if ($email === '') {
            throw new RuntimeException(
                'Guest email address is missing for payment reminder notification.'
            );
        }

        Notification::route(
            'mail',
            $email
        )->notify(
            new RemainingPaymentReminderNotification(
                $booking,
                $installment,
                $this
                    ->bookingAccessService
                    ->statusUrl(
                        $booking
                    )
            )
        );
    }
}