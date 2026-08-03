<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PaymentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'uuid' => $this->uuid,

            'payment_reference' =>
                $this->payment_reference,

            'gateway' =>
                $this->gateway,

            'amount' =>
                $this->amount,

            'currency' =>
                $this->currency?->value,

            'status' =>
                $this->payment_status?->value,

            'paid_at' =>
                $this->paid_at?->toISOString(),

            'refunded_amount' =>
                $this->refunded_amount,

            'refunded_at' =>
                $this->refunded_at?->toISOString(),

            'created_at' =>
                $this->created_at?->toISOString(),
        ];
    }
}