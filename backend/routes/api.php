<?php

use App\Http\Controllers\Api\GuestController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {

    Route::middleware('auth:sanctum')
        ->get('/user', function (Request $request) {
            return $request->user();
        });

    /*
     * Administrative APIs.
     *
     * Role-level Admin authorization will be added when
     * we implement Admin authentication.
     */
    Route::middleware('auth:sanctum')
        ->prefix('admin')
        ->group(function () {

            Route::apiResource(
                'guests',
                GuestController::class
            );
        });
});