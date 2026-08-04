<?php

use App\Http\Controllers\Api\GuestController;
use App\Http\Controllers\Api\V1\PublicApi\PropertyController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    /*
     * Public accommodation catalogue.
     */
    Route::get(
        '/locations',
        [PropertyController::class, 'index']
    );

    Route::get(
        '/locations/{property}',
        [PropertyController::class, 'show']
    );

    Route::get(
        '/locations/{property}/room-types',
        [PropertyController::class, 'roomTypes']
    );

    /*
     * Authenticated Admin APIs.
     */
    Route::middleware('auth:sanctum')
        ->get('/user', function (Request $request) {
            return $request->user();
        });

    Route::middleware('auth:sanctum')
        ->prefix('admin')
        ->group(function () {
            Route::apiResource(
                'guests',
                GuestController::class
            );
        });
});