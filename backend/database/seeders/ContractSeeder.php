<?php

namespace Database\Seeders;

use App\Models\Contract;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ContractSeeder extends Seeder
{
    public function run(): void
    {
        Contract::updateOrCreate(
            [
                'code' => 'SHORT_TERM',
            ],
            [
                'uuid' => (string) Str::uuid(),

                'name' => 'Short Term',

                'billing_unit' => 'night',

                'min_nights' => 1,

                'max_months' => 3,

                'fixed_start_month' => null,
                'fixed_start_day' => null,
                'fixed_end_month' => null,
                'fixed_end_day' => null,

                'description' =>
                    'Short-term accommodation from 1 night up to a maximum of 3 months.',

                'display_order' => 1,

                'status' => true,
            ]
        );

        Contract::updateOrCreate(
            [
                'code' => 'LONG_TERM',
            ],
            [
                'uuid' => (string) Str::uuid(),

                'name' => 'Long Term',

                'billing_unit' => 'month',

                'min_nights' => null,

                'max_months' => null,

                'fixed_start_month' => 9,
                'fixed_start_day' => 1,

                'fixed_end_month' => 8,
                'fixed_end_day' => 31,

                'description' =>
                    'Long-term accommodation period from 1 September to 31 August.',

                'display_order' => 2,

                'status' => true,
            ]
        );
    }
}