<?php

namespace App\Http\Controllers\Api\V1\Webhooks;

use App\Http\Controllers\Controller;
use App\Services\Payments\StripeWebhookService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Stripe\Exception\SignatureVerificationException;
use Stripe\Webhook;
use Throwable;
use UnexpectedValueException;

class StripeWebhookController extends Controller
{
    public function handle(
        Request $request,
        StripeWebhookService $webhookService
    ): JsonResponse {
        $payload =
            $request->getContent();

        $signature =
            (string)
            $request->header(
                'Stripe-Signature',
                ''
            );

        $webhookSecret =
            (string)
            config(
                'services.stripe.webhook_secret'
            );

        if ($webhookSecret === '') {
            return response()->json([
                'message' =>
                    'Stripe webhook secret is not configured.',
            ], 500);
        }

        try {
            $event =
                Webhook::constructEvent(
                    $payload,
                    $signature,
                    $webhookSecret
                );
        } catch (
            UnexpectedValueException
            |
            SignatureVerificationException
            $exception
        ) {
            return response()->json([
                'message' =>
                    'Invalid Stripe webhook.',
            ], 400);
        }

        try {
            $webhookService
                ->handle(
                    $event,
                    $payload
                );
        } catch (
            Throwable $exception
        ) {
            /*
             * Report it and return a failure.
             * Stripe can then retry delivery.
             */
            report(
                $exception
            );

            return response()->json([
                'message' =>
                    'Webhook processing failed.',
            ], 500);
        }

        return response()->json([
            'received' =>
                true,
        ]);
    }
}