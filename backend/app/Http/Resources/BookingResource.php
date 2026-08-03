<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'uuid' => $this->uuid,

            'booking_reference' => $this->booking_reference,

            'guest_count' => $this->guest_count,

            'check_in_date' =>
                $this->check_in_date?->toDateString(),

            'check_out_date' =>
                $this->check_out_date?->toDateString(),

            'total_amount' => $this->total_amount,

            'currency' => $this->currency?->value,

            'status' => $this->booking_status?->value,

            'source' => $this->source,

            'reviewed_at' =>
                $this->reviewed_at?->toISOString(),

            'payment_due_at' =>
                $this->payment_due_at?->toISOString(),

            'confirmed_at' =>
                $this->confirmed_at?->toISOString(),

            'cancelled_at' =>
                $this->cancelled_at?->toISOString(),

            'rejection_reason' =>
                $this->rejection_reason,

            'guest' =>
                GuestResource::make(
                    $this->whenLoaded('guest')
                ),

            'property' =>
                PropertyResource::make(
                    $this->whenLoaded('property')
                ),

            'payments' =>
                PaymentResource::collection(
                    $this->whenLoaded('payments')
                ),

            'created_at' =>
                $this->created_at?->toISOString(),

            'updated_at' =>
                $this->updated_at?->toISOString(),
        ];
    }
}