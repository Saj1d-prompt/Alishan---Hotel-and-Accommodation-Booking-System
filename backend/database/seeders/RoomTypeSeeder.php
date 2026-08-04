<?php

namespace Database\Seeders;

use App\Models\RoomType;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class RoomTypeSeeder extends Seeder
{
    public function run(): void
    {
        $roomTypes = [
            [
                'name' => '1 Bed Room',
                'slug' => '1-bed-room',
                'capacity' => 1,
                'display_order' => 1,
            ],

            [
                'name' => '2 Bed Room',
                'slug' => '2-bed-room',
                'capacity' => 2,
                'display_order' => 2,
            ],

            [
                'name' => '3 Bed Room',
                'slug' => '3-bed-room',
                'capacity' => 3,
                'display_order' => 3,
            ],

            [
                'name' => '4 Bed Room',
                'slug' => '4-bed-room',
                'capacity' => 4,
                'display_order' => 4,
            ],
        ];

        foreach ($roomTypes as $roomType) {
            RoomType::updateOrCreate(
                [
                    'slug' => $roomType['slug'],
                ],
                [
                    'uuid' => (string) Str::uuid(),

                    'name' => $roomType['name'],

                    'default_capacity' =>
                        $roomType['capacity'],

                    'display_order' =>
                        $roomType[
                            'display_order'
                        ],

                    'status' => true,
                ]
            );
        }
    }
}