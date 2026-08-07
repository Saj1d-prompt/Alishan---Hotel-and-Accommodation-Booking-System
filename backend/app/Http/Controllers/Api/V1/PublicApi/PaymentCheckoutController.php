<?php

namespace App\Http\Controllers\Api\V1\PublicApi;

use App\Http\Controllers\Controller;
use App\Http\Requests\PublicApi\StartPaymentCheckoutRequest;
use App\Services\Payments\StripeCheckoutService;
use App\Services\PublicBookingAccessService;
use Illuminate\Http\JsonResponse;

class PaymentCheckoutController extends Controller
{
    public function store(
        string $bookingReference,
        StartPaymentCheckoutRequest $request,
        PublicBookingAccessService $bookingAccessService,
        StripeCheckoutService $stripeCheckoutService
    ): JsonResponse {
        $token =
            (string)
            $request->validated(
                'token'
            );

        $booking =
            $bookingAccessService
                ->resolve(
                    $bookingReference,
                    $token
                );

        $checkout =
            $stripeCheckoutService
                ->create(
                    $booking,
                    $token
                );

        return response()->json([
            'data' =>
                $checkout,
        ]);
    }
}