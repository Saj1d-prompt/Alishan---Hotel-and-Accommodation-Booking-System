<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Enums\BookingStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ApproveBookingRequest;
use App\Http\Requests\Admin\RejectBookingRequest;
use App\Http\Resources\Admin\AdminBookingResource;
use App\Models\Booking;
use App\Models\PropertyContract;
use App\Models\Room;
use App\Services\BookingReviewService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Validation\Rule;

class BookingController extends Controller
{
    public function __construct(
        private readonly
        BookingReviewService
        $bookingReviewService
    ) {
    }

    public function index(
        Request $request
    ): AnonymousResourceCollection {
        $validated =
            $request->validate([
                'status' => [
                    'nullable',
                    Rule::enum(
                        BookingStatus::class
                    ),
                ],

                'search' => [
                    'nullable',
                    'string',
                    'max:100',
                ],

                'per_page' => [
                    'nullable',
                    'integer',
                    'min:5',
                    'max:100',
                ],
            ]);

        $bookings =
            Booking::query()
                ->with([
                    'guest',
                    'property.city',
                    'items.roomType',
                    'items.room',
                    'items.contract',
                    'documents',
                    'reviewedBy',
                ])
                ->when(
                    $validated['status']
                        ?? null,
                    fn ($query, $status) =>
                        $query->where(
                            'booking_status',
                            $status
                        )
                )
                ->when(
                    $validated['search']
                        ?? null,
                    function (
                        $query,
                        string $search
                    ) {
                        $query->where(
                            function (
                                $searchQuery
                            ) use ($search) {
                                $searchQuery
                                    ->where(
                                        'booking_reference',
                                        'like',
                                        "%{$search}%"
                                    )
                                    ->orWhereHas(
                                        'guest',
                                        function (
                                            $guestQuery
                                        ) use ($search) {
                                            $guestQuery
                                                ->where(
                                                    'first_name',
                                                    'like',
                                                    "%{$search}%"
                                                )
                                                ->orWhere(
                                                    'last_name',
                                                    'like',
                                                    "%{$search}%"
                                                )
                                                ->orWhere(
                                                    'email',
                                                    'like',
                                                    "%{$search}%"
                                                )
                                                ->orWhere(
                                                    'phone',
                                                    'like',
                                                    "%{$search}%"
                                                );
                                        }
                                    );
                            }
                        );
                    }
                )
                ->latest(
                    'submitted_at'
                )
                ->latest('id')
                ->paginate(
                    $validated['per_page']
                        ?? 20
                )
                ->withQueryString();

        return AdminBookingResource::collection(
            $bookings
        );
    }

    public function show(
        Booking $booking
    ): JsonResponse {
        $booking =
            $this
                ->bookingReviewService
                ->loadBooking($booking);

        $item =
            $booking
                ->items
                ->first();

        $availableRooms =
            collect();

        if (
            $item
            && $booking->booking_status
                === BookingStatus
                    ::PENDING_REVIEW
        ) {
            $propertyContract =
                PropertyContract::query()
                    ->where(
                        'property_id',
                        $booking
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

            $allowedFloors =
                $propertyContract
                    ?->allowed_floors;

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

            $availableRooms =
                Room::query()
                    ->where(
                        'property_id',
                        $booking
                            ->property_id
                    )
                    ->where(
                        'room_type_id',
                        $item
                            ->room_type_id
                    )
                    ->where(
                        'status',
                        true
                    )
                    ->where(
                        'capacity',
                        '>=',
                        $booking
                            ->guest_count
                    )
                    ->when(
                        is_array(
                            $allowedFloors
                        )
                        && count(
                            $allowedFloors
                        ) > 0,
                        fn ($query) =>
                            $query->whereIn(
                                'floor',
                                $allowedFloors
                            )
                    )
                    ->whereDoesntHave(
                        'bookingItems',
                        function (
                            $itemQuery
                        ) use (
                            $booking,
                            $blockingStatuses
                        ) {
                            $itemQuery
                                ->whereHas(
                                    'booking',
                                    function (
                                        $bookingQuery
                                    ) use (
                                        $booking,
                                        $blockingStatuses
                                    ) {
                                        $bookingQuery
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
                                );
                        }
                    )
                    ->orderBy(
                        'floor'
                    )
                    ->orderBy(
                        'room_number'
                    )
                    ->get([
                        'uuid',
                        'room_number',
                        'floor',
                        'capacity',
                    ]);
        }

        return response()->json([
            'data' => [
                'booking' =>
                    (
                        new AdminBookingResource(
                            $booking
                        )
                    )->resolve(
                        request()
                    ),

                'available_rooms' =>
                    $availableRooms,
            ],
        ]);
    }

    public function approve(
        ApproveBookingRequest $request,
        Booking $booking
    ): AdminBookingResource {
        $booking =
            $this
                ->bookingReviewService
                ->approve(
                    $booking,
                    $request->user(),
                    $request->validated()
                );

        return new AdminBookingResource(
            $booking
        );
    }

    public function reject(
        RejectBookingRequest $request,
        Booking $booking
    ): AdminBookingResource {
        $booking =
            $this
                ->bookingReviewService
                ->reject(
                    $booking,
                    $request->user(),
                    $request->validated(
                        'reason'
                    )
                );

        return new AdminBookingResource(
            $booking
        );
    }
}