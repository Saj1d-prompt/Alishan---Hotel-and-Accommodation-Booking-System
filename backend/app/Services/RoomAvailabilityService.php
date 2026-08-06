<?php

namespace App\Services;

use App\Enums\BookingStatus;
use App\Enums\StayTerm;
use App\Models\PropertyContract;
use App\Models\Room;
use App\Models\RoomType;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Validation\ValidationException;

class RoomAvailabilityService
{
    /**
     * Booking states which actually reserve/block
     * a physical room.
     */
    private const BLOCKING_STATUSES = [
        BookingStatus::AWAITING_PAYMENT->value,
        BookingStatus::CONFIRMED->value,
        BookingStatus::CHECKED_IN->value,
    ];

    /**
     * Resolve the actual stay dates which should
     * be used when checking physical inventory.
     *
     * @return array{
     *     check_in: CarbonImmutable,
     *     check_out: CarbonImmutable,
     *     duration_units: int
     * }
     */
    public function resolveStayPeriod(
        PropertyContract $propertyContract,
        StayTerm $stayTerm,
        ?string $requestedCheckIn = null,
        ?string $requestedCheckOut = null
    ): array {
        $propertyContract->loadMissing(
            'contract'
        );

        $contract =
            $propertyContract->contract;

        if (
            $stayTerm ===
            StayTerm::SHORT_TERM
        ) {
            if (
                ! $requestedCheckIn
                || ! $requestedCheckOut
            ) {
                throw ValidationException::withMessages([
                    'start_date' => [
                        'Short-term availability requires arrival and departure dates.',
                    ],
                ]);
            }

            $checkIn =
                CarbonImmutable::createFromFormat(
                    'Y-m-d',
                    $requestedCheckIn
                )->startOfDay();

            $checkOut =
                CarbonImmutable::createFromFormat(
                    'Y-m-d',
                    $requestedCheckOut
                )->startOfDay();

            if (
                $checkOut->lessThanOrEqualTo(
                    $checkIn
                )
            ) {
                throw ValidationException::withMessages([
                    'end_date' => [
                        'The departure date must be after the arrival date.',
                    ],
                ]);
            }

            $nights = (int)
                $checkIn->diffInDays(
                    $checkOut
                );

            $minimumNights =
                $contract->min_nights ?? 1;

            if (
                $nights <
                $minimumNights
            ) {
                throw ValidationException::withMessages([
                    'end_date' => [
                        "The stay must be at least {$minimumNights} night(s).",
                    ],
                ]);
            }

            if (
                $contract->max_months
                !== null
            ) {
                $latestAllowedDate =
                    $checkIn
                        ->addMonthsNoOverflow(
                            $contract->max_months
                        );

                if (
                    $checkOut->greaterThan(
                        $latestAllowedDate
                    )
                ) {
                    throw ValidationException::withMessages([
                        'end_date' => [
                            "A short-term stay cannot exceed {$contract->max_months} months.",
                        ],
                    ]);
                }
            }

            return [
                'check_in' =>
                    $checkIn,

                'check_out' =>
                    $checkOut,

                'duration_units' =>
                    $nights,
            ];
        }

        /*
         * LONG TERM
         *
         * The contract already contains the fixed
         * start/end month and day.
         */
        if (
            ! $contract->fixed_start_month
            || ! $contract->fixed_start_day
            || ! $contract->fixed_end_month
            || ! $contract->fixed_end_day
        ) {
            throw ValidationException::withMessages([
                'term' => [
                    'The long-term contract period has not been configured.',
                ],
            ]);
        }

        $today =
            CarbonImmutable::today();

        $startYear =
            $today->year;

        $checkIn =
            CarbonImmutable::create(
                $startYear,
                $contract
                    ->fixed_start_month,
                $contract
                    ->fixed_start_day
            )->startOfDay();

        /*
         * If this year's fixed start date has
         * already passed, use the next contract
         * period.
         */
        if (
            $today->greaterThan(
                $checkIn
            )
        ) {
            $startYear++;

            $checkIn =
                CarbonImmutable::create(
                    $startYear,
                    $contract
                        ->fixed_start_month,
                    $contract
                        ->fixed_start_day
                )->startOfDay();
        }

        $checkOut =
            CarbonImmutable::create(
                $startYear,
                $contract
                    ->fixed_end_month,
                $contract
                    ->fixed_end_day
            )->startOfDay();

        /*
         * Example:
         *
         * start: September 1
         * end:   August 31
         *
         * Therefore end belongs to the following
         * calendar year.
         */
        if (
            $checkOut->lessThanOrEqualTo(
                $checkIn
            )
        ) {
            $checkOut =
                $checkOut->addYear();
        }

        return [
            'check_in' =>
                $checkIn,

            'check_out' =>
                $checkOut,

            /*
             * Current long-term billing period
             * is 12 months.
             */
            'duration_units' => 12,
        ];
    }

    /**
     * Return all currently available physical
     * rooms for a room type and stay period.
     */
    public function availableRooms(
        PropertyContract $propertyContract,
        RoomType $roomType,
        int $occupants,
        CarbonImmutable $checkIn,
        CarbonImmutable $checkOut
    ): Collection {
        return $this
            ->availableRoomsQuery(
                $propertyContract,
                $roomType,
                $occupants,
                $checkIn,
                $checkOut
            )
            ->orderBy('floor')
            ->orderBy('display_order')
            ->orderBy('room_number')
            ->get();
    }

    /**
     * Count available rooms without loading all
     * room models.
     */
    public function countAvailableRooms(
        PropertyContract $propertyContract,
        RoomType $roomType,
        int $occupants,
        CarbonImmutable $checkIn,
        CarbonImmutable $checkOut
    ): int {
        return $this
            ->availableRoomsQuery(
                $propertyContract,
                $roomType,
                $occupants,
                $checkIn,
                $checkOut
            )
            ->count();
    }

    /**
     * Public booking submission protection.
     *
     * Even if someone manually modifies the
     * frontend URL/request, Laravel refuses a
     * booking when no physical room is currently
     * available.
     */
    public function assertRoomTypeAvailable(
        PropertyContract $propertyContract,
        RoomType $roomType,
        int $occupants,
        CarbonImmutable $checkIn,
        CarbonImmutable $checkOut
    ): void {
        $available =
            $this->countAvailableRooms(
                $propertyContract,
                $roomType,
                $occupants,
                $checkIn,
                $checkOut
            );

        if ($available > 0) {
            return;
        }

        throw ValidationException::withMessages([
            'room_type_slug' => [
                'This room type is no longer available for the selected stay. Please choose another room type or location.',
            ],
        ]);
    }

    private function availableRoomsQuery(
        PropertyContract $propertyContract,
        RoomType $roomType,
        int $occupants,
        CarbonImmutable $checkIn,
        CarbonImmutable $checkOut
    ): Builder {
        $query =
            Room::query()
                ->where(
                    'property_id',
                    $propertyContract
                        ->property_id
                )
                ->where(
                    'room_type_id',
                    $roomType->id
                )
                ->where(
                    'status',
                    true
                )
                ->whereNotNull(
                    'capacity'
                )
                ->where(
                    'capacity',
                    '>=',
                    $occupants
                );

        /*
         * Pylimo short-term currently restricts
         * physical inventory to floors 3 and 4.
         *
         * We do not hard-code those floors here.
         * They come from property_contracts.
         */
        $allowedFloors =
            collect(
                $propertyContract
                    ->allowed_floors
                ?? []
            )
                ->filter(
                    fn ($floor) =>
                        is_numeric($floor)
                )
                ->map(
                    fn ($floor) =>
                        (int) $floor
                )
                ->values()
                ->all();

        if (
            count($allowedFloors) > 0
        ) {
            $query->whereIn(
                'floor',
                $allowedFloors
            );
        }

        /*
         * A pending_review request does NOT block
         * inventory because no physical room has
         * been assigned yet.
         *
         * awaiting_payment / confirmed / checked_in
         * do block the room.
         */
        $query->whereDoesntHave(
            'bookingItems.booking',
            function (
                $bookingQuery
            ) use (
                $checkIn,
                $checkOut
            ) {
                $bookingQuery
                    ->whereIn(
                        'booking_status',
                        self::BLOCKING_STATUSES
                    )
                    ->whereDate(
                        'check_in_date',
                        '<',
                        $checkOut
                            ->toDateString()
                    )
                    ->whereDate(
                        'check_out_date',
                        '>',
                        $checkIn
                            ->toDateString()
                    );
            }
        );

        return $query;
    }
}