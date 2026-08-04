<?php

namespace Database\Seeders;

use App\Enums\ChargeBasis;
use App\Enums\Currency;
use App\Models\Contract;
use App\Models\PriceList;
use App\Models\Property;
use App\Models\PropertyContract;
use App\Models\RoomType;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PriceListSeeder extends Seeder
{
    /*
     * This represents the effective date of the current
     * pricing data supplied by the client.
     *
     * Change it later if the client provides an official
     * different effective date.
     */
    private const EFFECTIVE_FROM = '2026-08-01';

    public function run(): void
    {
        /*
         * ŠEŠKINĖS — LONG TERM
         *
         * All prices are:
         * - per person
         * - per month
         * - utilities included
         */
        $this->seedRates(
            propertySlug: 'seskines',
            contractCode: 'LONG_TERM',
            utilitiesIncluded: true,
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
         * All prices are:
         * - per person
         * - per month
         * - utilities excluded
         */
        $this->seedRates(
            propertySlug: 'latgaliu',
            contractCode: 'LONG_TERM',
            utilitiesIncluded: false,
            rates: [
                1 => 220,
                2 => 180,
                3 => 160,
            ],
        );

        /*
         * PYLIMO — LONG TERM
         *
         * All prices are:
         * - per person
         * - per month
         * - utilities excluded
         */
        $this->seedRates(
            propertySlug: 'pylimo',
            contractCode: 'LONG_TERM',
            utilitiesIncluded: false,
            rates: [
                1 => 299,
                2 => 199,
                3 => 179,
            ],
        );

        /*
         * PYLIMO — SHORT TERM
         *
         * All prices are:
         * - per person
         * - per night
         *
         * Floors 3 and 4 are configured through
         * property_contracts.allowed_floors.
         */
        $this->seedRates(
            propertySlug: 'pylimo',
            contractCode: 'SHORT_TERM',
            utilitiesIncluded: null,
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
        array $rates,
    ): void {
        $property = Property::query()
            ->where('slug', $propertySlug)
            ->firstOrFail();

        $contract = Contract::query()
            ->where('code', $contractCode)
            ->firstOrFail();

        $propertyContract = PropertyContract::query()
            ->where('property_id', $property->id)
            ->where('contract_id', $contract->id)
            ->firstOrFail();

        foreach ($rates as $capacity => $price) {
            $roomType = RoomType::query()
                ->where(
                    'default_capacity',
                    $capacity
                )
                ->firstOrFail();

            /*
             * Use firstOrNew instead of replacing UUIDs every
             * time the seeder is executed.
             */
            $priceList = PriceList::query()
                ->firstOrNew([
                    'property_contract_id' =>
                        $propertyContract->id,

                    'room_type_id' =>
                        $roomType->id,

                    'effective_from' =>
                        self::EFFECTIVE_FROM,
                ]);

            if (! $priceList->exists) {
                $priceList->uuid =
                    (string) Str::uuid();
            }

            $priceList->fill([
                'price' => $price,

                'currency' =>
                    Currency::EUR->value,

                'charge_basis' =>
                    ChargeBasis::PER_PERSON->value,

                'utilities_included' =>
                    $utilitiesIncluded,

                'effective_until' => null,

                'status' => true,
            ]);

            $priceList->save();
        }
    }
}