<?php

namespace Database\Seeders;

use App\Models\Contract;
use App\Models\Property;
use App\Models\PropertyContract;
use Illuminate\Database\Seeder;

class PropertyContractSeeder extends Seeder
{
    public function run(): void
    {
        $shortTerm = Contract::query()
            ->where('code', 'SHORT_TERM')
            ->firstOrFail();

        $longTerm = Contract::query()
            ->where('code', 'LONG_TERM')
            ->firstOrFail();

        $seskines = Property::query()
            ->where('slug', 'seskines')
            ->firstOrFail();

        $latgaliu = Property::query()
            ->where('slug', 'latgaliu')
            ->firstOrFail();

        $pylimo = Property::query()
            ->where('slug', 'pylimo')
            ->firstOrFail();

        /*
         * Šeškinės:
         * Long Term only.
         */
        PropertyContract::updateOrCreate(
            [
                'property_id' => $seskines->id,
                'contract_id' => $longTerm->id,
            ],
            [
                'allowed_floors' => null,
                'status' => true,
            ]
        );

        /*
         * Latgalių:
         * Long Term only.
         */
        PropertyContract::updateOrCreate(
            [
                'property_id' => $latgaliu->id,
                'contract_id' => $longTerm->id,
            ],
            [
                'allowed_floors' => null,
                'status' => true,
            ]
        );

        /*
         * Pylimo:
         * Long Term.
         */
        PropertyContract::updateOrCreate(
            [
                'property_id' => $pylimo->id,
                'contract_id' => $longTerm->id,
            ],
            [
                'allowed_floors' => null,
                'status' => true,
            ]
        );

        /*
         * Pylimo:
         * Short Term only on floors 3 and 4.
         */
        PropertyContract::updateOrCreate(
            [
                'property_id' => $pylimo->id,
                'contract_id' => $shortTerm->id,
            ],
            [
                'allowed_floors' => [3, 4],
                'status' => true,
            ]
        );
    }
}