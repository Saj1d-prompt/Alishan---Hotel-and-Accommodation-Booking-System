<?php

namespace App\Services;

use App\Enums\BookingStatus;
use App\Models\Booking;
use App\Models\PropertyContract;
use App\Models\Room;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Validation\ValidationException;

class BookingReviewService
{
    public function __construct(
        private readonly
        BookingPaymentPlanService
        $bookingPaymentPlanService
    ) {
    }

    public function loadBooking(
        Booking $booking
    ): Booking {
        return $booking->load([
            'guest',

            'property.city',

            'items.roomType',

            'items.room',

            'items.contract',

            'items.priceList',

            'documents',

            'reviewedBy',

            'paymentInstallments',
        ]);
    }

    public function approve(
        Booking $booking,
        User $admin,
        array $data
    ): Booking {
        $approvedBooking =
            DB::transaction(
                function () use (
                    $booking,
                    $admin,
                    $data
                ) {
                    $lockedBooking =
                        Booking::query()
                            ->whereKey(
                                $booking
                                    ->getKey()
                            )
                            ->lockForUpdate()
                            ->firstOrFail();

                    $bookingStatus =
                        $lockedBooking
                            ->booking_status
                        instanceof BookingStatus
                            ? $lockedBooking
                                ->booking_status
                                ->value
                            : (string)
                            $lockedBooking
                                ->booking_status;

                    if (
                        $bookingStatus
                        !== BookingStatus
                            ::PENDING_REVIEW
                            ->value
                    ) {
                        throw ValidationException::withMessages([
                            'booking' => [
                                'Only pending bookings can be approved.',
                            ],
                        ]);
                    }

                    $item =
                        $lockedBooking
                            ->items()
                            ->lockForUpdate()
                            ->first();

                    if (! $item) {
                        throw ValidationException::withMessages([
                            'booking' => [
                                'This booking does not contain an accommodation item.',
                            ],
                        ]);
                    }

                    $this
                        ->assertPassportVerified(
                            $lockedBooking
                        );

                    $room =
                        Room::query()
                            ->where(
                                'uuid',
                                $data[
                                    'room_uuid'
                                ]
                            )
                            ->lockForUpdate()
                            ->first();

                    if (! $room) {
                        throw ValidationException::withMessages([
                            'room_uuid' => [
                                'The selected physical room could not be found.',
                            ],
                        ]);
                    }

                    $occupants =
                        (int) (
                            $item
                                ->occupants
                            ??
                            $lockedBooking
                                ->guest_count
                            ??
                            1
                        );

                    if (
                        ! $room->status
                        ||
                        (int)
                        $room
                            ->property_id
                        !==
                        (int)
                        $lockedBooking
                            ->property_id
                        ||
                        (int)
                        $room
                            ->room_type_id
                        !==
                        (int)
                        $item
                            ->room_type_id
                        ||
                        ! $room
                            ->capacity
                        ||
                        (int)
                        $room
                            ->capacity
                        < $occupants
                    ) {
                        throw ValidationException::withMessages([
                            'room_uuid' => [
                                'The selected physical room does not match this booking request.',
                            ],
                        ]);
                    }

                    $propertyContract =
                        PropertyContract::query()
                            ->where(
                                'property_id',
                                $lockedBooking
                                    ->property_id
                            )
                            ->where(
                                'contract_id',
                                $item
                                    ->contract_id
                            )
                            ->where(
                                'status',
                                true
                            )
                            ->first();

                    if (
                        ! $propertyContract
                    ) {
                        throw ValidationException::withMessages([
                            'room_uuid' => [
                                'The property contract for this booking is not active.',
                            ],
                        ]);
                    }

                    $allowedFloors =
                        $propertyContract
                            ->allowed_floors
                        ?? [];

                    if (
                        is_string(
                            $allowedFloors
                        )
                    ) {
                        $allowedFloors =
                            json_decode(
                                $allowedFloors,
                                true
                            )
                            ?: [];
                    }

                    $allowedFloors =
                        collect(
                            $allowedFloors
                        )
                            ->filter(
                                fn ($floor) =>
                                    is_numeric(
                                        $floor
                                    )
                            )
                            ->map(
                                fn ($floor) =>
                                    (int)
                                    $floor
                            )
                            ->values()
                            ->all();

                    if (
                        count(
                            $allowedFloors
                        ) > 0
                        &&
                        ! in_array(
                            (int)
                            $room->floor,
                            $allowedFloors,
                            true
                        )
                    ) {
                        throw ValidationException::withMessages([
                            'room_uuid' => [
                                'The selected room is not on a permitted floor for this booking term.',
                            ],
                        ]);
                    }

                    $blockingStatuses = [
                        BookingStatus
                            ::AWAITING_PAYMENT
                            ->value,

                        BookingStatus
                            ::CONFIRMED
                            ->value,

                        BookingStatus
                            ::CHECKED_IN
                            ->value,
                    ];

                    $hasConflict =
                        $room
                            ->bookingItems()
                            ->whereHas(
                                'booking',
                                function (
                                    $query
                                ) use (
                                    $lockedBooking,
                                    $blockingStatuses
                                ) {
                                    $query
                                        ->whereKeyNot(
                                            $lockedBooking
                                                ->getKey()
                                        )
                                        ->whereIn(
                                            'booking_status',
                                            $blockingStatuses
                                        )
                                        ->whereDate(
                                            'check_in_date',
                                            '<',
                                            $lockedBooking
                                                ->check_out_date
                                        )
                                        ->whereDate(
                                            'check_out_date',
                                            '>',
                                            $lockedBooking
                                                ->check_in_date
                                        );
                                }
                            )
                            ->exists();

                    if ($hasConflict) {
                        throw ValidationException::withMessages([
                            'room_uuid' => [
                                'The selected room is no longer available for these dates.',
                            ],
                        ]);
                    }

                    $item->forceFill([
                        'room_id' =>
                            $room->id,
                    ])->save();

                    $lockedBooking
                        ->forceFill([
                            'booking_status' =>
                                BookingStatus
                                    ::AWAITING_PAYMENT,

                            'reviewed_by_user_id' =>
                                $admin->id,

                            'reviewed_at' =>
                                now(),

                            'rejection_reason' =>
                                null,
                        ])
                        ->save();

                    /*
                     * Create the financial plan in
                     * the SAME transaction.
                     */
                    $this
                        ->bookingPaymentPlanService
                        ->createForApproval(
                            $lockedBooking,
                            $data
                        );

                    return $lockedBooking;
                }
            );

        return $this->loadBooking(
            $approvedBooking
                ->refresh()
        );
    }

    public function reject(
        Booking $booking,
        User $admin,
        string $reason
    ): Booking {
        $rejectedBooking =
            DB::transaction(
                function () use (
                    $booking,
                    $admin,
                    $reason
                ) {
                    $lockedBooking =
                        Booking::query()
                            ->whereKey(
                                $booking
                                    ->getKey()
                            )
                            ->lockForUpdate()
                            ->firstOrFail();

                    $bookingStatus =
                        $lockedBooking
                            ->booking_status
                        instanceof BookingStatus
                            ? $lockedBooking
                                ->booking_status
                                ->value
                            : (string)
                            $lockedBooking
                                ->booking_status;

                    if (
                        $bookingStatus
                        !== BookingStatus
                            ::PENDING_REVIEW
                            ->value
                    ) {
                        throw ValidationException::withMessages([
                            'booking' => [
                                'Only pending bookings can be rejected.',
                            ],
                        ]);
                    }

                    $lockedBooking
                        ->paymentInstallments()
                        ->delete();

                    $lockedBooking
                        ->forceFill([
                            'booking_status' =>
                                BookingStatus
                                    ::REJECTED,

                            'reviewed_by_user_id' =>
                                $admin->id,

                            'reviewed_at' =>
                                now(),

                            'rejection_reason' =>
                                $reason,

                            'payment_due_at' =>
                                null,
                        ])
                        ->save();

                    return $lockedBooking;
                }
            );

        return $this->loadBooking(
            $rejectedBooking
                ->refresh()
        );
    }

    private function assertPassportVerified(
        Booking $booking
    ): void {
        $documentsRelation =
            $booking
                ->documents();

        $documentTable =
            $documentsRelation
                ->getRelated()
                ->getTable();

        if (
            Schema::hasColumn(
                $documentTable,
                'verification_status'
            )
        ) {
            $verificationColumn =
                'verification_status';
        } elseif (
            Schema::hasColumn(
                $documentTable,
                'status'
            )
        ) {
            $verificationColumn =
                'status';
        } else {
            throw ValidationException::withMessages([
                'passport' => [
                    'Passport verification status is not configured correctly.',
                ],
            ]);
        }

        $verified =
            $documentsRelation
                ->where(
                    $verificationColumn,
                    'verified'
                )
                ->exists();

        if (! $verified) {
            throw ValidationException::withMessages([
                'passport' => [
                    'The passport proof must be verified before approving the booking.',
                ],
            ]);
        }
    }
}