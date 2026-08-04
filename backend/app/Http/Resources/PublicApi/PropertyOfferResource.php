<?php

namespace App\Http\Resources\PublicApi;

use App\Enums\StayTerm;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PropertyOfferResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $term = StayTerm::fromContractCode(
            $this->contract->code
        );

        $roomTypes = $this->priceLists
            ->filter(
                fn ($priceList) =>
                    $priceList->roomType !== null
            )
            ->sortBy(
                fn ($priceList) =>
                    $priceList
                        ->roomType
                        ->display_order
            )
            ->map(function ($priceList) {
                return [
                    'uuid' =>
                        $priceList->roomType->uuid,

                    'name' =>
                        $priceList->roomType->name,

                    'slug' =>
                        $priceList->roomType->slug,

                    'capacity' =>
                        $priceList
                            ->roomType
                            ->default_capacity,

                    'description' =>
                        $priceList
                            ->roomType
                            ->description,

                    'rate' => [
                        /*
                         * This is the price for one occupant
                         * for one billing unit.
                         */
                        'amount' =>
                            $priceList->price,

                        'currency' =>
                            $priceList
                                ->currency
                                ->value,

                        'billing_unit' =>
                            $this
                                ->contract
                                ->billing_unit,

                        'charge_basis' =>
                            $priceList
                                ->charge_basis
                                ->value,

                        'charge_basis_label' =>
                            $priceList
                                ->charge_basis
                                ->label(),

                        'utilities_included' =>
                            $priceList
                                ->utilities_included,
                    ],
                ];
            })
            ->values();

        return [
            'location' => [
                'uuid' =>
                    $this->property->uuid,

                'name' =>
                    $this->property->name,

                'slug' =>
                    $this->property->slug,

                'city' =>
                    $this->property
                        ->city
                        ?->name,
            ],

            'term' => [
                'code' =>
                    $term->value,

                'name' =>
                    $term->label(),

                'billing_unit' =>
                    $this->contract
                        ->billing_unit,
            ],

            'stay_rules' => [
                'minimum_nights' =>
                    $this->contract
                        ->min_nights,

                'maximum_months' =>
                    $this->contract
                        ->max_months,

                'fixed_period' =>
                    $this->fixedPeriod(),
            ],

            'allowed_floors' =>
                $this->allowed_floors,

            'room_types' =>
                $roomTypes,
        ];
    }

    private function fixedPeriod(): ?array
    {
        if (
            ! $this->contract->fixed_start_month
            || ! $this->contract->fixed_start_day
            || ! $this->contract->fixed_end_month
            || ! $this->contract->fixed_end_day
        ) {
            return null;
        }

        return [
            'start' => [
                'month' =>
                    $this->contract
                        ->fixed_start_month,

                'day' =>
                    $this->contract
                        ->fixed_start_day,
            ],

            'end' => [
                'month' =>
                    $this->contract
                        ->fixed_end_month,

                'day' =>
                    $this->contract
                        ->fixed_end_day,
            ],
        ];
    }
}