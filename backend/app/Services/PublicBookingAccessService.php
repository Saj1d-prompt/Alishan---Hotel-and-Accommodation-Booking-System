<?php

namespace App\Services;

use App\Models\Booking;

class PublicBookingAccessService
{
    public function resolve(
        string $bookingReference,
        string $token
    ): Booking {
        $booking =
            Booking::query()
                ->where(
                    'booking_reference',
                    $bookingReference
                )
                ->first();

        if (
            ! $booking
            ||
            ! $booking
                ->public_access_token_hash
            ||
            $token === ''
        ) {
            abort(
                404,
                'Booking access link is invalid or expired.'
            );
        }

        $providedHash =
            hash(
                'sha256',
                $token
            );

        if (
            ! hash_equals(
                (string)
                $booking
                    ->public_access_token_hash,
                $providedHash
            )
        ) {
            abort(
                404,
                'Booking access link is invalid or expired.'
            );
        }

        return $booking;
    }
}