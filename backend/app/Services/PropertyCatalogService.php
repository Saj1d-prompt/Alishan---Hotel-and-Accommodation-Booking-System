<?php

namespace App\Services;

use App\Enums\StayTerm;
use App\Models\Property;
use App\Models\PropertyContract;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Validation\ValidationException;

class PropertyCatalogService
{
    public function __construct(
        private readonly
        RoomAvailabilityService
        $roomAvailabilityService
    ) {
    }

    public function getLocations(): Collection
    {
        $today =
            now()->toDateString();

        return Property::query()
            ->where(
                'status',
                true
            )
            ->withCount('rooms')
            ->with([
                'city:id,name,slug',

                'images' => function (
                    $query
                ) {
                    $query
                        ->where(
                            'status',
                            true
                        )
                        ->orderByDesc(
                            'is_cover'
                        )
                        ->orderBy(
                            'sort_order'
                        );
                },

                'propertyContracts' =>
                    function (
                        $query
                    ) use ($today) {
                        $query
                            ->where(
                                'status',
                                true
                            )
                            ->whereHas(
                                'contract',
                                fn (
                                    $contractQuery
                                ) =>
                                    $contractQuery
                                        ->where(
                                            'status',
                                            true
                                        )
                            )
                            ->with([
                                'contract',

                                'priceLists' =>
                                    function (
                                        $priceQuery
                                    ) use (
                                        $today
                                    ) {
                                        $this
                                            ->applyCurrentPriceConstraints(
                                                $priceQuery,
                                                $today
                                            );

                                        $priceQuery
                                            ->with(
                                                'roomType'
                                            );
                                    },
                            ]);
                    },
            ])
            ->orderBy(
                'display_order'
            )
            ->orderBy('name')
            ->get();
    }

    public function getLocation(
        Property $property
    ): Property {
        $today =
            now()->toDateString();

        $property->loadCount(
            'rooms'
        );

        $property->load([
            'city:id,name,slug',

            'images' => function (
                $query
            ) {
                $query
                    ->where(
                        'status',
                        true
                    )
                    ->orderByDesc(
                        'is_cover'
                    )
                    ->orderBy(
                        'sort_order'
                    );
            },

            'propertyContracts' =>
                function (
                    $query
                ) use ($today) {
                    $query
                        ->where(
                            'status',
                            true
                        )
                        ->whereHas(
                            'contract',
                            fn (
                                $contractQuery
                            ) =>
                                $contractQuery
                                    ->where(
                                        'status',
                                        true
                                    )
                        )
                        ->with([
                            'contract',

                            'priceLists' =>
                                function (
                                    $priceQuery
                                ) use (
                                    $today
                                ) {
                                    $this
                                        ->applyCurrentPriceConstraints(
                                            $priceQuery,
                                            $today
                                        );

                                    $priceQuery
                                        ->with(
                                            'roomType'
                                        );
                                },
                        ]);
                },
        ]);

        return $property;
    }

    public function getRoomTypeOffers(
        Property $property,
        StayTerm $term,
        int $occupants,
        ?string $checkInDate = null,
        ?string $checkOutDate = null
    ): PropertyContract {
        $today =
            now()->toDateString();

        $propertyContract =
            $property
                ->propertyContracts()
                ->where(
                    'status',
                    true
                )
                ->whereHas(
                    'contract',
                    function (
                        $query
                    ) use ($term) {
                        $query
                            ->where(
                                'code',
                                $term
                                    ->contractCode()
                            )
                            ->where(
                                'status',
                                true
                            );
                    }
                )
                ->with([
                    'property.city',

                    'contract',

                    'priceLists' =>
                        function (
                            $query
                        ) use ($today) {
                            $this
                                ->applyCurrentPriceConstraints(
                                    $query,
                                    $today
                                );

                            $query->with([
                                'roomType' =>
                                    function (
                                        $roomTypeQuery
                                    ) {
                                        $roomTypeQuery
                                            ->where(
                                                'status',
                                                true
                                            );
                                    },
                            ]);
                        },
                ])
                ->first();

        if (! $propertyContract) {
            throw ValidationException::withMessages([
                'term' => [
                    "{$property->name} does not support {$term->label()} bookings.",
                ],
            ]);
        }

        /*
         * Resolve the exact period used for the
         * availability calculation.
         */
        $period =
            $this
                ->roomAvailabilityService
                ->resolveStayPeriod(
                    $propertyContract,
                    $term,
                    $checkInDate,
                    $checkOutDate
                );

        /*
         * Attach live physical availability to
         * each priced room type.
         */
        foreach (
            $propertyContract
                ->priceLists
            as $priceList
        ) {
            if (
                ! $priceList
                    ->roomType
            ) {
                continue;
            }

            $availableRoomCount =
                $this
                    ->roomAvailabilityService
                    ->countAvailableRooms(
                        $propertyContract,
                        $priceList
                            ->roomType,
                        $occupants,
                        $period[
                            'check_in'
                        ],
                        $period[
                            'check_out'
                        ]
                    );

            /*
             * Temporary runtime attribute only.
             * Nothing is written to price_lists.
             */
            $priceList->setAttribute(
                'available_room_count',
                $availableRoomCount
            );
        }

        $propertyContract->setAttribute(
            'availability_occupants',
            $occupants
        );

        $propertyContract->setAttribute(
            'availability_check_in',
            $period[
                'check_in'
            ]->toDateString()
        );

        $propertyContract->setAttribute(
            'availability_check_out',
            $period[
                'check_out'
            ]->toDateString()
        );

        return $propertyContract;
    }

    private function applyCurrentPriceConstraints(
        $query,
        string $today
    ): void {
        $query
            ->where(
                'status',
                true
            )
            ->whereDate(
                'effective_from',
                '<=',
                $today
            )
            ->where(
                function (
                    $dateQuery
                ) use ($today) {
                    $dateQuery
                        ->whereNull(
                            'effective_until'
                        )
                        ->orWhereDate(
                            'effective_until',
                            '>=',
                            $today
                        );
                }
            )
            ->whereHas(
                'roomType',
                fn (
                    $roomTypeQuery
                ) =>
                    $roomTypeQuery
                        ->where(
                            'status',
                            true
                        )
            );
    }
}