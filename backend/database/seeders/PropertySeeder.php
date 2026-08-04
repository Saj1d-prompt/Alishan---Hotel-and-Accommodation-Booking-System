<?php

namespace Database\Seeders;

use App\Models\City;
use App\Models\Property;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PropertySeeder extends Seeder
{
    public function run(): void
    {
        $vilnius = City::query()
            ->where('slug', 'vilnius')
            ->firstOrFail();

        $properties = [
            [
                'name' => 'Šeškinės',
                'slug' => 'seskines',
                'address' => null,
                'short_description' =>
                    'Long-term accommodation in Šeškinės, Vilnius.',
                'description' =>
                    'Comfortable long-term accommodation in Vilnius with furnished rooms and convenient access to nearby facilities.',
                'display_order' => 1,
            ],

            [
                'name' => 'Latgalių',
                'slug' => 'latgaliu',
                'address' => null,
                'short_description' =>
                    'Long-term accommodation in Latgalių, Vilnius.',
                'description' =>
                    'Affordable long-term accommodation in Vilnius with furnished rooms and shared facilities.',
                'display_order' => 2,
            ],

            [
                'name' => 'Pylimo gatvė 63',
                'slug' => 'pylimo',
                'address' => 'Pylimo g. 63',
                'short_description' =>
                    'Short-term and long-term accommodation in central Vilnius.',
                'description' =>
                    'Accommodation at Pylimo gatvė 63 offering both short-term and long-term accommodation options.',
                'display_order' => 3,
            ],
        ];

        foreach ($properties as $propertyData) {
            Property::updateOrCreate(
                [
                    'slug' => $propertyData['slug'],
                ],
                [
                    'uuid' => (string) Str::uuid(),

                    'city_id' => $vilnius->id,

                    'name' => $propertyData['name'],

                    'address' =>
                        $propertyData['address'],

                    'short_description' =>
                        $propertyData[
                            'short_description'
                        ],

                    'description' =>
                        $propertyData['description'],

                    'display_order' =>
                        $propertyData[
                            'display_order'
                        ],

                    'status' => true,
                ]
            );
        }
    }
}