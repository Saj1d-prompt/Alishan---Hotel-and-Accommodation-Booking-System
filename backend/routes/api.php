<?php

use App\Http\Controllers\Api\GuestController;
use App\Http\Controllers\Api\V1\Admin\GuestDocumentController;
use App\Http\Controllers\Api\V1\PublicApi\BookingController;
use App\Http\Controllers\Api\V1\PublicApi\PropertyController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    /*
     * Public catalogue.
     */
    Route::get(
        '/locations',
        [
            PropertyController::class,
            'index',
        ]
    );

    Route::get(
        '/locations/{property}',
        [
            PropertyController::class,
            'show',
        ]
    );

    Route::get(
        '/locations/{property}/room-types',
        [
            PropertyController::class,
            'roomTypes',
        ]
    );

    /*
     * Public booking request.
     */
    Route::post(
        '/bookings',
        [
            BookingController::class,
            'store',
        ]
    )->middleware(
        'throttle:10,1'
    );

    /*
     * Secure no-login booking status.
     */
    Route::get(
        '/bookings/{bookingReference}/status',
        [
            BookingController::class,
            'status',
        ]
    )->middleware(
        'throttle:30,1'
    );

    /*
     * Authenticated Admin APIs.
     */
    Route::middleware(
        'auth:sanctum'
    )->group(function () {
        Route::get(
            '/user',
            function (
                Request $request
            ) {
                return $request->user();
            }
        );

        Route::prefix('admin')
            ->group(function () {
                Route::apiResource(
                    'guests',
                    GuestController::class
                );

                Route::get(
                    '/guest-documents/{guestDocument}/download',
                    [
                        GuestDocumentController::class,
                        'download',
                    ]
                );
            });
    });
});