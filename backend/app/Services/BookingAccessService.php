<?php

namespace App\Services;

use App\Models\Booking;

class BookingAccessService
{
    public function statusUrl(
        Booking $booking
    ): string {
        $token =
            $this->ensureAccessToken(
                $booking
            );

        return sprintf(
            '%s/booking/status/%s?token=%s',
            config(
                'alishan.frontend_url'
            ),
            rawurlencode(
                $booking
                    ->booking_reference
            ),
            rawurlencode($token)
        );
    }

    public function ensureAccessToken(
        Booking $booking
    ): string {
        /*
         * New bookings will already have the
         * encrypted token.
         */
        if (
            is_string(
                $booking
                    ->public_access_token
            )
            && $booking
                ->public_access_token !== ''
        ) {
            return $booking
                ->public_access_token;
        }

        /*
         * Existing development bookings were
         * created before encrypted token storage
         * was added.
         *
         * Generate a fresh one for them.
         */
        $token =
            bin2hex(
                random_bytes(32)
            );

        $booking->forceFill([
            'public_access_token' =>
                $token,

            'public_access_token_hash' =>
                hash(
                    'sha256',
                    $token
                ),
        ])->save();

        return $token;
    }
}