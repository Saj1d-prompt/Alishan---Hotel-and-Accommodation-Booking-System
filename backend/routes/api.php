<?php

use App\Http\Controllers\Api\GuestController;
use App\Http\Controllers\Api\V1\Admin\AdminAuthController;
use App\Http\Controllers\Api\V1\Admin\BookingController as AdminBookingController;
use App\Http\Controllers\Api\V1\Admin\GuestDocumentController;
use App\Http\Controllers\Api\V1\PublicApi\BookingController as PublicBookingController;
use App\Http\Controllers\Api\V1\PublicApi\PropertyController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')
    ->group(function () {
        /*
         * PUBLIC CATALOGUE
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
         * PUBLIC BOOKING
         */
        Route::post(
            '/bookings',
            [
                PublicBookingController::class,
                'store',
            ]
        )->middleware(
            'throttle:10,1'
        );

        Route::get(
            '/bookings/{bookingReference}/status',
            [
                PublicBookingController::class,
                'status',
            ]
        )->middleware(
            'throttle:30,1'
        );

        /*
         * ADMIN LOGIN
         */
        Route::post(
            '/admin/login',
            [
                AdminAuthController::class,
                'login',
            ]
        )->middleware(
            'throttle:5,1'
        );

        /*
         * PROTECTED ADMIN API
         */
        Route::prefix('admin')
            ->middleware([
                'auth:sanctum',
                'admin',
            ])
            ->group(function () {
                Route::get(
                    '/me',
                    [
                        AdminAuthController::class,
                        'me',
                    ]
                );

                Route::post(
                    '/logout',
                    [
                        AdminAuthController::class,
                        'logout',
                    ]
                );

                /*
                 * Bookings
                 */
                Route::get(
                    '/bookings',
                    [
                        AdminBookingController::class,
                        'index',
                    ]
                );

                Route::get(
                    '/bookings/{booking:uuid}',
                    [
                        AdminBookingController::class,
                        'show',
                    ]
                );

                Route::post(
                    '/bookings/{booking:uuid}/approve',
                    [
                        AdminBookingController::class,
                        'approve',
                    ]
                );

                Route::post(
                    '/bookings/{booking:uuid}/reject',
                    [
                        AdminBookingController::class,
                        'reject',
                    ]
                );

                /*
                 * Passport documents
                 */
                Route::get(
                    '/guest-documents/{guestDocument:uuid}/download',
                    [
                        GuestDocumentController::class,
                        'download',
                    ]
                );

                Route::post(
                    '/guest-documents/{guestDocument:uuid}/verify',
                    [
                        GuestDocumentController::class,
                        'verify',
                    ]
                );

                Route::post(
                    '/guest-documents/{guestDocument:uuid}/reject',
                    [
                        GuestDocumentController::class,
                        'reject',
                    ]
                );

                /*
                 * Existing guest management.
                 */
                Route::apiResource(
                    'guests',
                    GuestController::class
                );
            });
    });