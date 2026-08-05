<?php

namespace App\Http\Resources\PublicApi;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PublicBookingResource extends JsonResource
{
    public function toArray(
        Request $request
    ): array {
        $item =
            $this->relationLoaded(
                'items'
            )
                ? $this
                    ->items
                    ->first()
                : null;

        $document =
            $this->relationLoaded(
                'documents'
            )
                ? $this
                    ->documents
                    ->first()
                : null;

        return [
            'booking_reference' =>
                $this
                    ->booking_reference,

            'status' =>
                $this
                    ->booking_status
                    ?->value,

            'status_label' =>
                str(
                    $this
                        ->booking_status
                        ?->value
                    ?? ''
                )
                    ->replace(
                        '_',
                        ' '
                    )
                    ->title()
                    ->toString(),

            'submitted_at' =>
                $this
                    ->submitted_at
                    ?->toISOString(),

            'applicant' => [
                'full_name' =>
                    $this
                        ->guest
                        ?->full_name,

                'email' =>
                    $this
                        ->guest
                        ?->email,

                'phone' =>
                    $this
                        ->guest
                        ?->phone,
            ],

            'property' => [
                'name' =>
                    $this
                        ->property
                        ?->name,

                'slug' =>
                    $this
                        ->property
                        ?->slug,

                'city' =>
                    $this
                        ->property
                        ?->city
                        ?->name,
            ],

            'stay' => [
                'check_in_date' =>
                    $this
                        ->check_in_date
                        ?->toDateString(),

                'check_out_date' =>
                    $this
                        ->check_out_date
                        ?->toDateString(),

                'occupants' =>
                    $this->guest_count,

                'room_type' =>
                    $item
                        ?->roomType
                        ?->name,

                'term' =>
                    $item
                        ?->contract
                        ?->name,

                'billing_unit' =>
                    $item
                        ?->billing_unit,

                'duration_units' =>
                    $item
                        ?->duration_units,
            ],

            'pricing' => [
                'unit_price' =>
                    $item
                        ?->unit_price,

                'charge_basis' =>
                    $item
                        ?->charge_basis,

                'estimated_total_amount' =>
                    $this
                        ->estimated_total_amount,

                'payable_amount' =>
                    $this
                        ->total_amount,

                'currency' =>
                    $this
                        ->currency
                        ?->value,
            ],

            'passport_proof' => [
                'status' =>
                    $document
                        ?->verification_status,
            ],

            'review' => [
                'reviewed_at' =>
                    $this
                        ->reviewed_at
                        ?->toISOString(),

                'rejection_reason' =>
                    $this
                        ->rejection_reason,
            ],

            'payment' => [
                'due_at' =>
                    $this
                        ->payment_due_at
                        ?->toISOString(),

                'confirmed_at' =>
                    $this
                        ->confirmed_at
                        ?->toISOString(),
            ],
        ];
    }
}