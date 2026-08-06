<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminBookingResource extends JsonResource
{
    public function toArray(
        Request $request
    ): array {
        $item = $this
            ->items
            ->first();

        return [
            'uuid' =>
            $this->uuid,

            'booking_reference' =>
            $this->booking_reference,

            'status' =>
            $this
                ->booking_status
                ?->value,

            'guest_count' =>
            $this->guest_count,

            'check_in_date' =>
            $this
                ->check_in_date
                ?->toDateString(),

            'check_out_date' =>
            $this
                ->check_out_date
                ?->toDateString(),

            'submitted_at' =>
            $this
                ->submitted_at
                ?->toISOString(),

            'reviewed_at' =>
            $this
                ->reviewed_at
                ?->toISOString(),

            'payment_due_at' =>
            $this
                ->payment_due_at
                ?->toISOString(),

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

            'notes' =>
            $this->notes,

            'rejection_reason' =>
            $this
                ->rejection_reason,

            'guest' => [
                'uuid' =>
                $this
                    ->guest
                    ?->uuid,

                'name' =>
                $this
                    ->guest
                    ?->full_name,

                'first_name' =>
                $this
                    ->guest
                    ?->first_name,

                'last_name' =>
                $this
                    ->guest
                    ?->last_name,

                'email' =>
                $this
                    ->guest
                    ?->email,

                'phone' =>
                $this
                    ->guest
                    ?->phone,

                'passport_number' =>
                $this
                    ->guest
                    ?->masked_document_number,
            ],

            'property' => [
                'uuid' =>
                $this
                    ->property
                    ?->uuid,

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

            'room_type' => [
                'uuid' =>
                $item
                    ?->roomType
                    ?->uuid,

                'name' =>
                $item
                    ?->roomType
                    ?->name,

                'capacity' =>
                $item
                    ?->roomType
                    ?->default_capacity,
            ],

            'assigned_room' =>
            $item?->room
                ? [
                    'uuid' =>
                    $item
                        ->room
                        ->uuid,

                    'room_number' =>
                    $item
                        ->room
                        ->room_number,

                    'floor' =>
                    $item
                        ->room
                        ->floor,

                    'capacity' =>
                    $item
                        ->room
                        ->capacity,
                ]
                : null,

            'contract' => [
                'uuid' =>
                $item
                    ?->contract
                    ?->uuid,

                'code' =>
                $item
                    ?->contract
                    ?->code,

                'name' =>
                $item
                    ?->contract
                    ?->name,

                'billing_unit' =>
                $item
                    ?->billing_unit,
            ],

            'pricing' => [
                'unit_price' =>
                $item
                    ?->unit_price,

                'charge_basis' =>
                $item
                    ?->charge_basis,

                'duration_units' =>
                $item
                    ?->duration_units,

                'subtotal' =>
                $item
                    ?->subtotal,
            ],

            'passport_documents' =>
            $this
                ->documents
                ->map(
                    fn($document) => [
                        'uuid' =>
                        $document->uuid,

                        'original_name' =>
                        $document
                            ->original_name,

                        'mime_type' =>
                        $document
                            ->mime_type,

                        'file_size' =>
                        $document
                            ->file_size,

                        'status' =>
                        $document
                            ->verification_status,

                        'verified_at' =>
                        $document
                            ->verified_at
                            ?->toISOString(),

                        'rejection_reason' =>
                        $document
                            ->rejection_reason,
                    ]
                )
                ->values(),

            'reviewed_by' =>
            $this->reviewedBy
                ? [
                    'id' =>
                    $this
                        ->reviewedBy
                        ->id,

                    'name' =>
                    $this
                        ->reviewedBy
                        ->name,
                ]
                : null,
            'financial' =>
            $this
                ->resource
                ->financialSummary(),
        ];
    }
}
