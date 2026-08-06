<?php

namespace Database\Seeders;

use App\Models\Property;
use App\Models\Room;
use App\Models\RoomType;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use RuntimeException;

class RoomSeeder extends Seeder
{
    public function run(): void
    {
        DB::transaction(
            function (): void {
                /*
                 * IMPORTANT:
                 *
                 * Šeškinės and Latgalių capacities below
                 * are TEMPORARY TEST ASSIGNMENTS only.
                 *
                 * The client has confirmed the room numbers,
                 * but has not yet confirmed which physical
                 * rooms belong to each capacity/type.
                 *
                 * Replace these assignments when the real
                 * room-capacity information is supplied.
                 */

                $this->seedSeskinesRooms();

                $this->seedLatgaliuRooms();

                /*
                 * Pylimo data is based on the
                 * client-supplied room schedule.
                 */
                $this->seedPylimoRooms();
            }
        );
    }

    /**
     * TEMPORARY TEST CLASSIFICATION.
     *
     * Client-confirmed room numbers:
     * 0 through 13 = 14 rooms.
     */
    private function seedSeskinesRooms(): void
    {
        $property =
            Property::query()
                ->where(
                    'slug',
                    'seskines'
                )
                ->firstOrFail();

        $roomTypes =
            $this->roomTypesByCapacity([
                1,
                2,
                3,
                4,
            ]);

        /*
         * Deactivate any old placeholder inventory
         * such as SES-001, SES-002, etc.
         */
        Room::query()
            ->where(
                'property_id',
                $property->id
            )
            ->update([
                'status' => false,
            ]);

        $rooms = [
            /*
             * Temporary 1-person rooms.
             */
            [
                'room_number' => '0',
                'capacity' => 1,
            ],
            [
                'room_number' => '1',
                'capacity' => 1,
            ],
            [
                'room_number' => '2',
                'capacity' => 1,
            ],
            [
                'room_number' => '3',
                'capacity' => 1,
            ],

            /*
             * Temporary 2-person rooms.
             */
            [
                'room_number' => '4',
                'capacity' => 2,
            ],
            [
                'room_number' => '5',
                'capacity' => 2,
            ],
            [
                'room_number' => '6',
                'capacity' => 2,
            ],
            [
                'room_number' => '7',
                'capacity' => 2,
            ],

            /*
             * Temporary 3-person rooms.
             */
            [
                'room_number' => '8',
                'capacity' => 3,
            ],
            [
                'room_number' => '9',
                'capacity' => 3,
            ],
            [
                'room_number' => '10',
                'capacity' => 3,
            ],

            /*
             * Temporary 4-person rooms.
             */
            [
                'room_number' => '11',
                'capacity' => 4,
            ],
            [
                'room_number' => '12',
                'capacity' => 4,
            ],
            [
                'room_number' => '13',
                'capacity' => 4,
            ],
        ];

        foreach (
            $rooms as $index => $roomData
        ) {
            $capacity =
                $roomData['capacity'];

            $roomType =
                $roomTypes->get(
                    $capacity
                );

            $this->upsertRoom(
                property: $property,
                roomNumber:
                    $roomData[
                        'room_number'
                    ],

                roomTypeId:
                    $roomType->id,

                floor: null,

                capacity:
                    $capacity,

                sizeSqm: null,

                description:
                    'Client-confirmed Šeškinės room number. Capacity and room type are temporary development assignments pending client confirmation.',

                displayOrder:
                    $index + 1
            );
        }
    }

    /**
     * TEMPORARY TEST CLASSIFICATION.
     *
     * Client-confirmed room numbers:
     * 1 through 9 = 9 rooms.
     */
    private function seedLatgaliuRooms(): void
    {
        $property =
            Property::query()
                ->where(
                    'slug',
                    'latgaliu'
                )
                ->firstOrFail();

        $roomTypes =
            $this->roomTypesByCapacity([
                1,
                2,
                3,
            ]);

        /*
         * Deactivate old LAT-001 etc.
         */
        Room::query()
            ->where(
                'property_id',
                $property->id
            )
            ->update([
                'status' => false,
            ]);

        $rooms = [
            /*
             * Temporary 1-person rooms.
             */
            [
                'room_number' => '1',
                'capacity' => 1,
            ],
            [
                'room_number' => '2',
                'capacity' => 1,
            ],
            [
                'room_number' => '3',
                'capacity' => 1,
            ],

            /*
             * Temporary 2-person rooms.
             */
            [
                'room_number' => '4',
                'capacity' => 2,
            ],
            [
                'room_number' => '5',
                'capacity' => 2,
            ],
            [
                'room_number' => '6',
                'capacity' => 2,
            ],

            /*
             * Temporary 3-person rooms.
             */
            [
                'room_number' => '7',
                'capacity' => 3,
            ],
            [
                'room_number' => '8',
                'capacity' => 3,
            ],
            [
                'room_number' => '9',
                'capacity' => 3,
            ],
        ];

        foreach (
            $rooms as $index => $roomData
        ) {
            $capacity =
                $roomData['capacity'];

            $roomType =
                $roomTypes->get(
                    $capacity
                );

            $this->upsertRoom(
                property: $property,
                roomNumber:
                    $roomData[
                        'room_number'
                    ],

                roomTypeId:
                    $roomType->id,

                floor: null,

                capacity:
                    $capacity,

                sizeSqm: null,

                description:
                    'Client-confirmed Latgalių room number. Capacity and room type are temporary development assignments pending client confirmation.',

                displayOrder:
                    $index + 1
            );
        }
    }

    /**
     * Client-supplied Pylimo g. 63 room inventory.
     */
    private function seedPylimoRooms(): void
    {
        $property =
            Property::query()
                ->where(
                    'slug',
                    'pylimo'
                )
                ->firstOrFail();

        $roomTypes =
            $this->roomTypesByCapacity([
                1,
                2,
                3,
            ]);

        /*
         * Deactivate old PYL-001 ... PYL-024
         * placeholders.
         */
        Room::query()
            ->where(
                'property_id',
                $property->id
            )
            ->update([
                'status' => false,
            ]);

        $rooms = [
            /*
             * 1st Floor
             */
            [
                'room_number' => '46',
                'floor' => 1,
                'size_sqm' => 7.41,
                'capacity' => 1,
            ],
            [
                'room_number' => '47',
                'floor' => 1,
                'size_sqm' => 8.42,
                'capacity' => 1,
            ],
            [
                'room_number' => '49',
                'floor' => 1,
                'size_sqm' => 9.83,
                'capacity' => 1,
            ],
            [
                'room_number' => '50',
                'floor' => 1,
                'size_sqm' => 7.48,
                'capacity' => 1,
            ],
            [
                'room_number' => '53',
                'floor' => 1,
                'size_sqm' => 12.95,
                'capacity' => 2,
            ],
            [
                'room_number' => '41',
                'floor' => 1,
                'size_sqm' => 30.12,
                'capacity' => 3,
            ],

            /*
             * 2nd Floor
             */
            [
                'room_number' => '65',
                'floor' => 2,
                'size_sqm' => 9.73,
                'capacity' => 1,
            ],
            [
                'room_number' => '71',
                'floor' => 2,
                'size_sqm' => 8.40,
                'capacity' => 1,
            ],
            [
                'room_number' => '60',
                'floor' => 2,
                'size_sqm' => 12.90,
                'capacity' => 2,
            ],
            [
                'room_number' => '61',
                'floor' => 2,
                'size_sqm' => 13.70,
                'capacity' => 2,
            ],
            [
                'room_number' => '63',
                'floor' => 2,
                'size_sqm' => 11.72,
                'capacity' => 2,
            ],
            [
                'room_number' => '72',
                'floor' => 2,
                'size_sqm' => 13.10,
                'capacity' => 2,
            ],
            [
                'room_number' => '56',
                'floor' => 2,
                'size_sqm' => 19.02,
                'capacity' => 3,
            ],

            /*
             * 3rd Floor
             */
            [
                'room_number' => '78',
                'floor' => 3,
                'size_sqm' => 14.23,
                'capacity' => 2,
            ],
            [
                'room_number' => '79',
                'floor' => 3,
                'size_sqm' => 13.34,
                'capacity' => 2,
            ],
            [
                'room_number' => '81',
                'floor' => 3,
                'size_sqm' => 13.34,
                'capacity' => 2,
            ],
            [
                'room_number' => '83',
                'floor' => 3,
                'size_sqm' => 10.53,
                'capacity' => 2,
            ],
            [
                'room_number' => '90',
                'floor' => 3,
                'size_sqm' => 13.08,
                'capacity' => 2,
            ],
            [
                'room_number' => '74',
                'floor' => 3,
                'size_sqm' => 18.89,
                'capacity' => 3,
            ],

            /*
             * Mansard / Attic
             *
             * Stored internally as floor 4.
             */
            [
                'room_number' => '100',
                'floor' => 4,
                'size_sqm' => 9.52,
                'capacity' => 1,
            ],
            [
                'room_number' => '96',
                'floor' => 4,
                'size_sqm' => 12.94,
                'capacity' => 2,
            ],
            [
                'room_number' => '92',
                'floor' => 4,
                'size_sqm' => 22.89,
                'capacity' => 3,
            ],
            [
                'room_number' => '95',
                'floor' => 4,
                'size_sqm' => 18.76,
                'capacity' => 3,
            ],
            [
                'room_number' => '99',
                'floor' => 4,
                'size_sqm' => 15.79,
                'capacity' => 3,
            ],
            [
                'room_number' => '107',
                'floor' => 4,
                'size_sqm' => 18.74,
                'capacity' => 3,
            ],
        ];

        foreach (
            $rooms as $index => $roomData
        ) {
            $capacity =
                $roomData['capacity'];

            $roomType =
                $roomTypes->get(
                    $capacity
                );

            $this->upsertRoom(
                property: $property,

                roomNumber:
                    $roomData[
                        'room_number'
                    ],

                roomTypeId:
                    $roomType->id,

                floor:
                    $roomData[
                        'floor'
                    ],

                capacity:
                    $capacity,

                sizeSqm:
                    $roomData[
                        'size_sqm'
                    ],

                description:
                    'Client-confirmed physical room at Pylimo g. 63.',

                displayOrder:
                    $index + 1
            );
        }
    }

    /**
     * Return room types keyed by physical capacity.
     */
    private function roomTypesByCapacity(
        array $capacities
    ) {
        $slugs =
            collect($capacities)
                ->map(
                    fn (
                        int $capacity
                    ) =>
                        "{$capacity}-bed-room"
                )
                ->values();

        $roomTypes =
            RoomType::query()
                ->whereIn(
                    'slug',
                    $slugs
                )
                ->get();

        $result =
            collect();

        foreach (
            $capacities as $capacity
        ) {
            $slug =
                "{$capacity}-bed-room";

            $roomType =
                $roomTypes->firstWhere(
                    'slug',
                    $slug
                );

            if (! $roomType) {
                throw new RuntimeException(
                    "Room type [{$slug}] does not exist. Run RoomTypeSeeder first."
                );
            }

            $result->put(
                $capacity,
                $roomType
            );
        }

        return $result;
    }

    /**
     * Create/update one real physical room
     * without changing an existing room UUID.
     */
    private function upsertRoom(
        Property $property,
        string $roomNumber,
        int $roomTypeId,
        ?int $floor,
        int $capacity,
        ?float $sizeSqm,
        string $description,
        int $displayOrder
    ): void {
        $room =
            Room::withTrashed()
                ->where(
                    'property_id',
                    $property->id
                )
                ->where(
                    'room_number',
                    $roomNumber
                )
                ->first();

        if (! $room) {
            $room =
                new Room([
                    'uuid' =>
                        (string)
                        Str::uuid(),

                    'property_id' =>
                        $property->id,

                    'room_number' =>
                        $roomNumber,
                ]);
        } elseif (
            $room->trashed()
        ) {
            $room->restore();
        }

        $room->fill([
            'room_type_id' =>
                $roomTypeId,

            'floor' =>
                $floor,

            'capacity' =>
                $capacity,

            'size_sqm' =>
                $sizeSqm,

            'description' =>
                $description,

            'display_order' =>
                $displayOrder,

            /*
             * All current rooms are enabled
             * so the full application flow can
             * be tested.
             */
            'status' =>
                true,
        ]);

        $room->save();
    }
}