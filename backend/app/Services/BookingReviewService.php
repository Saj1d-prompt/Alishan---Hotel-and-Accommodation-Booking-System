<?php

namespace App\Services;

use App\Enums\BookingStatus;
use App\Models\Booking;
use App\Models\BookingItem;
use App\Models\PropertyContract;
use App\Models\Room;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class BookingReviewService
{
    public function approve(
        Booking $booking,
        User $admin,
        array $data
    ): Booking {
        return DB::transaction(
            function () use (
                $booking,
                $admin,
                $data
            ) {
                $booking = Booking::query()
                    ->whereKey(
                        $booking->id
                    )
                    ->lockForUpdate()
                    ->firstOrFail();

                if (
                    $booking->booking_status
                    !== BookingStatus::PENDING_REVIEW
                ) {
                    throw ValidationException::withMessages([
                        'booking' => [
                            'Only pending booking requests can be approved.',
                        ],
                    ]);
                }

                $item = BookingItem::query()
                    ->where(
                        'booking_id',
                        $booking->id
                    )
                    ->with([
                        'roomType',
                        'contract',
                    ])
                    ->lockForUpdate()
                    ->firstOrFail();

                $passportVerified =
                    $booking
                        ->documents()
                        ->where(
                            'document_type',
                            'passport_copy'
                        )
                        ->where(
                            'verification_status',
                            'verified'
                        )
                        ->exists();

                if (! $passportVerified) {
                    throw ValidationException::withMessages([
                        'passport' => [
                            'The passport proof must be verified before approving this booking.',
                        ],
                    ]);
                }

                $room = Room::query()
                    ->where(
                        'uuid',
                        $data['room_uuid']
                    )
                    ->lockForUpdate()
                    ->firstOrFail();

                if (! $room->status) {
                    throw ValidationException::withMessages([
                        'room_uuid' => [
                            'The selected physical room is not active.',
                        ],
                    ]);
                }

                if (
                    $room->property_id
                    !== $booking->property_id
                ) {
                    throw ValidationException::withMessages([
                        'room_uuid' => [
                            'The selected room belongs to another property.',
                        ],
                    ]);
                }

                if (
                    $room->room_type_id
                    !== $item->room_type_id
                ) {
                    throw ValidationException::withMessages([
                        'room_uuid' => [
                            'The selected room does not match the requested room type.',
                        ],
                    ]);
                }

                if (
                    $room->capacity === null
                    || $room->capacity
                        < $booking->guest_count
                ) {
                    throw ValidationException::withMessages([
                        'room_uuid' => [
                            'The selected room cannot accommodate all occupants.',
                        ],
                    ]);
                }

                $propertyContract =
                    PropertyContract::query()
                        ->where(
                            'property_id',
                            $booking->property_id
                        )
                        ->where(
                            'contract_id',
                            $item->contract_id
                        )
                        ->where(
                            'status',
                            true
                        )
                        ->first();

                if (! $propertyContract) {
                    throw ValidationException::withMessages([
                        'booking' => [
                            'The property contract for this booking is no longer active.',
                        ],
                    ]);
                }

                $allowedFloors =
                    $propertyContract
                        ->allowed_floors;

                if (
                    is_array($allowedFloors)
                    && count($allowedFloors) > 0
                    && (
                        $room->floor === null
                        || ! in_array(
                            $room->floor,
                            $allowedFloors,
                            true
                        )
                    )
                ) {
                    throw ValidationException::withMessages([
                        'room_uuid' => [
                            'The selected room is on a floor that is not allowed for this accommodation term.',
                        ],
                    ]);
                }

                $blockingStatuses = [
                    BookingStatus::AWAITING_PAYMENT
                        ->value,

                    BookingStatus::CONFIRMED
                        ->value,

                    BookingStatus::CHECKED_IN
                        ->value,
                ];

                $roomIsOccupied =
                    BookingItem::query()
                        ->where(
                            'room_id',
                            $room->id
                        )
                        ->where(
                            'booking_id',
                            '!=',
                            $booking->id
                        )
                        ->whereHas(
                            'booking',
                            function (
                                $query
                            ) use (
                                $booking,
                                $blockingStatuses
                            ) {
                                $query
                                    ->whereIn(
                                        'booking_status',
                                        $blockingStatuses
                                    )
                                    ->whereDate(
                                        'check_in_date',
                                        '<',
                                        $booking
                                            ->check_out_date
                                    )
                                    ->whereDate(
                                        'check_out_date',
                                        '>',
                                        $booking
                                            ->check_in_date
                                    );
                            }
                        )
                        ->exists();

                if ($roomIsOccupied) {
                    throw ValidationException::withMessages([
                        'room_uuid' => [
                            'The selected room is already assigned for an overlapping stay.',
                        ],
                    ]);
                }

                $item->update([
                    'room_id' =>
                        $room->id,
                ]);

                $booking->update([
                    'total_amount' =>
                        $data[
                            'payable_amount'
                        ],

                    'booking_status' =>
                        BookingStatus
                            ::AWAITING_PAYMENT
                            ->value,

                    'reviewed_by_user_id' =>
                        $admin->id,

                    'reviewed_at' =>
                        now(),

                    'payment_due_at' =>
                        $data[
                            'payment_due_at'
                        ],

                    'rejection_reason' =>
                        null,
                ]);

                return $this->loadBooking(
                    $booking->fresh()
                );
            }
        );
    }

    public function reject(
        Booking $booking,
        User $admin,
        string $reason
    ): Booking {
        return DB::transaction(
            function () use (
                $booking,
                $admin,
                $reason
            ) {
                $booking = Booking::query()
                    ->whereKey(
                        $booking->id
                    )
                    ->lockForUpdate()
                    ->firstOrFail();

                if (
                    $booking->booking_status
                    !== BookingStatus::PENDING_REVIEW
                ) {
                    throw ValidationException::withMessages([
                        'booking' => [
                            'Only pending booking requests can be rejected.',
                        ],
                    ]);
                }

                $booking->update([
                    'booking_status' =>
                        BookingStatus
                            ::REJECTED
                            ->value,

                    'reviewed_by_user_id' =>
                        $admin->id,

                    'reviewed_at' =>
                        now(),

                    'rejection_reason' =>
                        $reason,

                    'payment_due_at' =>
                        null,

                    'total_amount' =>
                        null,
                ]);

                return $this->loadBooking(
                    $booking->fresh()
                );
            }
        );
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
        ]);
    }
}