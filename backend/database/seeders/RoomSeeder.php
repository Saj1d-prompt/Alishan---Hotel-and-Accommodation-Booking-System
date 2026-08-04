<?php

namespace Database\Seeders;

use App\Models\Property;
use App\Models\Room;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class RoomSeeder extends Seeder
{
    public function run(): void
    {
        $this->seedPropertyRooms(
            propertySlug: 'seskines',
            prefix: 'SES',
            totalRooms: 13,
        );

        $this->seedPropertyRooms(
            propertySlug: 'latgaliu',
            prefix: 'LAT',
            totalRooms: 9,
        );

        $this->seedPropertyRooms(
            propertySlug: 'pylimo',
            prefix: 'PYL',
            totalRooms: 24,
        );
    }

    private function seedPropertyRooms(
        string $propertySlug,
        string $prefix,
        int $totalRooms,
    ): void {
        $property = Property::query()
            ->where('slug', $propertySlug)
            ->firstOrFail();

        for ($number = 1; $number <= $totalRooms; $number++) {
            $roomNumber = sprintf(
                '%s-%03d',
                $prefix,
                $number
            );

            Room::updateOrCreate(
                [
                    'property_id' => $property->id,
                    'room_number' => $roomNumber,
                ],
                [
                    'uuid' => (string) Str::uuid(),

                    /*
                     * Must be assigned after receiving
                     * the real inventory information.
                     */
                    'room_type_id' => null,
                    'floor' => null,
                    'capacity' => null,

                    'description' =>
                        'Temporary inventory record awaiting real room details.',

                    'display_order' => $number,

                    /*
                     * Inactive rooms must not appear
                     * in availability searches.
                     */
                    'status' => false,
                ]
            );
        }
    }
}