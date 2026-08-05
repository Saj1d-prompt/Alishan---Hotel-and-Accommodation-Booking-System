<?php

namespace App\Http\Controllers\Api\V1\PublicApi;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBookingRequest;
use App\Http\Resources\PublicApi\PublicBookingResource;
use App\Models\Booking;
use App\Services\BookingRequestService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    public function __construct(
        private readonly
        BookingRequestService
        $bookingRequestService
    ) {
    }

    public function store(
        StoreBookingRequest $request
    ): JsonResponse {
        $result =
            $this
                ->bookingRequestService
                ->create(
                    $request->validated(),
                    $request->file(
                        'passport_copy'
                    )
                );

        return response()->json([
            'message' =>
                'Your booking request has been submitted for review.',

            'data' => [
                'booking' =>
                    (
                        new PublicBookingResource(
                            $result[
                                'booking'
                            ]
                        )
                    )->resolve(
                        $request
                    ),

                'access_token' =>
                    $result[
                        'access_token'
                    ],
            ],
        ], 201);
    }

    public function status(
        Request $request,
        string $bookingReference
    ): PublicBookingResource {
        $token = (string)
            $request->query(
                'token',
                ''
            );

        abort_if(
            $token === '',
            404
        );

        $booking =
            Booking::query()
                ->where(
                    'booking_reference',
                    $bookingReference
                )
                ->firstOrFail();

        $providedHash =
            hash(
                'sha256',
                $token
            );

        abort_unless(
            hash_equals(
                $booking
                    ->public_access_token_hash,
                $providedHash
            ),
            404
        );

        $booking->load([
            'guest',
            'property.city',
            'items.roomType',
            'items.contract',
            'items.priceList',
            'documents',
        ]);

        return new PublicBookingResource(
            $booking
        );
    }
}