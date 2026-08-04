<?php

namespace Database\Seeders;

use App\Enums\Currency;
use App\Models\Contract;
use App\Models\PriceList;
use App\Models\Property;
use App\Models\PropertyContract;
use App\Models\RoomType;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PriceListSeeder extends Seeder
{
    public function run(): void
    {
        $effectiveFrom = Carbon::create(
            2026,
            1,
            1
        )->toDateString();

        /*
         * ŠEŠKINĖS — LONG TERM
         *
         * Utilities included.
         */
        $this->seedRates(
            propertySlug: 'seskines',
            contractCode: 'LONG_TERM',
            utilitiesIncluded: true,
            effectiveFrom: $effectiveFrom,
            rates: [
                1 => 160,
                2 => 190,
                3 => 170,
                4 => 150,
            ],
        );

        /*
         * LATGALIŲ — LONG TERM
         *
         * Utilities excluded.
         */
        $this->seedRates(
            propertySlug: 'latgaliu',
            contractCode: 'LONG_TERM',
            utilitiesIncluded: false,
            effectiveFrom: $effectiveFrom,
            rates: [
                1 => 220,
                2 => 180,
                3 => 160,
            ],
        );

        /*
         * PYLIMO — LONG TERM
         *
         * Utilities excluded.
         */
        $this->seedRates(
            propertySlug: 'pylimo',
            contractCode: 'LONG_TERM',
            utilitiesIncluded: false,
            effectiveFrom: $effectiveFrom,
            rates: [
                1 => 299,
                2 => 199,
                3 => 179,
            ],
        );

        /*
         * PYLIMO — SHORT TERM
         *
         * Nightly prices.
         */
        $this->seedRates(
            propertySlug: 'pylimo',
            contractCode: 'SHORT_TERM',
            utilitiesIncluded: null,
            effectiveFrom: $effectiveFrom,
            rates: [
                1 => 25,
                2 => 20,
                3 => 15,
            ],
        );
    }

    private function seedRates(
        string $propertySlug,
        string $contractCode,
        ?bool $utilitiesIncluded,
        string $effectiveFrom,
        array $rates,
    ): void {
        $property = Property::query()
            ->where('slug', $propertySlug)
            ->firstOrFail();

        $contract = Contract::query()
            ->where('code', $contractCode)
            ->firstOrFail();

        $propertyContract =
            PropertyContract::query()
                ->where(
                    'property_id',
                    $property->id
                )
                ->where(
                    'contract_id',
                    $contract->id
                )
                ->firstOrFail();

        foreach ($rates as $capacity => $price) {
            $roomType = RoomType::query()
                ->where(
                    'default_capacity',
                    $capacity
                )
                ->firstOrFail();

            PriceList::updateOrCreate(
                [
                    'property_contract_id' =>
                        $propertyContract->id,

                    'room_type_id' =>
                        $roomType->id,

                    'effective_from' =>
                        $effectiveFrom,
                ],
                [
                    'uuid' =>
                        (string) Str::uuid(),

                    'price' =>
                        $price,

                    'currency' =>
                        Currency::EUR->value,

                    'utilities_included' =>
                        $utilitiesIncluded,

                    'effective_until' =>
                        null,

                    'status' =>
                        true,
                ]
            );
        }
    }
}