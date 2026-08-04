<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $this->call([
            CountrySeeder::class,

            CitySeeder::class,

            PropertySeeder::class,

            RoomTypeSeeder::class,

            ContractSeeder::class,

            PropertyContractSeeder::class,

            PriceListSeeder::class,

            /*
             * Enable once the real physical room
             * inventory has been provided.
             */
            RoomSeeder::class,
        ]);
    }
}