<?php

namespace Database\Seeders;

use App\Models\Country;
use Illuminate\Database\Seeder;

class CountrySeeder extends Seeder
{
    public function run(): void
    {
        Country::updateOrCreate(
            [
                'iso_code' => 'LT',
            ],
            [
                'name' => 'Lithuania',
                'status' => true,
            ]
        );
    }
}