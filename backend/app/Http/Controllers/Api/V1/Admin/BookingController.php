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
use App\Services\BookingNotificationService;
use App\Services\BookingReviewService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Validation\Rule;

class BookingController extends Controller
{
    public function __construct(
        private readonly BookingReviewService $bookingReviewService,
        private readonly BookingNotificationService $bookingNotificationService
    ) {
    }

    /**
     * List bookings for the Admin dashboard.
     */
    public function index(
        Request $request
    ): AnonymousResourceCollection {
        $validated =
            $request->validate([
                /*
                 * Real booking lifecycle status.
                 */
                'status' => [
                    'nullable',
                    Rule::enum(
                        BookingStatus::class
                    ),
                ],

                /*
                 * Derived financial-summary status.
                 *
                 * This remains separate from
                 * booking_status internally.
                 */
                'payment_status' => [
                    'nullable',
                    Rule::in([
                        'paid',
                        'partially_paid',
                    ]),
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

        /*
         * Total amount already applied to the
         * booking's payment installments.
         *
         * This follows Booking::financialSummary().
         */
        $paidAmountSql =
            '(SELECT COALESCE(
                SUM(
                    payment_installments.paid_amount
                ),
                0
            )
            FROM payment_installments
            WHERE payment_installments.booking_id
                = bookings.id)';

        /*
         * Before approval, estimated_total_amount
         * is authoritative.
         *
         * After approval, total_amount is
         * authoritative.
         */
        $bookingTotalSql =
            'COALESCE(
                bookings.total_amount,
                bookings.estimated_total_amount,
                0
            )';

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

                    /*
                     * AdminBookingResource calls
                     * financialSummary().
                     *
                     * Eager loading this relationship
                     * prevents an N+1 query.
                     */
                    'paymentInstallments',
                ])
                ->when(
                    $validated['status']
                        ?? null,
                    function (
                        $query,
                        string $status
                    ) {
                        $query->where(
                            'booking_status',
                            $status
                        );
                    }
                )
                ->when(
                    $validated['payment_status']
                        ?? null,
                    function (
                        $query,
                        string $paymentStatus
                    ) use (
                        $paidAmountSql,
                        $bookingTotalSql
                    ) {
                        if (
                            $paymentStatus
                            === 'paid'
                        ) {
                            /*
                             * Matches financialSummary():
                             *
                             * The booking has a valid
                             * total and no meaningful
                             * outstanding balance.
                             */
                            $query
                                ->whereRaw(
                                    "{$bookingTotalSql} > 0"
                                )
                                ->whereRaw(
                                    "{$paidAmountSql} >= ({$bookingTotalSql} - 0.009)"
                                );

                            return;
                        }

                        /*
                         * Partially paid means:
                         *
                         * 1. Some money has been paid.
                         * 2. An outstanding balance remains.
                         * 3. No outstanding installment is
                         *    currently overdue.
                         *
                         * financialSummary() gives overdue
                         * higher priority than partially_paid.
                         */
                        $query
                            ->whereRaw(
                                "{$paidAmountSql} > 0.009"
                            )
                            ->whereRaw(
                                "{$paidAmountSql} < ({$bookingTotalSql} - 0.009)"
                            )
                            ->whereDoesntHave(
                                'paymentInstallments',
                                function (
                                    $installmentQuery
                                ) {
                                    $installmentQuery
                                        ->where(
                                            'status',
                                            'pending'
                                        )
                                        ->whereColumn(
                                            'paid_amount',
                                            '<',
                                            'amount'
                                        )
                                        ->where(
                                            'due_at',
                                            '<',
                                            now()
                                        );
                                }
                            );
                    }
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

    /**
     * Show one booking and calculate the
     * physical rooms that can currently be
     * assigned to it.
     */
    public function show(
        Request $request,
        Booking $booking
    ): JsonResponse {
        $booking =
            $this
                ->bookingReviewService
                ->loadBooking(
                    $booking
                );

        $item =
            $booking
                ->items
                ->first();

        $availableRooms =
            collect();

        if (
            $item
            && $booking->booking_status
                === BookingStatus::PENDING_REVIEW
        ) {
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

            $allowedFloors =
                collect(
                    $propertyContract
                        ?->allowed_floors
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
                        $booking->property_id
                    )
                    ->where(
                        'room_type_id',
                        $item->room_type_id
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
                        $booking->guest_count
                    )
                    ->when(
                        count(
                            $allowedFloors
                        ) > 0,
                        function (
                            $query
                        ) use (
                            $allowedFloors
                        ) {
                            $query->whereIn(
                                'floor',
                                $allowedFloors
                            );
                        }
                    )
                    ->whereDoesntHave(
                        'bookingItems',
                        function (
                            $bookingItemQuery
                        ) use (
                            $booking,
                            $blockingStatuses
                        ) {
                            $bookingItemQuery
                                ->whereHas(
                                    'booking',
                                    function (
                                        $existingBookingQuery
                                    ) use (
                                        $booking,
                                        $blockingStatuses
                                    ) {
                                        $existingBookingQuery
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
                    ->orderByRaw(
                        'floor IS NULL'
                    )
                    ->orderBy(
                        'floor'
                    )
                    ->orderBy(
                        'display_order'
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
                        $request
                    ),

                'available_rooms' =>
                    $availableRooms,
            ],
        ]);
    }

    /**
     * Approve a pending booking.
     *
     * BookingReviewService performs the
     * authoritative transactional availability
     * check and room assignment.
     */
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

        /*
         * The approval transaction has already
         * completed at this point.
         *
         * Notify the no-account customer that
         * payment is now required.
         *
         * BookingNotificationService catches mail
         * problems so an SMTP failure cannot undo
         * an approved booking.
         */
        $this
            ->bookingNotificationService
            ->approved(
                $booking
            );

        return new AdminBookingResource(
            $booking
        );
    }

    /**
     * Reject a pending booking.
     */
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

        /*
         * Notify the customer after the database
         * transaction has successfully completed.
         */
        $this
            ->bookingNotificationService
            ->rejected(
                $booking
            );

        return new AdminBookingResource(
            $booking
        );
    }
}