<?php

namespace Database\Seeders;

use App\Models\City;
use App\Models\Country;
use Illuminate\Database\Seeder;

class CitySeeder extends Seeder
{
    public function run(): void
    {
        $lithuania = Country::query()
            ->where('iso_code', 'LT')
            ->firstOrFail();

        City::updateOrCreate(
            [
                'country_id' => $lithuania->id,
                'slug' => 'vilnius',
            ],
            [
                'name' => 'Vilnius',
                'status' => true,
            ]
        );
    }
}